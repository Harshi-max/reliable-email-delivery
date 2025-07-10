import type { EmailProvider, EmailRequest, EmailResponse } from "../types"

export class SendGridProvider implements EmailProvider {
  name = "SendGrid"
  private apiKey: string
  private baseUrl = "https://api.sendgrid.com/v3/mail/send"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    const payload = {
      personalizations: [
        {
          to: [{ email: request.to }],
          subject: request.subject,
        },
      ],
      from: { email: request.from },
      content: [
        {
          type: "text/plain",
          value: request.body,
        },
      ],
    }

    if (request.html) {
      payload.content.push({
        type: "text/html",
        value: request.html,
      })
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
        throw new Error(`SendGrid API error: ${response.status} - ${errorData}`)
      }

      return {
        id: this.generateId(),
        status: "sent",
        attempts: 1,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new Error(`SendGrid provider failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  isHealthy(): boolean {
    return !!this.apiKey
  }

  private generateId(): string {
    return `sendgrid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
