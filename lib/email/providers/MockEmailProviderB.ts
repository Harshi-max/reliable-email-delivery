import type { EmailProvider, EmailRequest, EmailResponse } from "../types"

export class MockEmailProviderB implements EmailProvider {
  name = "MockProviderB (Simulation Only)"
  private failureRate = 0.15 // 15% failure rate for testing
  private healthy = true

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    // Simulate network delay
    await this.delay(150 + Math.random() * 300)

    // Log that this is a simulation
    console.log(`🔄 MOCK PROVIDER B: Simulating email send to ${request.to}`)
    console.log(`📧 Subject: ${request.subject}`)
    console.log(`📝 Body: ${request.body.substring(0, 100)}...`)

    // Simulate random failures
    if (Math.random() < this.failureRate) {
      console.log(`❌ MOCK PROVIDER B: Simulated failure for ${request.to}`)
      throw new Error(`MockProviderB: Simulated failure for ${request.to}`)
    }

    // Simulate occasional unhealthy state
    if (Math.random() < 0.03) {
      this.healthy = false
      setTimeout(() => {
        this.healthy = true
      }, 15000) // Recover after 15 seconds
    }

    console.log(`✅ MOCK PROVIDER B: Email "sent" successfully (simulation only)`)

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
    return `mock-b-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
