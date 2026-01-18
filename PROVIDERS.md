# 🔌 Provider Strategy Guide

This document outlines how to extend the Resilient Email Service by adding new email providers (e.g., Mailgun, Postmark, AWS SES).

## 1. The Strategy Pattern
We use the **Strategy Pattern** to ensure the `EmailService` orchestrator remains decoupled from specific vendor SDKs. Every provider must implement the `IEmailProvider` interface.

---

## 2. Implementation Steps

### Step 1: Create the Provider Class
Create a new file in `src/providers/` (e.g., `MailgunProvider.ts`).

```typescript
import { IEmailProvider, EmailPayload, EmailResponse } from '../types';
import { BaseProvider } from './BaseProvider';

export class MailgunProvider extends BaseProvider implements IEmailProvider {
  readonly name = 'mailgun';

  async send(payload: EmailPayload): Promise<EmailResponse> {
    try {
      // 1. Call Vendor SDK
      // 2. Return Unified Response
      return { success: true, messageId: '...' };
    } catch (error) {
      // 3. Normalize Error (See ErrorNormalizer)
      throw this.normalizeError(error);
    }
  }
}
```

### Step 2: Error Normalization
All raw SDK errors must be mapped to our internal `SmartError` format in  `src/utils/ErrorNormalizer.ts`.

This normalization is critical so that the **Circuit Breaker** can decide whether to:
- **Trip** (server-side / provider failures – 5xx)
- **Just report** (client-side / auth / rate issues – 4xx)

#### Error Mapping Table

| Raw Error                | Smart Error Category | Action                         |
|--------------------------|----------------------|--------------------------------|
| 429 Too Many Requests    | RATE_LIMIT           | Increment Rate Limiter         |
| 500 Internal Error       | PROVIDER_DOWN        | Trip Circuit Breaker           |
| 401 Unauthorized         | AUTH_ERROR           | Log Alert / Manual Fix         |

#### Notes
- **5xx errors** indicate provider instability → trigger circuit breaker.
- **4xx errors** indicate client or auth issues → log and report only.
- All SDK errors must pass through `ErrorNormalizer` before propagation.

### Step 3: Registration

Register the new provider in `ProviderFactory.ts` **or** within the initialization logic of `EmailService.ts` so it becomes available for fallback chains.

#### Provider Registration Guidelines
- Add the provider implementation to the factory switch/map.
- Ensure the provider conforms to the common provider interface.
- Verify the provider is included in the fallback order for failover scenarios.

---

## 3. Best Practices
* **Timeouts:** Always wrap SDK calls in a `Promise.race` with a global timeout.
* **Logging:** Use the `Logger` utility to capture raw error strings before normalization for debugging.
