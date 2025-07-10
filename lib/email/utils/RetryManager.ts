import type { RetryConfig } from "../types"

export class RetryManager {
  constructor(private config: RetryConfig) {}

  async executeWithRetry<T>(operation: (attempt: number) => Promise<T>): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation(attempt)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")

        if (attempt === this.config.maxAttempts) {
          break
        }

        const delay = this.calculateDelay(attempt)
        await this.delay(delay)
      }
    }

    throw lastError || new Error("All retry attempts failed")
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1)

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * exponentialDelay

    return Math.min(exponentialDelay + jitter, this.config.maxDelay)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
