import type { EmailRequest, EmailResponse, EmailProvider, EmailServiceConfig, QueuedEmail } from "./types"
import { ResendProvider } from "./providers/ResendProvider"
import { MockEmailProviderA } from "./providers/MockEmailProviderA"
import { MockEmailProviderB } from "./providers/MockEmailProviderB"
import { RetryManager } from "./utils/RetryManager"
import { RateLimiter } from "./utils/RateLimiter"
import { CircuitBreaker } from "./utils/CircuitBreaker"
import { IdempotencyManager } from "./utils/IdempotencyManager"
import { Logger } from "./utils/Logger"
import { ErrorHandler, EmailServiceError } from "./utils/ErrorHandler"
import { ErrorNormalizer } from "./utils/ErrorNormalizer"

export class EmailService {
  private providers: EmailProvider[]
  private retryManager: RetryManager
  private rateLimiter: RateLimiter
  private circuitBreakers: Map<string, CircuitBreaker>
  private idempotencyManager: IdempotencyManager
  private logger: Logger
  private emailQueue: QueuedEmail[]
  private config: EmailServiceConfig
  private queueProcessor?: NodeJS.Timeout

  constructor(config?: Partial<EmailServiceConfig & { providers?: EmailProvider[] }>) {
    this.config = {
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
      },
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000, // 1 minute
      },
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 30000, // 30 seconds
        monitoringPeriod: 60000, // 1 minute
      },
      enableQueue: true,
      queueProcessingInterval: 5000, // 5 seconds
      ...config,
    }

    // Use provided providers or default ones
    this.providers = config?.providers || [
      new ResendProvider("re_2HBELJFi_F1TAqXQf7MBQbha99oP8Lroi"),
      new MockEmailProviderA(),
      new MockEmailProviderB(),
    ]

    this.retryManager = new RetryManager(this.config.retry)
    this.rateLimiter = new RateLimiter(this.config.rateLimit)
    this.circuitBreakers = new Map()
    this.idempotencyManager = new IdempotencyManager()
    this.logger = new Logger()
    this.emailQueue = []

    // Initialize circuit breakers for each provider
    this.providers.forEach((provider) => {
      this.circuitBreakers.set(provider.name, new CircuitBreaker(this.config.circuitBreaker, provider.name))
    })

    if (this.config.enableQueue) {
      this.startQueueProcessor()
    }

    this.logger.info("Email service initialized with providers:", {
      providers: this.providers.map((p) => p.name),
    })
  }

  async sendEmail(request: EmailRequest, idempotencyKey?: string): Promise<EmailResponse> {
    const requestId = idempotencyKey || this.generateRequestId(request)
    this.logger.logRequest()

    this.logger.info(`Attempting to send email`, { requestId, to: request.to })

    // Check idempotency
    const existingResponse = this.idempotencyManager.getResponse(requestId)
    if (existingResponse) {
      this.logger.info(`Returning cached response for idempotent request`, { requestId })
      return existingResponse
    }

    // Check rate limiting
    if (!this.rateLimiter.allowRequest()) {
      const error = "Rate limit exceeded - too many requests"
      this.logger.error(error, { requestId, rateLimitStatus: "exceeded" })
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
      this.logger.logSuccess(response.provider)
      this.idempotencyManager.storeResponse(requestId, response)
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      this.logger.error(`Failed to send email after all attempts`, {
        requestId,
        error: errorMessage,
        totalProviders: this.providers.length,
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

      if (this.config.enableQueue) {
        this.addToQueue(request, requestId)
      }

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

        this.logger.error(`Provider ${provider.name} failed`, {
          requestId,
          provider: provider.name,
          error: lastError.message,
          attempts: totalAttempts,
          circuitBreakerState: circuitBreaker.getState(),
        })
      }
    }

    throw lastError || new Error("All providers failed")
  }

  private addToQueue(request: EmailRequest, requestId: string): void {
    const queuedEmail: QueuedEmail = {
      id: requestId,
      request,
      attempts: 0,
      nextRetry: new Date(Date.now() + this.config.retry.baseDelay),
      createdAt: new Date(),
    }

    this.emailQueue.push(queuedEmail)
    this.logger.info(`Added email to queue`, { requestId })
  }

  private startQueueProcessor(): void {
    this.queueProcessor = setInterval(() => {
      this.processQueue()
    }, this.config.queueProcessingInterval)
  }

  private async processQueue(): Promise<void> {
    if (this.emailQueue.length === 0) return

    const now = new Date()
    const readyEmails = this.emailQueue.filter((email) => email.nextRetry <= now)

    for (const queuedEmail of readyEmails) {
      try {
        await this.sendEmail(queuedEmail.request, queuedEmail.id)

        // Remove from queue on success
        this.emailQueue = this.emailQueue.filter((email) => email.id !== queuedEmail.id)
        this.logger.info(`Successfully processed queued email`, { requestId: queuedEmail.id })
      } catch (error) {
        queuedEmail.attempts++

        if (queuedEmail.attempts >= this.config.retry.maxAttempts) {
          // Remove from queue after max attempts
          this.emailQueue = this.emailQueue.filter((email) => email.id !== queuedEmail.id)
          this.logger.error(`Removing email from queue after max attempts`, {
            requestId: queuedEmail.id,
            attempts: queuedEmail.attempts,
          })
        } else {
          // Schedule next retry
          const delay = Math.min(
            this.config.retry.baseDelay * Math.pow(this.config.retry.backoffMultiplier, queuedEmail.attempts),
            this.config.retry.maxDelay,
          )
          queuedEmail.nextRetry = new Date(Date.now() + delay)

          this.logger.info(`Rescheduled queued email for retry`, {
            requestId: queuedEmail.id,
            nextRetry: queuedEmail.nextRetry,
            attempts: queuedEmail.attempts,
          })
        }
      }
    }
  }

  private generateRequestId(request: EmailRequest): string {
    const hash = Buffer.from(`${request.to}-${request.subject}-${request.body}-${Date.now()}`).toString("base64")
    return hash.substring(0, 16)
  }

  getQueueStatus(): { length: number; items: QueuedEmail[] } {
    return {
      length: this.emailQueue.length,
      items: [...this.emailQueue],
    }
  }

  getProviderStatus(): Array<{ name: string; healthy: boolean; circuitBreakerState: string }> {
    return this.providers.map((provider) => ({
      name: provider.name,
      healthy: provider.isHealthy(),
      circuitBreakerState: this.circuitBreakers.get(provider.name)?.getState() || "UNKNOWN",
    }))
  }

  shutdown(): void {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor)
    }
    this.logger.info("Email service shutdown completed")
  }

  getServiceMetrics() {
    return {
      ...this.logger.getMetrics(),
      queueLength: this.emailQueue.length,
      providersStatus: this.getProviderStatus(),
      uptime: process.uptime(),
    }
  }
}
