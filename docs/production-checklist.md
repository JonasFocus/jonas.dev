# Production checklist

Complete this list before promoting a release that changes inquiries, auth, or the database. A passing build does not prove that storage or sign-in work.

## Platform

- [ ] The site uses a dedicated Supabase project with public signup and anonymous sign-ins turned off.
- [ ] Every migration is applied. `npm test` checks RLS locally, but not the hosted Auth or Data API settings.
- [ ] Exactly one owner exists. The recovery password is in a password manager, and `work/owner-recovery.json` is deleted.
- [ ] Every required environment variable is set for this environment (see the README). `APP_URL` matches the browser origin exactly.
- [ ] The passkey relying party uses the production domain and its HTTPS origins. Changing the RP ID after enrollment breaks existing passkeys. Passkeys created on localhost do not work in production.
- [ ] The owner has two passkeys on the production domain.
- [ ] Backups are on, and one backup has been restored into a separate project.
- [ ] An uptime monitor checks `/api/health`.

## Automated checks

```sh
npm run lint && npm run typecheck && npm test && npm run build && npm audit --omit=dev
```

Then run `npm run test:e2e` against the deployed test environment.

## Manual checks on the deployed site

1. Submit a valid inquiry. The form confirms it, and it appears in `/admin/requests`. If Slack is configured, the alert arrives.
2. Resubmit the same submission. No new request appears. Reusing its id with different content fails.
3. Submit invalid, oversized, cross-origin, honeypot, and rate-limited requests. None of them creates a record.
4. Signed-out users and signed-in non-owners cannot read or change data, including through direct Data API calls.
5. The owner can mark a request read, change its status, add a note, schedule and complete a follow-up, convert it to a customer once, and edit that customer.
6. Passkey sign-in, password sign-in, sign-out, and expired sessions all work.
7. The newsletter toggle shows and hides the homepage section.
8. On keyboard and mobile, nothing scrolls sideways, dialogs trap focus and return it on close, and error and empty states render.
9. `/new` redirects to `/`. The sitemap, robots file, canonical URL, and privacy page are correct. Admin pages are noindex and `no-store`.
10. With the database unreachable, the form shows an error instead of success. A retry after recovery succeeds.
11. You know how to roll back by promoting the previous Vercel deployment.

## Open items

- Link the custom domain `jonasinfocus.com`, then enroll the owner's passkeys on it.
- Restore a backup once the first one exists.
- Set up uptime monitoring.
