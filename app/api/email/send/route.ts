import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email/EmailService"
import { ResendProvider } from "@/lib/email/providers/ResendProvider"
import { MockEmailProviderA } from "@/lib/email/providers/MockEmailProviderA"
import type { EmailRequest } from "@/lib/email/types"

// Create email service with real Resend provider
const createEmailService = () => {
  const providers = []

  // Add Resend provider with your API key
  providers.push(new ResendProvider("re_idVyxM2g_5KwQmuZtBDtbLZttWDGpAisG"))

  // Add mock provider as fallback
  providers.push(new MockEmailProviderA())

  return new EmailService({
    providers,
    retry: {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    },
    rateLimit: {
      maxRequests: 100,
      windowMs: 60000,
    },
    circuitBreaker: {
      failureThreshold: 5,
      recoveryTimeout: 30000,
      monitoringPeriod: 60000,
    },
    enableQueue: true,
    queueProcessingInterval: 5000,
  })
}

const emailService = createEmailService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, body: emailBody } = body

    if (!to || !subject || !emailBody) {
      return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 })
    }

    const emailRequest: EmailRequest = {
      to,
      subject,
      body: emailBody,
      from: "onboarding@resend.dev", // Resend's verified sender for testing
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            ${subject}
          </h2>
          <div style="margin: 20px 0; line-height: 1.6;">
            ${emailBody.replace(/\n/g, "<br>")}
          </div>
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This email was sent via the Resilient Email Service demo using Resend.
            </p>
          </div>
        </div>
      `,
    }

    console.log(`🚀 Attempting to send real email to: ${to}`)
    console.log(`📧 Subject: ${subject}`)

    const result = await emailService.sendEmail(emailRequest)

    console.log(`✅ Email sent successfully:`, result)

    return NextResponse.json({
      id: result.id,
      status: result.status,
      provider: result.provider,
      attempts: result.attempts,
      message: "Email sent successfully via Resend!",
    })
  } catch (error) {
    console.error("❌ Email sending failed:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
        id: Date.now().toString(),
        attempts: 1,
      },
      { status: 500 },
    )
  }
}
