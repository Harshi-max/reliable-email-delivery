import type { EmailProvider, EmailRequest, EmailResponse } from "../types"

export class ResendProvider implements EmailProvider {
  name = "Resend"
  private apiKey: string
  private baseUrl = "https://api.resend.com/emails"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    const payload = {
      from: request.from,
      to: [request.to],
      subject: request.subject,
      text: request.body,
      html: request.html,
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.text()
        const errorCode = this.categorizeError(response.status)
        throw new Error(`${errorCode}: ${response.status} - ${errorData}`)
      }

      const result = await response.json()

      return {
        id: result.id || this.generateId(),
        status: "sent",
        attempts: 1,
        timestamp: new Date(),
      }
    } catch (error) {
      const enhancedError = this.enhanceError(error)
      throw enhancedError
    }
  }

  private categorizeError(status: number): string {
    if (status >= 400 && status < 500) return "CLIENT_ERROR"
    if (status >= 500) return "SERVER_ERROR"
    if (status === 429) return "RATE_LIMITED"
    return "UNKNOWN_ERROR"
  }

  private enhanceError(error: unknown): Error {
    const baseMessage = error instanceof Error ? error.message : "Unknown error"
    return new Error(`[${this.name}] ${baseMessage}`)
  }

  isHealthy(): boolean {
    return !!this.apiKey && this.apiKey.length > 10
  }

  private generateId(): string {
    return `resend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
