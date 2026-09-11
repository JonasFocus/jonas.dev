# Production acceptance

## Scope

One owner; requests, customers, notes, follow-up dates. Collect customer email as contact data. No outgoing emails, email alerts, email login links, notification outbox, or Resend.

## Required setup

- Dedicated Supabase project, not a table in another product's production database.
- Apply supabase/migrations/202609110001_crm.sql and verify RLS/grants.
- Disable public signup and anonymous auth. No invitation or confirmation emails. Provision a confirmed owner with scripts/provision-owner.mjs and a server-only key. Recovery password is generated to a mode-0600 ignored local file; move it into a password manager.
- Set the exact owner UUID in ADMIN_USER_ID and public.admin_users. Both server and database enforce the owner.
- Set all required .env.example values independently in development/preview/production. Use a random 32-byte intake hashing secret. APP_URL must exactly match the browser origin.
- Passkey support in Supabase is currently experimental; pinned SDK plus owner password recovery avoids lockout. Configure the RP domain and allowed HTTPS origins, then enroll two owner passkeys from /admin/security. Localhost credentials are separate from production credentials. Do not change production RP ID after enrollment.
- Verify the intended domain is owned/connected before promotion. Root canonical metadata currently uses https://jonasinfocus.com.
- Booking URL is optional: request intake works without it. If configured, validate the external calendar and selected-study attribution.
- Select a backup policy in the provider and restore a backup to an isolated environment before launch. Keep customer data out of preview fixtures and logs.
- Configure external uptime checks for /api/health and review hosting errors. No email delivery is required by the application.

## Verification gates

Run npm test, npm run lint, npm run typecheck, npm run build, npm audit --omit=dev.
The database suite executes actual SQL in PGlite, including roles/RLS, atomic intake, duplicate replay, rate limiting, notes/followup activity, and idempotent customer conversion. It does not prove the hosted Supabase Auth or PostgREST configuration.

Before production completion, verify in the deployed browser:
1. Submit valid inquiry, observe saved confirmation, find matching request in owner inbox.
2. Retry the same submission ID: exactly one request/activity; different payload with reused ID rejected.
3. Invalid/oversized/cross-origin/spam/rate-limited submissions cannot create records.
4. Signed-out and signed-in non-owner accounts cannot read, modify, or export any customer data, including direct Data API calls.
5. Owner can review, mark read, change status, add note, schedule/complete follow-up, convert once and edit customer.
6. Passkey enrollment/sign-in, recovery password, sign-out, expired sessions work on production domain.
7. Keyboard, mobile, error and empty states verified; no horizontal overflow; dialogs trap/restore focus.
8. /new redirects to /; sitemap/robots/canonical/privacy are correct; admin responses private and noindex.
9. Database outage does not show false success; restore connectivity and retry safely.
10. Production deployment and domain serve the verified version. Rollback and backup restore procedures exercised.

## Initial operating limits

Request/customer/follow-up lists paginate in batches of 50. Open and completed follow-ups are filtered in the database before pagination. No email sync, attachments, billing or customer portal.

## Current evidence

Local database and validation tests: implemented. Hosted provider setup and full deployed browser gates remain pending until explicitly verified. Never treat a successful frontend build as proof of configured storage/auth.

## Verified deployment, September 11

- Dedicated Supabase project: `twqsdcxeojfzmmzgacri` in the selected Sentra organization. Quoted project creation cost: $0/month.
- Both checked-in migrations applied. Live table access and non-owner denial verified; public signup and anonymous auth disabled.
- Owner account provisioned for jonas@jonasinfocus.com without email. Account-change email notifications are disabled.
- Nine local database/validation tests passed, including hosted-default function-grant regression.
- Complete browser workflow passed locally against hosted Supabase and on `https://jonas-dev-cloverings1s-projects.vercel.app`.
- Passkey registration and sign-in verified with a temporary browser authenticator locally; test credential removed. Relying-party configuration now targets jonasinfocus.com and www.jonasinfocus.com. Owner must enroll their own credential after the domain is linked.
- Verified deployment: `dpl_3CcToKGeZVLk3VAj8W58omeBVhsN`. Health check returns 200. Synthetic verification requests/customers were deleted.
- Custom domain linking is explicitly handled by Jonas. The current Vercel origin is allowed alongside APP_URL for testing before that link.
- Supabase backup service reports enabled; there is no completed backup yet on this newly created project. Restore verification and ongoing uptime monitoring remain open release gates.
- Advisor note: customer conversion intentionally uses an owner-checked SECURITY DEFINER transaction. Leaked-password screening requires a paid plan; no plan upgrade was made. The recovery password is generated with 256 bits of randomness.
