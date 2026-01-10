# 🎯 Quick Start Guide - Error Normalization

## See It In Action (3 Steps)

### Step 1: Start the App
```bash
npm run dev
```

### Step 2: Go to Dashboard
Navigate to: `http://localhost:3000/dashboard`

### Step 3: Trigger an Error

**Option A: Invalid API Key**
1. Edit `.env` → Set `RESEND_API_KEY=invalid_key_12345`
2. Send a test email
3. See normalized error:
   ```
   🛡️ AUTHENTICATION - PERMANENT
   API key is invalid or missing...
   💡 Verify your API key is correct in .env
   ```

**Option B: Invalid Email**
1. Enter email: `test@invalid.invalid`
2. Send email
3. See normalized error:
   ```
   ⚠️ RECIPIENT - PERMANENT
   The recipient email address is invalid...
   💡 Verify the email address is correct
   ```

**Option C: Rate Limit**
1. Send 5-10 emails very quickly
2. See normalized error:
   ```
   ⏱️ RATE_LIMITING - TEMPORARY
   You've exceeded the provider's rate limit...
   💡 Wait a few minutes or system will fallback
   ```

## Visual Guide

### Dashboard - Failed Email Card

```
┌─────────────────────────────────────────────────────┐
│ ❌ FAILED    Resend    3 attempts                   │
├─────────────────────────────────────────────────────┤
│ Test Email Subject                                   │
│ user@example.com                                     │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🛡️ PERMANENT  AUTHENTICATION                    │ │
│ │                                                   │ │
│ │ API key is invalid or missing. The email        │ │
│ │ provider rejected the authentication            │ │
│ │ credentials.                                     │ │
│ │                                                   │ │
│ │ ┌───────────────────────────────────────────┐   │ │
│ │ │ ✨ Next step: Verify your API key is     │   │ │
│ │ │ correct in the .env file and that it      │   │ │
│ │ │ hasn't expired.                           │   │ │
│ │ └───────────────────────────────────────────┘   │ │
│ │                                                   │ │
│ │ ▼ Technical details                              │ │
│ │   Error: 401 Unauthorized - Invalid API key      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ 2026-01-08 10:30:45                                  │
└─────────────────────────────────────────────────────┘
```

## Color Guide

### Severity Badges
- 🟡 **TEMPORARY** - Yellow - Retry might work
- 🔴 **PERMANENT** - Red - Fix required
- 🟣 **CRITICAL** - Purple - System issue

### Category Icons
- 🛡️ Authentication
- ⏱️ Rate Limiting
- 🌐 Network
- ⚠️ Validation/Recipient
- 📝 Content
- 📊 Quota
- ⚙️ Configuration

## What Changed

### Before This Feature
```json
{
  "status": "failed",
  "error": "ENOTFOUND smtp.resend.com"
}
```

### After This Feature
```json
{
  "status": "failed",
  "error": "ENOTFOUND smtp.resend.com",
  "normalizedError": {
    "explanation": "DNS lookup failed - unable to find the email provider's server",
    "category": "NETWORK",
    "severity": "TEMPORARY",
    "suggestedAction": "Check internet connection. If persistent, the provider may be experiencing an outage",
    "shouldRetry": true,
    "shouldFallback": true
  }
}
```

## Test All Error Types

### Visual Test Page (Recommended)
Visit: `http://localhost:3000/test-errors`

This shows all error patterns in a beautiful UI with:
- ✅ All 10 test cases
- 🎨 Color-coded severity badges
- 📊 Category icons and labels
- 💡 Suggested actions highlighted
- ✓/✗ Retry and fallback recommendations

### API Test Endpoint
```bash
curl http://localhost:3000/api/test-errors
```

Or visit in browser: `http://localhost:3000/api/test-errors`

## Real-World Examples

### ✅ Success Case
```
✓ SENT   Resend   1 attempt
Test Email
user@example.com
2026-01-08 10:30:45
```

### ❌ Authentication Error
```
✗ FAILED   Resend   1 attempt
🛡️ PERMANENT - AUTHENTICATION
API key is invalid...
💡 Check your .env file
```

### ⚠️ Network Error
```
✗ FAILED   SendGrid   3 attempts
🌐 TEMPORARY - NETWORK
Connection timeout...
💡 Retry automatically scheduled
```

### 🚫 Invalid Recipient
```
✗ FAILED   SMTP   1 attempt
⚠️ PERMANENT - RECIPIENT
Email address doesn't exist...
💡 Verify the recipient address
```

## Next Steps

1. ✅ Feature is fully integrated
2. ✅ No code changes needed
3. ✅ Works automatically for all errors
4. ✅ Extend by adding patterns to ErrorNormalizer.ts

## Documentation

- 📖 **Full Docs**: [ERROR_NORMALIZATION.md](ERROR_NORMALIZATION.md)
- 📊 **Implementation**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- 🏠 **Main README**: [README.md](README.md)

## Support

If you see an error that's not normalized well:
1. Open `lib/email/utils/ErrorNormalizer.ts`
2. Add a new pattern to `errorPatterns` array
3. Test with the test script
4. That's it! 🎉
