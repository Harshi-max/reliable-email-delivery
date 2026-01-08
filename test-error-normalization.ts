/**
 * Error Normalization Test Utility
 * 
 * Run this script to see how different errors are normalized.
 * Usage: node --loader ts-node/esm test-error-normalization.ts
 */

import { ErrorNormalizer } from './lib/email/utils/ErrorNormalizer'

console.log('🔍 Error Normalization Examples\n')
console.log('=' .repeat(80))

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
  }
]

testErrors.forEach(({ name, error, provider }) => {
  const normalized = ErrorNormalizer.normalize(error, provider)
  
  console.log(`\n📧 ${name}`)
  console.log('-'.repeat(80))
  console.log(`Provider: ${provider}`)
  console.log(`Raw Error: ${error}`)
  console.log()
  console.log(`✅ Normalized:`)
  console.log(`   Category: ${normalized.category}`)
  console.log(`   Severity: ${normalized.severity}`)
  console.log(`   Explanation: ${normalized.explanation}`)
  console.log(`   Suggested Action: ${normalized.suggestedAction}`)
  console.log(`   Should Retry: ${normalized.shouldRetry}`)
  console.log(`   Should Fallback: ${normalized.shouldFallback}`)
})

console.log('\n' + '='.repeat(80))
console.log('✨ All error patterns normalized successfully!')
console.log()
console.log('💡 Try these in the dashboard:')
console.log('   1. Invalid API key → Shows authentication error with fix suggestion')
console.log('   2. Invalid email → Shows recipient error with clear explanation')
console.log('   3. Many rapid sends → Shows rate limit with retry recommendation')
console.log()
