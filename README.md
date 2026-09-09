# Jonas personal website

A dark portfolio and services website for an independent engineer. Built with React, TypeScript, and Vinext.

## Run locally

Install dependencies with `npm ci`, then run `npm run dev`. Open the local URL printed by the server.

Run `npm run build` for the production build. Run `npx tsc --noEmit` and `npm run lint` to check the application. Lint covers application code and configuration; the unchanged generated component catalog is excluded.

## Replace preview content

- `app/page.tsx` contains the page copy, service descriptions, FAQs, and concept projects.
- The contact dialog is an intentional placeholder. Replace it with a verified email address or booking link before public launch. It collects and sends no information.
- Forma and Orbit are clearly labeled fictional concepts. Replace them with approved work examples before presenting them as client projects.
- Review the proposed service inclusions and support wording before public launch. No prices or delivery timelines have been promised.
- `app/globals.css` contains the visual theme, responsive layouts, and motion. Reduced-motion preferences disable animations and smooth scrolling.
- `public/images/atmosphere.webp` is original generated artwork used in the hero.

The site starts with private access on Sites. Its project identifier is recorded in `.openai/hosting.json`.
