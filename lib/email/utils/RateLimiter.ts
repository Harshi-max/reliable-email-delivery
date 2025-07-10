import type { RateLimitConfig } from "../types"

interface TokenBucket {
  tokens: number
  lastRefill: number
}

export class RateLimiter {
  private bucket: TokenBucket

  constructor(private config: RateLimitConfig) {
    this.bucket = {
      tokens: config.maxRequests,
      lastRefill: Date.now(),
    }
  }

  allowRequest(): boolean {
    this.refillBucket()

    if (this.bucket.tokens > 0) {
      this.bucket.tokens--
      return true
    }

    return false
  }

  private refillBucket(): void {
    const now = Date.now()
    const timePassed = now - this.bucket.lastRefill

    if (timePassed >= this.config.windowMs) {
      this.bucket.tokens = this.config.maxRequests
      this.bucket.lastRefill = now
    }
  }

  getRemainingTokens(): number {
    this.refillBucket()
    return this.bucket.tokens
  }

  getTimeUntilRefill(): number {
    const timePassed = Date.now() - this.bucket.lastRefill
    return Math.max(0, this.config.windowMs - timePassed)
  }
}
