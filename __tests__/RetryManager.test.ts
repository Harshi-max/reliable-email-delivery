import { RetryManager } from "../lib/email/utils/RetryManager"
import { jest } from "@jest/globals"

describe("RetryManager", () => {
  let retryManager: RetryManager

  beforeEach(() => {
    retryManager = new RetryManager({
      maxAttempts: 3,
      baseDelay: 100,
      maxDelay: 1000,
      backoffMultiplier: 2,
    })
  })

  it("should succeed on first attempt", async () => {
    const mockOperation = jest.fn().mockResolvedValue("success")

    const result = await retryManager.executeWithRetry(mockOperation)

    expect(result).toBe("success")
    expect(mockOperation).toHaveBeenCalledTimes(1)
    expect(mockOperation).toHaveBeenCalledWith(1)
  })

  it("should retry on failure and eventually succeed", async () => {
    const mockOperation = jest
      .fn()
      .mockRejectedValueOnce(new Error("First failure"))
      .mockRejectedValueOnce(new Error("Second failure"))
      .mockResolvedValue("success")

    const result = await retryManager.executeWithRetry(mockOperation)

    expect(result).toBe("success")
    expect(mockOperation).toHaveBeenCalledTimes(3)
  })

  it("should fail after max attempts", async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error("Always fails"))

    await expect(retryManager.executeWithRetry(mockOperation)).rejects.toThrow("Always fails")

    expect(mockOperation).toHaveBeenCalledTimes(3)
  })

  it("should apply exponential backoff", async () => {
    const mockOperation = jest.fn().mockRejectedValueOnce(new Error("First failure")).mockResolvedValue("success")

    const startTime = Date.now()
    await retryManager.executeWithRetry(mockOperation)
    const endTime = Date.now()

    // Should have waited at least the base delay
    expect(endTime - startTime).toBeGreaterThanOrEqual(100)
  })
})
