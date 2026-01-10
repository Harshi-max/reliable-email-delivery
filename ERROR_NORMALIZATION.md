# Error Normalization Feature

## Overview

This feature transforms raw provider errors into clear, actionable explanations that help you quickly understand and resolve email delivery failures.

## What It Does

When an email fails to send, instead of just showing raw error messages like:
- `ENOTFOUND smtp.provider.com`
- `401 Unauthorized`
- `Rate limit exceeded`

You now get:
- **Plain-language explanation**: "DNS lookup failed - unable to find the email provider's server"
- **Error classification**: Temporary vs Permanent, Category (Network, Auth, etc.)
- **Suggested action**: "Check internet connection. If persistent, the provider may be experiencing an outage"
- **Smart recommendations**: Whether to retry or fallback to another provider

## Architecture

### 1. ErrorNormalizer (`lib/email/utils/ErrorNormalizer.ts`)
Core utility that maps error patterns to normalized information:

```typescript
const normalized = ErrorNormalizer.normalize(error, provider, code)
// Returns:
{
  explanation: "API key is invalid or missing...",
  category: "AUTHENTICATION",
  severity: "PERMANENT",
  suggestedAction: "Verify your API key is correct...",
  shouldRetry: false,
  shouldFallback: true
}
```

### 2. Enhanced ErrorHandler
`EmailServiceError` now includes normalized error data:

```typescript
class EmailServiceError {
  public readonly normalized: NormalizedError
  // ... automatically populated on creation
}
```

### 3. Updated EmailResponse Type
API responses now include `normalizedError`:

```typescript
interface EmailResponse {
  id: string
  status: "sent" | "failed" | "queued" | "retrying"
  error?: string  // Raw error message
  normalizedError?: {
    explanation: string
    category: string
    severity: string
    suggestedAction: string
    shouldRetry: boolean
    shouldFallback: boolean
  }
}
```

### 4. Enhanced Dashboard UI
Failed emails now show:
- Color-coded severity badges (Yellow=Temporary, Red=Permanent, Purple=Critical)
- Category icons and labels
- Clear explanation of what went wrong
- Suggested next steps with action icon
- Collapsible technical details

## Error Categories

1. **AUTHENTICATION** - API key/auth issues
2. **RATE_LIMITING** - Too many requests
3. **NETWORK** - Connection, DNS, timeout issues
4. **VALIDATION** - Invalid email format
5. **RECIPIENT** - Invalid/blocked recipient
6. **CONTENT** - HTML/size issues
7. **QUOTA** - Sending limits exceeded
8. **CONFIGURATION** - Domain verification, setup issues
9. **UNKNOWN** - Unrecognized errors

## Severity Levels

- **TEMPORARY** - Retry likely to succeed (network issues, rate limits)
- **PERMANENT** - Retry won't help (invalid email, auth failure)
- **CRITICAL** - System-level issue (circuit breaker open)

## Examples

### Authentication Error
```
Input: "401 Unauthorized - Invalid API key"

Normalized:
- Explanation: "API key is invalid or missing. The email provider rejected the authentication credentials."
- Category: AUTHENTICATION
- Severity: PERMANENT
- Action: "Verify your API key is correct in the .env file and that it hasn't expired."
- Should Retry: false
- Should Fallback: true
```

### Network Error
```
Input: "ENOTFOUND smtp.sendgrid.net"

Normalized:
- Explanation: "DNS lookup failed - unable to find the email provider's server."
- Category: NETWORK
- Severity: TEMPORARY
- Action: "Check internet connection. If persistent, the provider may be experiencing an outage."
- Should Retry: true
- Should Fallback: true
```

### Rate Limit
```
Input: "429 Too Many Requests"

Normalized:
- Explanation: "You've exceeded the provider's rate limit for sending emails."
- Category: RATE_LIMITING
- Severity: TEMPORARY
- Action: "Wait a few minutes before retrying, or the system will automatically fall back to another provider."
- Should Retry: true
- Should Fallback: true
```

## Benefits

1. **Faster Debugging** - Immediately understand what went wrong
2. **Better UX** - Users see helpful explanations, not technical jargon
3. **Smarter Retries** - System knows when retrying makes sense
4. **Easier Monitoring** - Categorize and track errors by type
5. **Actionable Guidance** - Know exactly what to fix

## How to Use

### In Code
```typescript
import { ErrorNormalizer } from '@/lib/email/utils/ErrorNormalizer'

try {
  await sendEmail(...)
} catch (error) {
  const normalized = ErrorNormalizer.normalize(error, 'Resend')
  console.log(normalized.explanation)
  console.log(normalized.suggestedAction)
  
  if (normalized.shouldFallback) {
    // Try another provider
  }
}
```

### In Dashboard
1. Send an email that will fail (e.g., invalid API key)
2. Go to Monitor tab
3. Click on failed email
4. See:
   - Severity badge (color-coded)
   - Category icon and label
   - Plain-language explanation
   - Suggested action with icon
   - Collapsible technical details

## Extending

To add new error patterns, edit `ErrorNormalizer.ts`:

```typescript
{
  pattern: /your-error-pattern/i,
  category: ErrorCategory.YOUR_CATEGORY,
  severity: ErrorSeverity.TEMPORARY,
  explanation: "What this error means",
  suggestedAction: "How to fix it",
  shouldRetry: true,
  shouldFallback: false
}
```

## Testing

Try these scenarios to see error normalization in action:

1. **Invalid API key** - Change RESEND_API_KEY to something invalid
2. **Invalid recipient** - Send to `invalid@example.invalid`
3. **Rate limiting** - Send many emails rapidly
4. **Network error** - Disconnect internet and try sending

Each will show different normalized error information!

## No Breaking Changes

- Existing code continues to work
- Raw error messages still available
- Normalized info is additive
- Backward compatible with all providers
