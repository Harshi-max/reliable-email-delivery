import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email/EmailService"
import { ResendProvider } from "@/lib/email/providers/ResendProvider"
import { MockEmailProviderA } from "@/lib/email/providers/MockEmailProviderA"
import type { EmailRequest } from "@/lib/email/types"

/**
 * Create email service with proper provider handling
 */
const createEmailService = () => {
  const providers = []

  if (process.env.RESEND_API_KEY) {
    providers.push(new ResendProvider(process.env.RESEND_API_KEY))
  } else {
    console.warn("⚠️ RESEND_API_KEY is not set. Falling back to mock provider.")
  }

  // Always keep mock provider as fallback
  providers.push(new MockEmailProviderA())

  return new EmailService({
    providers,
    retry: {
      maxAttempts: 5,
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
    // Ensure JSON request
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json" },
        { status: 415 }
      )
    }

    const body = await request.json()
    const { to, subject, body: emailBody, html } = body

    // Required field validation
    if (!to || !subject || (!emailBody && !html)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and body or html" },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof to !== "string" || !emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      )
    }

    const emailRequest: EmailRequest = {
      to,
      subject,
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      body: emailBody ?? "Email sent via Resilient Email Service",
      html:
        html ??
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>${subject}</h2>
          <p>${emailBody ? emailBody.replace(/\n/g, "<br/>") : ""}</p>
          <hr />
          <small>Sent via Resilient Email Service</small>
        </div>
      `,
    }

    console.log("📨 Sending email:", { to, subject })

    const result = await emailService.sendEmail(emailRequest)

    return NextResponse.json(
      {
        id: result.id,
        status: result.status,
        provider: result.provider,
        attempts: result.attempts,
        message: "Email sent successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Email sending error:", error)

    let statusCode = 500
    let message = "Internal server error"

    if (error instanceof Error) {
      message = error.message

      if (message.toLowerCase().includes("rate limit")) {
        statusCode = 429
      } else if (message.toLowerCase().includes("invalid")) {
        statusCode = 400
      }
    }

    return NextResponse.json(
      {
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }
}
