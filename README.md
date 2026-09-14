# Umuogideke Family Forum

A meetings, dues &amp; records app for the Umuogideke family union.

Two roles:

- **Admin** (username/password) — full access: add members, record meeting attendance &amp;
  ₦200 dues, upload meeting minutes (PDF), create levies (weddings, burials, etc.), toggle
  payments, export a CSV report.
- **Member** (pick your name + last 4 digits of your phone) — view-only access to meetings,
  dues, and levies.

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, UPLOADTHING_TOKEN
npm run db:migrate     # applies the Prisma schema
npm run db:seed        # seeds demo members/meetings/levies + an admin account
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed script prints the admin
login it created (defaults to `ad***m***` / `umuog**e**********` — override via
`SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` in `.env` before seeding a real deployment).

### Environment variables

See `.env.example`. In short:

- `DATABASE_URL` — PostgreSQL connection string (Neon, Supabase, Railway, Vercel Postgres, …).
  On a serverless/pooled Postgres host, give it enough `connection_limit`/`pool_timeout`
  headroom (e.g. `connection_limit=10&pool_timeout=20`) — pages here run a few queries
  per request, so too tight a limit causes `Timed out fetching a new connection from
  the connection pool` — and a generous `connect_timeout` (e.g. `30`), since cold-starting
  compute can otherwise time out the first query after idling.
- `AUTH_SECRET` — session signing secret. Generate with `npx auth secret`.
- `UPLOADTHING_TOKEN` — from the [UploadThing dashboard](https://uploadthing.com); required
  for the "Upload Minutes" button on the Meetings page to work.

### Useful scripts

| Script              | What it does                                  |
| -------------------- | ---------------------------------------------- |
| `npm run dev`         | Start the dev server                          |
| `npm run build`       | Type-check and build for production           |
| `npm run db:migrate`  | `prisma migrate dev`                          |
| `npm run db:seed`     | `prisma db seed`                              |
| `npm run db:studio`   | Open Prisma Studio to browse the database     |

## Project structure

- `app/(app)/*` — authenticated pages (dashboard, members, meetings, payments, levies, reports)
- `app/login` — the admin/member sign-in screen
- `actions/*` — Server Actions for mutations (admin-only, re-checked server-side)
- `lib/auth.ts` — Auth.js config (two Credentials providers: admin, member)
- `lib/stats.ts` — shared dues/levy money math (mirrors the original design prototype)
- `prisma/schema.prisma`, `prisma/seed.ts` — data model and demo seed data
- `proxy.ts` — route protection (Next.js 16's replacement for `middleware.ts`)

## Deploying

Any Next.js host works; UploadThing + a serverless Postgres (Neon, etc.) pair well with
Vercel. Set the environment variables above, run `prisma migrate deploy` against the
production database, then seed it once (or create members/an admin manually).
