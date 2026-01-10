import { NextResponse } from 'next/server'
import { ErrorNormalizer } from '@/lib/email/utils/ErrorNormalizer'

export async function GET() {
  const testErrors = [
    {
      name: 'Authentication Error',
      error: 'Error: 401 Unauthorized - Invalid API key',
      provider: 'Resend'
    },
    {
      name: 'Rate Limit',
      error: 'Error: 429 Too Many Requests - Rate limit exceeded',
      provider: 'SendGrid'
    },
    {
      name: 'Network - DNS Failure',
      error: 'Error: ENOTFOUND smtp.sendgrid.net',
      provider: 'SendGrid'
    },
    {
      name: 'Network - Timeout',
      error: 'Error: Request timeout after 30000ms',
      provider: 'Resend'
    },
    {
      name: 'Invalid Recipient',
      error: 'Error: 550 5.1.1 Recipient address rejected: User unknown',
      provider: 'SMTP'
    },
    {
      name: 'Circuit Breaker',
      error: 'Error: Circuit breaker is open for provider SendGrid',
      provider: 'SendGrid'
    },
    {
      name: 'Domain Not Verified',
      error: 'Error: Domain example.com is not verified',
      provider: 'Resend'
    },
    {
      name: 'Quota Exceeded',
      error: 'Error: Monthly sending quota exceeded',
      provider: 'Resend'
    },
    {
      name: 'Connection Refused',
      error: 'Error: ECONNREFUSED Connection refused',
      provider: 'SMTP'
    },
    {
      name: 'Message Too Large',
      error: 'Error: 552 Message size exceeds maximum allowed',
      provider: 'SendGrid'
    }
  ]

  const results = testErrors.map(({ name, error, provider }) => {
    const normalized = ErrorNormalizer.normalize(error, provider)
    
    return {
      testCase: name,
      provider,
      rawError: error,
      normalized: {
        category: normalized.category,
        severity: normalized.severity,
        explanation: normalized.explanation,
        suggestedAction: normalized.suggestedAction,
        shouldRetry: normalized.shouldRetry,
        shouldFallback: normalized.shouldFallback
      }
    }
  })

  return NextResponse.json({
    title: '🔍 Error Normalization Test Results',
    totalTests: results.length,
    timestamp: new Date().toISOString(),
    results
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
