import type { RetryConfig } from "../types"

export class RetryManager {
  constructor(private config: RetryConfig) {}

  async executeWithRetry<T>(operation: (attempt: number) => Promise<T>): Promise<T> {
    let lastError: Error | null = null
    const startTime = Date.now()

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        const result = await operation(attempt)
        if (attempt > 1) {
          console.log(`✅ Retry succeeded on attempt ${attempt} after ${Date.now() - startTime}ms`)
        }
        return result
      } catch (error) {
        lastError = this.enhanceError(error, attempt)

        if (attempt === this.config.maxAttempts) {
          console.error(`❌ All ${this.config.maxAttempts} retry attempts failed after ${Date.now() - startTime}ms`)
          break
        }

        const delay = this.calculateDelay(attempt)
        console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`)
        await this.delay(delay)
      }
    }

    throw lastError || new Error("All retry attempts failed")
  }

  private enhanceError(error: unknown, attempt: number): Error {
    const baseError = error instanceof Error ? error : new Error("Unknown error")
    const enhancedError = new Error(`[Attempt ${attempt}] ${baseError.message}`)
    enhancedError.stack = baseError.stack
    return enhancedError
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1)

    // Enhanced jitter: 10-30% randomization to prevent thundering herd
    const jitterRange = 0.1 + (Math.random() * 0.2) // 10-30%
    const jitter = exponentialDelay * jitterRange

    return Math.min(exponentialDelay + jitter, this.config.maxDelay)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
