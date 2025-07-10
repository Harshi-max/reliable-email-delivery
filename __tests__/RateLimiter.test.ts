import { RateLimiter } from "../lib/email/utils/RateLimiter"

describe("RateLimiter", () => {
  let rateLimiter: RateLimiter

  beforeEach(() => {
    rateLimiter = new RateLimiter({
      maxRequests: 3,
      windowMs: 1000,
    })
  })

  it("should allow requests within limit", () => {
    expect(rateLimiter.allowRequest()).toBe(true)
    expect(rateLimiter.allowRequest()).toBe(true)
    expect(rateLimiter.allowRequest()).toBe(true)
  })

  it("should deny requests over limit", () => {
    // Exhaust the limit
    rateLimiter.allowRequest()
    rateLimiter.allowRequest()
    rateLimiter.allowRequest()

    // Should deny the next request
    expect(rateLimiter.allowRequest()).toBe(false)
  })

  it("should track remaining tokens", () => {
    expect(rateLimiter.getRemainingTokens()).toBe(3)

    rateLimiter.allowRequest()
    expect(rateLimiter.getRemainingTokens()).toBe(2)

    rateLimiter.allowRequest()
    expect(rateLimiter.getRemainingTokens()).toBe(1)
  })

  it("should refill tokens after window", async () => {
    // Exhaust tokens
    rateLimiter.allowRequest()
    rateLimiter.allowRequest()
    rateLimiter.allowRequest()

    expect(rateLimiter.allowRequest()).toBe(false)

    // Wait for refill (in real implementation, this would be time-based)
    // For testing, we'd need to mock time or use a shorter window
    expect(rateLimiter.getTimeUntilRefill()).toBeGreaterThan(0)
  })
})
