import { type CircuitBreakerConfig, CircuitBreakerState } from "../types"

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED
  private failures = 0
  private lastFailureTime = 0
  private successCount = 0

  constructor(
    private config: CircuitBreakerConfig,
    private name: string,
  ) {}

  canExecute(): boolean {
    if (this.state === CircuitBreakerState.CLOSED) {
      return true
    }

    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.recoveryTimeout) {
        this.state = CircuitBreakerState.HALF_OPEN
        this.successCount = 0
        return true
      }
      return false
    }

    // HALF_OPEN state
    return true
  }

  recordSuccess(): void {
    this.failures = 0

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= 3) {
        // Require 3 successes to fully close
        this.state = CircuitBreakerState.CLOSED
      }
    }
  }

  recordFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.OPEN
    } else if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN
    }
  }

  getState(): string {
    return this.state
  }

  getStats(): {
    state: string
    failures: number
    lastFailureTime: number
    successCount: number
  } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      successCount: this.successCount,
    }
  }
}
