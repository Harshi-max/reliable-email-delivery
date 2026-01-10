/**
 * Error Normalizer
 * 
 * Transforms raw provider errors into clear, actionable explanations.
 * Maps common error codes and messages to:
 * - Plain-language explanations
 * - Error categorization (temporary vs permanent)
 * - Suggested next steps
 */

export enum ErrorSeverity {
  TEMPORARY = "TEMPORARY",  // Retry likely to succeed
  PERMANENT = "PERMANENT",  // Retry won't help
  CRITICAL = "CRITICAL"     // System-level issue
}

export enum ErrorCategory {
  AUTHENTICATION = "AUTHENTICATION",
  RATE_LIMITING = "RATE_LIMITING",
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  RECIPIENT = "RECIPIENT",
  CONTENT = "CONTENT",
  QUOTA = "QUOTA",
  CONFIGURATION = "CONFIGURATION",
  UNKNOWN = "UNKNOWN"
}

export interface NormalizedError {
  // Human-readable explanation
  explanation: string
  
  // Technical details
  originalMessage: string
  originalCode?: string
  
  // Classification
  severity: ErrorSeverity
  category: ErrorCategory
  
  // Actionable guidance
  suggestedAction: string
  shouldRetry: boolean
  shouldFallback: boolean
  
  // Context
  provider?: string
  timestamp: Date
}

interface ErrorPattern {
  pattern: RegExp | string
  category: ErrorCategory
  severity: ErrorSeverity
  explanation: string
  suggestedAction: string
  shouldRetry: boolean
  shouldFallback: boolean
}

export class ErrorNormalizer {
  private static errorPatterns: ErrorPattern[] = [
    // Authentication Errors
    {
      pattern: /invalid.*api.*key|unauthorized|401|authentication.*failed/i,
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.PERMANENT,
      explanation: "API key is invalid or missing. The email provider rejected the authentication credentials.",
      suggestedAction: "Verify your API key is correct in the .env file and that it hasn't expired.",
      shouldRetry: false,
      shouldFallback: true
    },
    {
      pattern: /forbidden|403|access.*denied/i,
      category: ErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.PERMANENT,
      explanation: "Your account doesn't have permission to perform this action.",
      suggestedAction: "Check your account permissions and plan limits with the email provider.",
      shouldRetry: false,
      shouldFallback: true
    },

    // Rate Limiting
    {
      pattern: /rate.*limit|429|too.*many.*requests/i,
      category: ErrorCategory.RATE_LIMITING,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "You've exceeded the provider's rate limit for sending emails.",
      suggestedAction: "Wait a few minutes before retrying, or the system will automatically fall back to another provider.",
      shouldRetry: true,
      shouldFallback: true
    },
    {
      pattern: /throttl/i,
      category: ErrorCategory.RATE_LIMITING,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Request was throttled by the provider to prevent overload.",
      suggestedAction: "Retry automatically scheduled. Consider spreading requests over time.",
      shouldRetry: true,
      shouldFallback: false
    },

    // Network Errors
    {
      pattern: /ENOTFOUND|DNS.*fail|could.*not.*resolve/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "DNS lookup failed - unable to find the email provider's server.",
      suggestedAction: "Check internet connection. If persistent, the provider may be experiencing an outage.",
      shouldRetry: true,
      shouldFallback: true
    },
    {
      pattern: /ECONNREFUSED|connection.*refused/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Connection to email provider was refused. The server may be down or blocking requests.",
      suggestedAction: "Automatic retry will be attempted. If this persists, contact the provider.",
      shouldRetry: true,
      shouldFallback: true
    },
    {
      pattern: /timeout|ETIMEDOUT/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Request timed out while waiting for provider response.",
      suggestedAction: "Network may be slow. Retry will be attempted automatically.",
      shouldRetry: true,
      shouldFallback: true
    },
    {
      pattern: /network.*error|socket.*hang.*up|ECONNRESET/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Network connection was interrupted while communicating with the provider.",
      suggestedAction: "This is usually temporary. Retry will be attempted.",
      shouldRetry: true,
      shouldFallback: false
    },

    // Validation Errors
    {
      pattern: /invalid.*email|invalid.*recipient|550|recipient.*rejected/i,
      category: ErrorCategory.RECIPIENT,
      severity: ErrorSeverity.PERMANENT,
      explanation: "The recipient email address is invalid or doesn't exist.",
      suggestedAction: "Verify the email address is correct. This email cannot be delivered.",
      shouldRetry: false,
      shouldFallback: false
    },
    {
      pattern: /blocked.*recipient|blacklist|spam/i,
      category: ErrorCategory.RECIPIENT,
      severity: ErrorSeverity.PERMANENT,
      explanation: "Recipient has blocked emails from this sender or marked them as spam.",
      suggestedAction: "Remove this recipient from your mailing list. They've indicated they don't want emails.",
      shouldRetry: false,
      shouldFallback: false
    },
    {
      pattern: /mailbox.*full|552|quota.*exceeded.*recipient/i,
      category: ErrorCategory.RECIPIENT,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Recipient's mailbox is full and cannot accept new messages.",
      suggestedAction: "Retry later when the recipient may have cleared their inbox.",
      shouldRetry: true,
      shouldFallback: false
    },

    // Content Issues
    {
      pattern: /invalid.*subject|subject.*required/i,
      category: ErrorCategory.CONTENT,
      severity: ErrorSeverity.PERMANENT,
      explanation: "Email subject is missing or invalid.",
      suggestedAction: "Add a valid subject line to the email.",
      shouldRetry: false,
      shouldFallback: false
    },
    {
      pattern: /invalid.*html|malformed.*content/i,
      category: ErrorCategory.CONTENT,
      severity: ErrorSeverity.PERMANENT,
      explanation: "Email content contains malformed HTML or invalid formatting.",
      suggestedAction: "Review and fix the email HTML structure.",
      shouldRetry: false,
      shouldFallback: false
    },
    {
      pattern: /message.*too.*large|552.*message.*size/i,
      category: ErrorCategory.CONTENT,
      severity: ErrorSeverity.PERMANENT,
      explanation: "Email exceeds the maximum size limit allowed by the provider.",
      suggestedAction: "Reduce email size by compressing images or removing large attachments.",
      shouldRetry: false,
      shouldFallback: true
    },

    // Quota Issues
    {
      pattern: /quota.*exceeded|monthly.*limit|daily.*limit/i,
      category: ErrorCategory.QUOTA,
      severity: ErrorSeverity.PERMANENT,
      explanation: "You've reached your sending quota limit for this provider.",
      suggestedAction: "Wait until quota resets or upgrade your plan. Fallback provider will be used.",
      shouldRetry: false,
      shouldFallback: true
    },

    // Configuration Issues
    {
      pattern: /domain.*not.*verified|sender.*not.*verified/i,
      category: ErrorCategory.CONFIGURATION,
      severity: ErrorSeverity.PERMANENT,
      explanation: "The sender domain or email address hasn't been verified with the provider.",
      suggestedAction: "Verify your domain/email in the provider's dashboard before sending.",
      shouldRetry: false,
      shouldFallback: true
    },
    {
      pattern: /invalid.*from.*address|from.*required/i,
      category: ErrorCategory.CONFIGURATION,
      severity: ErrorSeverity.PERMANENT,
      explanation: "The 'from' email address is missing or invalid.",
      suggestedAction: "Set a valid 'from' address in your email configuration.",
      shouldRetry: false,
      shouldFallback: false
    },

    // Circuit Breaker
    {
      pattern: /circuit.*breaker.*open/i,
      category: ErrorCategory.CONFIGURATION,
      severity: ErrorSeverity.CRITICAL,
      explanation: "This provider has been temporarily disabled due to repeated failures.",
      suggestedAction: "The system is using fallback providers. The circuit will reset automatically in 30 seconds.",
      shouldRetry: false,
      shouldFallback: true
    },

    // Server Errors
    {
      pattern: /500|internal.*server.*error|server.*error/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "The email provider is experiencing server issues.",
      suggestedAction: "This is a provider-side problem. Automatic retry will be attempted.",
      shouldRetry: true,
      shouldFallback: true
    },
    {
      pattern: /503|service.*unavailable|temporarily.*unavailable/i,
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.TEMPORARY,
      explanation: "Email service is temporarily unavailable or under maintenance.",
      suggestedAction: "Wait and retry, or fallback to alternate provider.",
      shouldRetry: true,
      shouldFallback: true
    },
  ]

  /**
   * Normalize an error into a structured, human-readable format
   */
  static normalize(
    error: Error | string,
    provider?: string,
    code?: string
  ): NormalizedError {
    const message = typeof error === 'string' ? error : error.message
    const originalCode = code || this.extractErrorCode(message)

    // Find matching pattern
    const match = this.errorPatterns.find(pattern => {
      if (typeof pattern.pattern === 'string') {
        return message.toLowerCase().includes(pattern.pattern.toLowerCase())
      }
      return pattern.pattern.test(message)
    })

    if (match) {
      return {
        explanation: match.explanation,
        originalMessage: message,
        originalCode,
        severity: match.severity,
        category: match.category,
        suggestedAction: match.suggestedAction,
        shouldRetry: match.shouldRetry,
        shouldFallback: match.shouldFallback,
        provider,
        timestamp: new Date()
      }
    }

    // Default unknown error
    return {
      explanation: "An unexpected error occurred while sending the email.",
      originalMessage: message,
      originalCode,
      severity: ErrorSeverity.TEMPORARY,
      category: ErrorCategory.UNKNOWN,
      suggestedAction: "The system will attempt to retry. If this persists, contact support with the error details.",
      shouldRetry: true,
      shouldFallback: true,
      provider,
      timestamp: new Date()
    }
  }

  /**
   * Extract error code from message (e.g., "401", "550")
   */
  private static extractErrorCode(message: string): string | undefined {
    // Look for HTTP status codes
    const httpMatch = message.match(/\b(4\d{2}|5\d{2})\b/)
    if (httpMatch) return httpMatch[1]

    // Look for SMTP codes
    const smtpMatch = message.match(/\b([45]\d{2})\b/)
    if (smtpMatch) return smtpMatch[1]

    return undefined
  }

  /**
   * Get a short, one-line summary of the error
   */
  static getSummary(normalizedError: NormalizedError): string {
    const categoryLabels: Record<ErrorCategory, string> = {
      [ErrorCategory.AUTHENTICATION]: "Authentication failed",
      [ErrorCategory.RATE_LIMITING]: "Rate limit exceeded",
      [ErrorCategory.NETWORK]: "Network issue",
      [ErrorCategory.VALIDATION]: "Validation error",
      [ErrorCategory.RECIPIENT]: "Recipient issue",
      [ErrorCategory.CONTENT]: "Content issue",
      [ErrorCategory.QUOTA]: "Quota exceeded",
      [ErrorCategory.CONFIGURATION]: "Configuration issue",
      [ErrorCategory.UNKNOWN]: "Unknown error"
    }

    return categoryLabels[normalizedError.category]
  }

  /**
   * Determine if error is user-fixable
   */
  static isUserFixable(normalizedError: NormalizedError): boolean {
    const fixableCategories = [
      ErrorCategory.VALIDATION,
      ErrorCategory.CONTENT,
      ErrorCategory.CONFIGURATION
    ]
    return fixableCategories.includes(normalizedError.category)
  }

  /**
   * Get severity badge color for UI
   */
  static getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.TEMPORARY:
        return "yellow"
      case ErrorSeverity.PERMANENT:
        return "red"
      case ErrorSeverity.CRITICAL:
        return "purple"
      default:
        return "gray"
    }
  }
}
