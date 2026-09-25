# jonasinfocus.com

This repo holds the jonasinfocus.com marketing site and a private CRM at `/admin`. Visitors send project inquiries through a form on the homepage. One owner reviews them in the CRM.

Stack: Next.js 16 (App Router), TypeScript, Supabase (Postgres and Auth), Tailwind v4, Vercel.

## Quick start

You need Node 24.

```sh
npm ci
cp .env.example .env.local   # then fill in the values listed under Environment
npm run dev                  # serves http://localhost:3000
```

The homepage renders without Supabase. The inquiry form and the admin need it.

### Database and owner

1. Create a dedicated Supabase project. Turn off public signup and anonymous sign-ins.
2. Apply every file in `supabase/migrations/` in filename order.
3. Set `OWNER_EMAIL` in `.env.local`, then run the provisioning script:

   ```sh
   node --env-file=.env.local scripts/provision-owner.mjs
   ```

   The script creates a confirmed user without sending email and inserts the only row in `admin_users`. It writes a generated recovery password to `work/owner-recovery.json` with mode 0600. Git ignores that folder. Copy the password to a password manager and delete the file. You can rerun the script safely. It never replaces an existing owner.

4. Sign in at `/admin/login` with the password, then add passkeys at `/admin/security`. Keep the recovery password and a second passkey, because there is no email reset flow.

## Environment

| Variable                                                | Scope  | Required   | Purpose                                                                                         |
| ------------------------------------------------------- | ------ | ---------- | ----------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                              | public | yes        | Supabase project URL. The CSP `connect-src` also allows it.                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`                  | public | yes        | Admin sign-in sessions and the public homepage settings read.                                   |
| `SUPABASE_SECRET_KEY`                                   | server | yes        | Saving inquiries, `/api/health`, and owner provisioning.                                        |
| `APP_URL`                                               | server | yes        | Exact origin with no trailing slash. The API accepts requests only from it. Slack links use it. |
| `INTAKE_HASH_SECRET`                                    | server | yes        | At least 32 random characters. The API uses it to hash IPs and emails for rate limiting.        |
| `SLACK_WEBHOOK_URL`                                     | server | no         | Posts each new inquiry to Slack. Leave it empty to send no alerts.                              |
| `DEPLOYMENT_ORIGIN`                                     | server | no         | One more accepted origin, such as a Vercel URL before the custom domain is linked.              |
| `OWNER_EMAIL`                                           | script | setup only | Only `scripts/provision-owner.mjs` reads it.                                                    |
| `E2E_OWNER_EMAIL`, `E2E_OWNER_PASSWORD`, `E2E_BASE_URL` | test   | e2e only   | Only Playwright reads them. The base URL defaults to `http://localhost:3000`.                   |

On Vercel, the API also accepts the origins in `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL`, and reads the client IP from `x-vercel-forwarded-for`. Outside Vercel, every request counts against the same rate limit.

Give each environment its own database and secrets. Never add the `NEXT_PUBLIC_` prefix to a server secret.

## Commands

| Command             | What it does                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`       | Starts the dev server.                                                                    |
| `npm run lint`      | Runs oxlint with type-aware rules.                                                        |
| `npm run format`    | Formats with oxfmt.                                                                       |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit`.                                          |
| `npm test`          | Runs validation and Slack tests, and runs the real migrations and RLS policies in PGlite. |
| `npm run test:e2e`  | Runs Playwright against a running app and a real Supabase project.                        |
| `npm run build`     | Builds for production.                                                                    |

CI (`.github/workflows/verify.yml`) runs lint, typecheck, tests, build, and `npm audit --omit=dev --audit-level=high` on every push and pull request. CI does not run the e2e tests.

The e2e specs (`workflow`, `passkey`, `newsletter`) create fictional records and delete them afterwards. Start the app before running them, and point them only at a test environment. A spec fails if configuration is missing. It does not skip.

## How it works

### Inquiries

The form in `components/inquiry-form.tsx` posts to `POST /api/requests`. That route calls the `submit_request()` function in Postgres.

- The route rejects requests from other origins, non-JSON bodies, bodies over 16 KB, unknown fields, and submissions that fill the hidden honeypot field.
- The route hashes the IP and email with HMAC before sending them to the database.
- `submit_request()` runs as one transaction. Every form submission carries a `submissionId`.
  - A retry with the same id and content returns the existing request.
  - A retry with the same id and different content gets a 409.
  - More than 10 submissions per IP or 3 per email in an hour get a 429.
- A new request sends a Slack alert after the response goes out. A retry sends nothing.

### Admin

- `proxy.ts` refreshes the Supabase session on `/admin/*` and sets `Cache-Control: private, no-store`. It does not check who the user is.
- `requireOwner()` in `lib/crm/auth.ts` does that check. It calls `getUser()`, then looks the user up in `admin_users`. Every query and mutation calls it first.
- Row-level security repeats the owner check on every table. A bug in app code still cannot expose data to anyone else.
- Server actions in `app/admin/actions.ts` call `lib/crm/mutations.ts` through `save()`. `save()` returns `{ error }` or `{ success }` and revalidates `/admin`.
- Database triggers write the activity log. App code never writes to it.
- `convert_request()` turns a request into a customer in one transaction. Converting the same request twice returns the same customer. Customer emails are unique, ignoring case.

### Newsletter toggle

The homepage shows the newsletter section only when `homepage_settings.newsletter_enabled` is true. The owner turns it on or off from the admin overview. Next.js caches the public read for up to an hour. Saving the toggle clears that cache with `revalidateTag('homepage-settings')`.

## Layout

```
app/
  _home/            homepage sections, styles, and shader
  admin/            login, workspace pages, server actions, and admin UI
  api/requests      public inquiry endpoint
  api/admin/session owner check after sign-in
  api/health        config and owner check for uptime monitors
  privacy/          privacy policy
  new/              permanent redirect to /
components/         inquiry form and dialog
lib/crm/            auth, queries, mutations, validation, Slack alerts, origin check
lib/supabase/       server and browser session clients, and the server-only intake client
lib/homepage-settings.ts
proxy.ts            admin session refresh
next.config.ts      CSP and security headers
supabase/migrations/
scripts/            owner provisioning
tests/              node:test suites, with Playwright specs in e2e/
```

## Conventions

- Next.js 16 changed many APIs. Read the matching guide in `node_modules/next/dist/docs/` before using an API you don't know (see `AGENTS.md`).
- All data access goes through `lib/crm/queries.ts` and `lib/crm/mutations.ts`. Modules that touch data import `server-only`.
- Validate request bodies, form data, and database rows with zod.
- Admin styles live in `app/admin/admin.css`, scoped under `.cx`. Homepage styles live in `app/_home/*.css` and `app/globals.css`.
- To change the schema, add a new migration file. Never edit one that has been applied.

## Deploy

1. Set the environment variables for each Vercel environment.
2. Apply new migrations to that environment's database.
3. Deploy, then confirm `/api/health` returns 200. That check covers configuration and the single owner row. It does not prove that inquiries or sign-in work.
4. Before promoting to production, complete [docs/production-checklist.md](docs/production-checklist.md).
