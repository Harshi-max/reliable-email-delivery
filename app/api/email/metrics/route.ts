import { NextResponse } from "next/server"
import { EmailService } from "@/lib/email/EmailService"
import { ResendProvider } from "@/lib/email/providers/ResendProvider"
import { MockEmailProviderA } from "@/lib/email/providers/MockEmailProviderA"

const createEmailService = () => {
  const providers = []
  providers.push(new ResendProvider(process.env.RESEND_API_KEY!))
  providers.push(new MockEmailProviderA())

  return new EmailService({
    providers,
    retry: {
      maxAttempts: 10,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    },
    rateLimit: {
      maxRequests: 10000,
      windowMs: 60000,
    },
    circuitBreaker: {
      failureThreshold: 10,
      recoveryTimeout: 30000,
      monitoringPeriod: 60000,
    },
    enableQueue: true,
    queueProcessingInterval: 5000,
  })
}

const emailService = createEmailService()

export async function GET() {
  try {
    const metrics = emailService.getServiceMetrics()
    const queueStatus = emailService.getQueueStatus()
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      metrics,
      queue: queueStatus,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}