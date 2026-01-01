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
  queueManager?: QueueManager
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

export interface QueueManager {
  push(email: QueuedEmail): Promise<void>
  pop(): Promise<QueuedEmail | undefined>
  peek(): Promise<QueuedEmail | undefined>
  getAll(): Promise<QueuedEmail[]>
  remove(id: string): Promise<void>
  update(email: QueuedEmail): Promise<void>
  size(): Promise<number>
}
