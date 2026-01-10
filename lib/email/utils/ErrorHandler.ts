import { ErrorNormalizer, NormalizedError } from './ErrorNormalizer'

export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  PROVIDER_ERROR = "PROVIDER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CIRCUIT_BREAKER_ERROR = "CIRCUIT_BREAKER_ERROR",
  QUEUE_ERROR = "QUEUE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export class EmailServiceError extends Error {
  public readonly type: ErrorType
  public readonly code: string
  public readonly retryable: boolean
  public readonly provider?: string
  public readonly timestamp: Date
  public readonly normalized: NormalizedError

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    options: {
      code?: string
      retryable?: boolean
      provider?: string
      cause?: Error
    } = {}
  ) {
    super(message)
    this.name = "EmailServiceError"
    this.type = type
    this.code = options.code || type
    this.retryable = options.retryable ?? this.isRetryableByType(type)
    this.provider = options.provider
    this.timestamp = new Date()

    // Generate normalized error explanation
    this.normalized = ErrorNormalizer.normalize(message, options.provider, options.code)
    
    // Update retryable based on normalized error (more accurate)
    if (!options.retryable && this.normalized.shouldRetry !== undefined) {
      this.retryable = this.normalized.shouldRetry
    }

    if (options.cause) {
      this.stack = options.cause.stack
    }
  }

  private isRetryableByType(type: ErrorType): boolean {
    const retryableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.PROVIDER_ERROR
    ]
    return retryableTypes.includes(type)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      retryable: this.retryable,
      provider: this.provider,
      timestamp: this.timestamp,
      normalized: {
        explanation: this.normalized.explanation,
        category: this.normalized.category,
        severity: this.normalized.severity,
        suggestedAction: this.normalized.suggestedAction,
        shouldRetry: this.normalized.shouldRetry,
        shouldFallback: this.normalized.shouldFallback,
      }
    }
  }
}

export class ErrorHandler {
  static categorizeError(error: unknown, provider?: string): EmailServiceError {
    if (error instanceof EmailServiceError) {
      return error
    }

    const message = error instanceof Error ? error.message : "Unknown error"
    
    // Rate limiting
    if (message.includes("rate limit") || message.includes("429")) {
      return new EmailServiceError(message, ErrorType.RATE_LIMIT_ERROR, { provider })
    }

    // Network errors
    if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED") || message.includes("timeout")) {
      return new EmailServiceError(message, ErrorType.NETWORK_ERROR, { provider })
    }

    // Provider-specific errors
    if (message.includes("CLIENT_ERROR") || message.includes("SERVER_ERROR")) {
      return new EmailServiceError(message, ErrorType.PROVIDER_ERROR, { provider })
    }

    // Circuit breaker
    if (message.includes("circuit breaker") || message.includes("Circuit breaker")) {
      return new EmailServiceError(message, ErrorType.CIRCUIT_BREAKER_ERROR, { provider, retryable: false })
    }

    return new EmailServiceError(message, ErrorType.UNKNOWN_ERROR, { 
      provider,
      cause: error instanceof Error ? error : undefined 
    })
  }

  static shouldRetry(error: EmailServiceError, attempt: number, maxAttempts: number): boolean {
    if (attempt >= maxAttempts) return false
    if (!error.retryable) return false
    
    // Don't retry validation errors
    if (error.type === ErrorType.VALIDATION_ERROR) return false
    
    return true
  }
}