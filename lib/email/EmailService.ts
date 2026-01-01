import type { EmailRequest, EmailResponse, EmailProvider, EmailServiceConfig, QueuedEmail, QueueManager } from "./types"
import { ResendProvider } from "./providers/ResendProvider"
import { MockEmailProviderA } from "./providers/MockEmailProviderA"
import { MockEmailProviderB } from "./providers/MockEmailProviderB"
import { RetryManager } from "./utils/RetryManager"
import { RateLimiter } from "./utils/RateLimiter"
import { CircuitBreaker } from "./utils/CircuitBreaker"
import { IdempotencyManager } from "./utils/IdempotencyManager"
import { Logger } from "./utils/Logger"
import { MemoryQueueManager } from "./utils/MemoryQueueManager"

export class EmailService {
  private providers: EmailProvider[]
  private retryManager: RetryManager
  private rateLimiter: RateLimiter
  private circuitBreakers: Map<string, CircuitBreaker>
  private idempotencyManager: IdempotencyManager
  private logger: Logger
  private queueManager: QueueManager
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
    this.queueManager = config?.queueManager || new MemoryQueueManager()

    // Initialize circuit breakers for each provider
    this.providers.forEach((provider) => {
      this.circuitBreakers.set(provider.name, new CircuitBreaker(this.config.circuitBreaker, provider.name))
    })

    this.logger.info("Email service initialized with providers:", {
      providers: this.providers.map((p) => p.name),
    })
  }

  /**
   * Starts the queue processor loop. 
   * Note: In serverless environments, this should be called with caution 
   * or replaced with a cron job triggering processQueue().
   */
  public startQueueProcessor(): void {
    if (this.queueProcessor) return

    this.queueProcessor = setInterval(() => {
      this.processQueue()
    }, this.config.queueProcessingInterval)
    this.logger.info("Queue processor started")
  }

  async sendEmail(request: EmailRequest, idempotencyKey?: string): Promise<EmailResponse> {
    const requestId = idempotencyKey || this.generateRequestId(request)

    this.logger.info(`Attempting to send email`, { requestId, to: request.to })

    // Check idempotency
    const existingResponse = this.idempotencyManager.getResponse(requestId)
    if (existingResponse) {
      this.logger.info(`Returning cached response for idempotent request`, { requestId })
      return existingResponse
    }

    // Check rate limiting
    if (!this.rateLimiter.allowRequest()) {
      const error = "Rate limit exceeded"
      this.logger.warn(error, { requestId })
      const response: EmailResponse = {
        id: requestId,
        status: "failed",
        error,
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

      const response: EmailResponse = {
        id: requestId,
        status: "failed",
        error: errorMessage,
        attempts: this.config.retry.maxAttempts,
        timestamp: new Date(),
      }

      this.idempotencyManager.storeResponse(requestId, response)

      if (this.config.enableQueue) {
        await this.addToQueue(request, requestId)
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

  private async addToQueue(request: EmailRequest, requestId: string): Promise<void> {
    const queuedEmail: QueuedEmail = {
      id: requestId,
      request,
      attempts: 0,
      nextRetry: new Date(Date.now() + this.config.retry.baseDelay),
      createdAt: new Date(),
    }

    await this.queueManager.push(queuedEmail)
    this.logger.info(`Added email to queue`, { requestId })
  }

  private async processQueue(): Promise<void> {
    const emails = await this.queueManager.getAll()
    if (emails.length === 0) return

    const now = new Date()
    const readyEmails = emails.filter((email) => new Date(email.nextRetry) <= now)

    for (const queuedEmail of readyEmails) {
      try {
        await this.sendEmail(queuedEmail.request, queuedEmail.id)

        // Remove from queue on success
        await this.queueManager.remove(queuedEmail.id)
        this.logger.info(`Successfully processed queued email`, { requestId: queuedEmail.id })
      } catch (error) {
        queuedEmail.attempts++

        if (queuedEmail.attempts >= this.config.retry.maxAttempts) {
          // Remove from queue after max attempts
          await this.queueManager.remove(queuedEmail.id)
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
          await this.queueManager.update(queuedEmail)

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

  async getQueueStatus(): Promise<{ length: number; items: QueuedEmail[] }> {
    const emails = await this.queueManager.getAll()
    return {
      length: emails.length,
      items: emails,
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
}
