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
        throw new Error(`Resend API error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()

      return {
        id: result.id || this.generateId(),
        status: "sent",
        attempts: 1,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new Error(`Resend provider failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  isHealthy(): boolean {
    return !!this.apiKey
  }

  private generateId(): string {
    return `resend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
