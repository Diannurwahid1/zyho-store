# Forensic Security Runbook

## Secret Rotation

Rotate these immediately in production:

1. `PAYLOAD_SECRET`
2. `PREVIEW_SECRET`
3. `CRON_SECRET`
4. `PAKASIR_API_KEY`
5. `GOOGLE_CLIENT_SECRET`

After rotation:

1. Redeploy all environments.
2. Force logout all active sessions if `PAYLOAD_SECRET` changed.
3. Re-test `/api/auth/google/start`, `/api/auth/google/callback`, `/api/pakasir`, `/api/stock/cron`, and preview flow.
4. Archive the old values in a secure incident record, not in repo or chat.

## Runtime Audit Targets

Inspect logs for these markers:

1. `[Audit] GraphQL access`
2. `[Audit] Sensitive auth REST access`
3. `[Audit] Google auth flow started`
4. `[Audit] Google auth callback completed`
5. `[Audit] Preview enabled`
6. `[Audit] Pakasir GET access`
7. `[Audit] Pakasir POST access`
8. `[Audit] Support upload created`
9. `[Audit] Support ticket created`
10. `[Audit] Support reply created`
11. `[Audit] Stock cron executed`

Inspect alerts for these markers:

1. `[Security] Invalid preview secret attempt`
2. `[Security] Invalid cron secret attempt`
3. `[Security] Unauthorized Pakasir GET blocked`
4. `[Security] Unauthorized Pakasir POST blocked`
5. `[Security] Google auth callback validation failed`
6. `[Security] Unauthorized support upload blocked`
7. `[Security] Unauthorized support ticket creation blocked`
8. `[Security] Unauthorized support reply blocked`
9. `[Security] Forbidden reports summary access`

## Controlled Attack Tests

Run these only in staging or a tightly controlled environment.

### 1. Upload XSS

1. Try uploading a fake PNG renamed from HTML.
2. Try uploading SVG with script payload.
3. Try uploading polyglot image payload.
4. Confirm server rejects or re-encodes to safe raster output.
5. Open resulting media URL and confirm it does not execute script.

### 2. IDOR Support Ticket

1. Log in as customer A and create ticket.
2. Log in as customer B and request `/api/support/tickets/{ticketAId}`.
3. Try posting reply with `attachmentIds` owned by another user.
4. Confirm both access paths return `403` or `400`.

### 3. Payment Abuse

1. Hit `/api/pakasir` without auth.
2. Send invalid `order_id`.
3. Spam repeated status checks and create calls until `429`.
4. In production-like env, verify `simulate` returns `403`.

### 4. Brute Force

1. Repeatedly hit `/api/users/login`.
2. Repeatedly hit `/api/users/forgot-password`.
3. Repeatedly hit `/api/auth/google/start`.
4. Confirm rate limit returns `429` and logs capture source IP.

## Incident Evidence Checklist

Collect and preserve:

1. Deployment timestamp and git SHA.
2. Reverse proxy logs with source IP and headers.
3. App logs containing the audit/security markers above.
4. Payment gateway logs from Pakasir.
5. OAuth provider logs from Google Cloud Console.
6. Database records for `users`, `support-tickets`, `support-messages`, `media`, `payment-transactions`, `orders`.
7. Exact sample payloads used in suspicious requests.

## Recommended Next Hardening

1. Move rate limit state to Redis or a shared store for multi-instance deployments.
2. Send audit logs to a centralized SIEM.
3. Add anomaly detection for repeated auth failures and repeated preview/cron secret failures.
4. Restrict admin and GraphQL endpoints by IP or VPN if operationally possible.
