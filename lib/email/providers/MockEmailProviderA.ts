import type { EmailProvider, EmailRequest, EmailResponse } from "../types"

export class MockEmailProviderA implements EmailProvider {
  name = "MockProviderA (Simulation Only)"
  private failureRate = 0.2 // 20% failure rate for testing
  private healthy = true

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    // Simulate network delay
    await this.delay(100 + Math.random() * 200)

    // Log that this is a simulation
    console.log(`🔄 MOCK PROVIDER A: Simulating email send to ${request.to}`)
    console.log(`📧 Subject: ${request.subject}`)
    console.log(`📝 Body: ${request.body.substring(0, 100)}...`)

    // Simulate random failures
    if (Math.random() < this.failureRate) {
      console.log(`❌ MOCK PROVIDER A: Simulated failure for ${request.to}`)
      throw new Error(`MockProviderA: Simulated failure for ${request.to}`)
    }

    // Simulate occasional unhealthy state
    if (Math.random() < 0.05) {
      this.healthy = false
      setTimeout(() => {
        this.healthy = true
      }, 10000) // Recover after 10 seconds
    }

    console.log(`✅ MOCK PROVIDER A: Email "sent" successfully (simulation only)`)

    return {
      id: this.generateId(),
      status: "sent",
      attempts: 1,
      timestamp: new Date(),
    }
  }

  isHealthy(): boolean {
    return this.healthy
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private generateId(): string {
    return `mock-a-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
