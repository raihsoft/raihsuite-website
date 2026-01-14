# Raisuite Web Starter

A reusable **Next.js (App Router) + TypeScript + Tailwind** starter for building multi-tenant client websites that begin with mostly static content and can later evolve to dynamic CMS-driven experiences. Includes:

- DevContainer for consistent developer onboarding.
- Environment variable validation.
- Multi-tenant-ready contact endpoint scaffold.
- Accessible form components.
- Testing setup (Jest + Testing Library).
- Tailwind design token starter (CSS variables for tenant themes).

## Quick Start

1. Install VS Code + Dev Containers extension.
2. Clone repository:
   ```bash
   git clone <repo-url> raihsuite-web-starter
   cd raihsuite-web-starter
   ```
3. Open folder in VS Code; choose "Reopen in Container".
4. Copy `env.example` to `.env` and fill in values.
5. Run:
   ```bash
   pnpm dev
   ```
6. Visit `http://localhost:3000`.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start local development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server locally |
| `pnpm lint` | ESLint (errors fail) |
| `pnpm format` | Prettier formatting |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm preflight` | Validate required environment variables |
| `pnpm test` | Run Jest tests |

## Environment Variables

Defined in `env.example`:
- `TENANT_ID` – identifies tenant (used for theming, tagging enquiries).
- `RAISUITE_API_BASE` – base URL for Raisuite ERP API.
- `RAISUITE_API_KEY` – secret API key for server-side usage only.
- `TURNSTILE_SECRET` – optional (Cloudflare Turnstile CAPTCHA).

Validation occurs via `src/lib/env.ts`. The contact route fails early if variables are missing.

## Contact Endpoint

POST `/api/contact`
- Accepts `name`, `email`, `message`.
- Validates with Zod.
- Rate limit placeholder (in-memory).
- TODO: Add Turnstile (Cloudflare) verification.
- TODO: Replace mock forwarding with real fetch to Raisuite ERP.

## Converting HTML Templates

1. Place original template files in a temporary folder (e.g. `templates/source-reference/`).
2. Identify repeating sections (hero, features, testimonials) → convert into React components under `src/components/`.
3. Inline scripts that only animate can usually become CSS transitions or `framer-motion` usage.
4. For static assets (images, fonts), move into `public/`.
5. Replace global CSS with Tailwind classes incrementally; keep original stylesheet until fully replaced.

## Multi-Tenant Theming

- Current approach uses CSS variables (`--color-brand`).
- Future: Map `TENANT_ID` to a theme object and inject variables at runtime in `layout.tsx` (or middleware when customizing per request).
- Optionally integrate a design token file exporting Tailwind `theme.extend` overrides.

## Future CMS Integration

Possible approach:
1. Add route handlers or server actions calling a headless CMS.
2. Use incremental static regeneration (`fetch` with `next: { revalidate: 60 }`) or dynamic rendering.
3. Implement preview mode (if using Next.js preview API with a secret token).

## Testing

- Basic test example located in `src/__tests__/contactForm.test.tsx`.
- Extend coverage for new components as you add them.
- TODO: Add accessibility tests (axe-core) & Playwright for e2e in future.

## Accessibility

- Form inputs link labels with `htmlFor`.
- Error messages have `role=\"alert\"` and `aria-describedby`.
- TODO: Add automated axe checks.

## Deployment (Cloudflare Pages)

- Cloudflare Pages can build Next.js directly; for advanced edge features, evaluate `@cloudflare/next-on-pages` (if required for middleware).
- Ensure environment variables set in Cloudflare dashboard.
- Use branch protections with GitHub Actions (optional) before allowing deployments.

### Cloudflare Pages Setup

- Build command: `npx @cloudflare/next-on-pages@latest`
- Output directory: `.vercel/output/static`
- Root directory: `/`
- Build system version: `3 (latest)`
- Node compatibility: enable `nodejs_compat` (via Pages UI) or add `wrangler.toml`:

```toml
name = "raihsuite-web-starter"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]
```

Environment variables (Production):
- `TENANT_ID`
- `RAISUITE_API_BASE`
- `RAISUITE_API_KEY`
- `TURNSTILE_SECRET` (optional)

Local parity:
```bash
pnpm install --frozen-lockfile
node scripts/preflight-env.mjs
pnpm build:pages
```

Redeploy checklist:
- Ensure output dir is `.vercel/output/static` (no leading slash)
- Add required environment variables in Pages → Settings → Environment variables
- Trigger a new deploy

## Rate Limiting & Security Notes

Current rate limiting is **not production-safe** (in-memory). Replace with:
- Cloudflare KV / Durable Objects
- Redis (if using external store)
- Add per-IP & per-tenant counters and exponential backoff or captcha requirement after threshold.

Always:
- Validate input.
- Avoid returning upstream error details.
- Log minimal PII (extend log scrubbing when needed).

## Roadmap / TODO

- [ ] Implement Turnstile CAPTCHA integration.
- [ ] Add proper multi-tenant theme mapping.
- [ ] Add CMS data fetching example.
- [ ] Move rate limiting to durable store.
- [ ] Add Playwright E2E tests.
- [ ] Add Git hooks (Husky) for pre-commit lint & format.

## Contributing

1. Create a feature branch.
2. Run `pnpm preflight` before pushing.
3. Include tests for new components or endpoints.
4. Open PR; run local `pnpm typecheck && pnpm lint && pnpm test` before requesting review.

## License

Internal proprietary starter (adjust if open-sourcing later).