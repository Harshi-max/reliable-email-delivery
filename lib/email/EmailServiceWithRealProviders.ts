import type { EmailRequest, EmailResponse, EmailProvider, EmailServiceConfig } from "./types"
import { SendGridProvider } from "./providers/SendGridProvider"
import { ResendProvider } from "./providers/ResendProvider"
import { NodemailerProvider } from "./providers/NodemailerProvider"
import { RetryManager } from "./utils/RetryManager"
import { RateLimiter } from "./utils/RateLimiter"
import { CircuitBreaker } from "./utils/CircuitBreaker"
import { IdempotencyManager } from "./utils/IdempotencyManager"
import { Logger } from "./utils/Logger"
import { ErrorNormalizer } from "./utils/ErrorNormalizer"

// ✅ ADDED: Provider health history tracking
import { providerHealthHistoryStore } from "../monitoring/providerHealthHistory"

export class RealEmailService {
  private providers: EmailProvider[]
  private retryManager: RetryManager
  private rateLimiter: RateLimiter
  private circuitBreakers: Map<string, CircuitBreaker>
  private idempotencyManager: IdempotencyManager
  private logger: Logger
  private config: EmailServiceConfig

  constructor(config?: Partial<EmailServiceConfig>) {
    this.config = {
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
      },
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000,
      },
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 30000,
        monitoringPeriod: 60000,
      },
      enableQueue: true,
      queueProcessingInterval: 5000,
      ...config,
    }

    this.providers = this.initializeProviders()

    this.retryManager = new RetryManager(this.config.retry)
    this.rateLimiter = new RateLimiter(this.config.rateLimit)
    this.circuitBreakers = new Map()
    this.idempotencyManager = new IdempotencyManager()
    this.logger = new Logger()

    this.providers.forEach((provider) => {
      this.circuitBreakers.set(provider.name, new CircuitBreaker(this.config.circuitBreaker, provider.name))
    })
  }

  private initializeProviders(): EmailProvider[] {
    const providers: EmailProvider[] = []

    if (process.env.SENDGRID_API_KEY) {
      providers.push(new SendGridProvider(process.env.SENDGRID_API_KEY))
    }

    if (process.env.RESEND_API_KEY) {
      providers.push(new ResendProvider(process.env.RESEND_API_KEY))
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      providers.push(
        new NodemailerProvider({
          host: process.env.SMTP_HOST,
          port: Number.parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }),
      )
    }

    if (providers.length === 0) {
      throw new Error("No email providers configured. Please set up at least one provider with environment variables.")
    }

    return providers
  }

  async sendEmail(request: EmailRequest, idempotencyKey?: string): Promise<EmailResponse> {
    const requestId = idempotencyKey || this.generateRequestId(request)

    this.logger.info(`Attempting to send email with real providers`, { requestId, to: request.to })

    const existingResponse = this.idempotencyManager.getResponse(requestId)
    if (existingResponse) {
      this.logger.info(`Returning cached response for idempotent request`, { requestId })
      return existingResponse
    }

    if (!this.rateLimiter.allowRequest()) {
      const error = "Rate limit exceeded"
      this.logger.warn(error, { requestId })
      const normalized = ErrorNormalizer.normalize(error)
      const response: EmailResponse = {
        id: requestId,
        status: "failed",
        error,
        normalizedError: {
          explanation: normalized.explanation,
          category: normalized.category,
          severity: normalized.severity,
          suggestedAction: normalized.suggestedAction,
          shouldRetry: normalized.shouldRetry,
          shouldFallback: normalized.shouldFallback,
        },
        attempts: 0,
        timestamp: new Date(),
      }
      this.idempotencyManager.storeResponse(requestId, response)
      throw new Error(error)
    }

    try {
      const response = await this.sendWithRetryAndFallback(request, requestId)
      this.idempotencyManager.storeResponse(requestId, response)
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      this.logger.error(`Failed to send email after all attempts`, {
        requestId,
        error: errorMessage,
      })

      const normalized = ErrorNormalizer.normalize(error instanceof Error ? error : errorMessage)
      const response: EmailResponse = {
        id: requestId,
        status: "failed",
        error: errorMessage,
        normalizedError: {
          explanation: normalized.explanation,
          category: normalized.category,
          severity: normalized.severity,
          suggestedAction: normalized.suggestedAction,
          shouldRetry: normalized.shouldRetry,
          shouldFallback: normalized.shouldFallback,
        },
        attempts: this.config.retry.maxAttempts,
        timestamp: new Date(),
      }

      this.idempotencyManager.storeResponse(requestId, response)
      throw error
    }
  }

  private async sendWithRetryAndFallback(request: EmailRequest, requestId: string): Promise<EmailResponse> {
    let lastError: Error | null = null
    let totalAttempts = 0

    for (const provider of this.providers) {
      const circuitBreaker = this.circuitBreakers.get(provider.name)!

      if (!circuitBreaker.canExecute()) {
        this.logger.warn(`Circuit breaker open for provider ${provider.name}`, { requestId })
        continue
      }

      try {
        const response = await this.retryManager.executeWithRetry(async (attempt: number) => {
          totalAttempts = attempt
          this.logger.info(`Sending email via ${provider.name}`, {
            requestId,
            attempt,
            provider: provider.name,
          })

          const result = await provider.sendEmail(request)
          result.attempts = totalAttempts
          return result
        })

        circuitBreaker.recordSuccess()

        // ✅ ADDED: record healthy provider event
        providerHealthHistoryStore.record({
          provider: provider.name,
          status: "healthy",
          timestamp: new Date().toISOString(),
        })

        this.logger.info(`Email sent successfully via ${provider.name}`, {
          requestId,
          provider: provider.name,
          attempts: totalAttempts,
        })

        return {
          ...response,
          provider: provider.name,
          attempts: totalAttempts,
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")
        circuitBreaker.recordFailure()

        // ✅ ADDED: record unhealthy provider event
        providerHealthHistoryStore.record({
          provider: provider.name,
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          reason: lastError.message,
        })

        this.logger.warn(`Provider ${provider.name} failed`, {
          requestId,
          provider: provider.name,
          error: lastError.message,
          attempts: totalAttempts,
        })
      }
    }

    throw lastError || new Error("All providers failed")
  }

  private generateRequestId(request: EmailRequest): string {
    const hash = Buffer.from(`${request.to}-${request.subject}-${request.body}-${Date.now()}`).toString("base64")
    return hash.substring(0, 16)
  }

  getProviderStatus(): Array<{ name: string; healthy: boolean; circuitBreakerState: string }> {
    return this.providers.map((provider) => ({
      name: provider.name,
      healthy: provider.isHealthy(),
      circuitBreakerState: this.circuitBreakers.get(provider.name)?.getState() || "UNKNOWN",
    }))
  }
}
