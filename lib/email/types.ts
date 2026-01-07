export interface EmailRequest {
  to: string
  from: string
  subject: string
  body: string
  html?: string
}

export interface EmailResponse {
  id: string
  status: "sent" | "failed" | "queued" | "retrying"
  provider?: string
  attempts: number
  error?: string
  timestamp: Date
}

export interface EmailProvider {
  name: string
  sendEmail(request: EmailRequest): Promise<EmailResponse>
  isHealthy(): boolean
}

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface CircuitBreakerConfig {
  failureThreshold: number
  recoveryTimeout: number
  monitoringPeriod: number
}

export interface EmailServiceConfig {
  retry: RetryConfig
  rateLimit: RateLimitConfig
  circuitBreaker: CircuitBreakerConfig
  enableQueue: boolean
  queueProcessingInterval: number
}

export enum CircuitBreakerState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface QueuedEmail {
  id: string
  request: EmailRequest
  attempts: number
  nextRetry: Date
  createdAt: Date
}

export interface ServiceMetrics {
  totalRequests: number
  successCount: number
  errorCount: number
  successRate: number
  providerFailures: Record<string, number>
  queueLength: number
  uptime: number
}

export interface EmailAnalytics {
  id: string
  timestamp: Date
  status: "delivered" | "bounced" | "opened" | "clicked" | "failed"
  provider: string
  recipient: string
  subject: string
  deliveryTime?: number
  openTime?: Date
  clickTime?: Date
  bounceReason?: string
  userAgent?: string
  ipAddress?: string
}

export interface AnalyticsMetrics {
  deliveryRate: number
  openRate: number
  clickRate: number
  bounceRate: number
  totalEmails: number
  timeRange: string
}

export interface AnalyticsFilter {
  dateFrom?: Date
  dateTo?: Date
  provider?: string
  status?: string
  recipient?: string
}
