import type { EmailResponse } from "../types"

export class IdempotencyManager {
  private cache = new Map<string, EmailResponse>()
  private readonly TTL = 24 * 60 * 60 * 1000 // 24 hours

  storeResponse(key: string, response: EmailResponse): void {
    this.cache.set(key, response)

    // Clean up expired entries
    setTimeout(() => {
      this.cache.delete(key)
    }, this.TTL)
  }

  getResponse(key: string): EmailResponse | null {
    return this.cache.get(key) || null
  }

  hasResponse(key: string): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}
