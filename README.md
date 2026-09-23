# Jonas website and private admin

Next.js 16, TypeScript, Supabase Postgres/Auth. The public website accepts project inquiries; the owner manages requests, customers, internal notes and follow-ups at `/admin`. Customer email is contact data only. The application sends no email; new inquiries can optionally post an alert to a Slack channel.

## Development

Use Node.js 24 or newer. Run `npm ci`, copy `.env.example` to `.env.local`, configure the dedicated Supabase project, then run `npm run dev`. The website runs at `http://localhost:3000`; `/new` permanently redirects to `/`.

The website and login render without Supabase configuration, but saving requests and signing in are unavailable until configured. There is no mock database or public admin bypass.

## Database and owner setup

Apply `supabase/migrations/202609110001_crm.sql` to the dedicated project's database. It creates customer/request/note/follow-up/activity tables, owner membership, database policies, durable intake rate limits and atomic submission/customer-conversion functions.

Disable public signup and anonymous accounts in Supabase. Set `OWNER_EMAIL` alongside the Supabase configuration, then run:

```sh
node --env-file=.env.local scripts/provision-owner.mjs
```

This explicitly confirms the owner account through the trusted admin API; it does not send email. The one-time recovery password is saved to `work/owner-recovery.json` with restricted permissions. Store it in your password manager, remove the file. The owner is the single row in `public.admin_users`; no environment variable is needed. The script never replaces an existing owner. It saves recovery credentials before remote account creation and can resume an interrupted setup.

Sign in with the owner password, then enroll passkeys in `/admin/security`. Supabase passkeys are experimental and require explicit provider configuration. Configure the stable production RP ID and allowed origin before enrolling production credentials. Keep a recovery password and a second passkey. There are no email password-reset flows.

## Environment

Required configuration is documented in `.env.example`:

- Public Supabase URL and publishable key.
- Server-only Supabase secret key.
- Exact `APP_URL` origin for request-origin checking.
- Random 32+ character `INTAKE_HASH_SECRET` for abuse-protection hashes.
- Optional external booking URL. Without it, visitors can still request a walkthrough through the inquiry form.
- Optional server-only `SLACK_WEBHOOK_URL` (a Slack Incoming Webhook). When set, each new inquiry posts the contact details, a short brief and a link to it in `/admin`. Retries of the same submission do not post again. When unset, no alert is sent.

Use independent preview/production databases and secrets. Never expose the Supabase secret key to browser code. No email provider is required.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

The GitHub verification workflow runs lint, types, database tests, build, and the production dependency audit on pull requests.

`npm test` executes validation and real Postgres SQL/RLS tests through PGlite. These tests cover anonymous/non-owner denial, retries, rate limits, status changes, notes, follow-ups and idempotent customer conversion.

`npm run test:e2e` runs the actual website → API → database → owner admin workflow. It requires a running configured app and `E2E_OWNER_EMAIL`, `E2E_OWNER_PASSWORD`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Optionally set `E2E_BASE_URL`. It creates and cleans up fictional records. Run only against an explicitly selected test environment.

The browser test fails when configuration is missing; it does not silently skip or mock successful storage/auth.

## Deployment

Deploy the Next.js app to Vercel, configure environment variables per environment, apply the database migration, provision the owner and verify `/api/health`. That endpoint checks basic configuration and owner membership; it is not a substitute for testing public intake and authenticated access.

Complete every gate in `docs/production-checklist.md` before production promotion, including domain, real auth, backup restore, noindex admin pages, mobile/keyboard checks and rollback. Do not infer deployment completion from a successful local build.

## Structure

- `app/_home/home.tsx` and related components: public homepage at `/` (`/new` redirects here).
- `components/inquiry-form.tsx`: accessible inquiry form and dialog.
- `app/api/requests`: bounded validation and rate-limited persistence.
- `app/admin`: private dashboard, inbox, customers, notes, follow-ups and login.
- `lib/crm`: authorization, queries, mutations and boundary validation.
- `lib/supabase`: server/browser session clients; privileged intake client stays server-only.
- `supabase/migrations`: reproducible schema and permissions.
- `tests`: database and browser verification.

## Design assets

The older custom sections are retained from the existing redesign. The component catalog's private registry uses an environment-variable reference, never an embedded token. No registry token is required to run the site. Concepts and illustrative data remain labeled; replace them with approved work when available.
