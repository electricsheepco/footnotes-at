# footnotes.at

A quiet place for short writing. No likes, no followers, no algorithms.

## What is this?

footnotes.at is a minimal microblogging and newsletter tool. Authors write short pieces called "footnotes" that live alongside everything else they do. Readers can subscribe via email.

- Writing-first experience
- No engagement metrics
- No social features
- Public archive + email delivery

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Resend (email)

## Local Development

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database (local or remote)

### Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd footnotes-at
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure `.env`:

```bash
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/footnotes"

# Optional for dev (emails logged to console without this)
RESEND_API_KEY=""
FROM_EMAIL="hello@footnotes.at"

# Required
NEXT_PUBLIC_BASE_URL="http://localhost:4050"

# For seed script
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
ADMIN_HANDLE="demo"
ADMIN_DISPLAY_NAME="Demo Author"
```

5. Set up database:

```bash
# Push schema to database
pnpm db:push

# Seed with demo data
pnpm db:seed
```

6. Start development server:

```bash
pnpm dev
```

Open http://localhost:4050

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:migrate` | Create migration |
| `pnpm db:seed` | Seed database with demo data |
| `pnpm db:studio` | Open Prisma Studio |

## Deployment (Vercel)

### 1. Create Vercel Project

```bash
vercel
```

### 2. Add Vercel Postgres

In Vercel dashboard:
1. Go to Storage
2. Create Postgres database
3. Connect to your project

The `DATABASE_URL` will be automatically added to environment variables.

### 3. Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=hello@footnotes.at
NEXT_PUBLIC_BASE_URL=https://footnotes.at
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password-here
ADMIN_HANDLE=yourhandle
ADMIN_DISPLAY_NAME=Your Name
```

### 4. Deploy

```bash
vercel --prod
```

### 5. Run Seed (First Deploy)

After first deploy, seed the database:

```bash
# Connect to Vercel's database
vercel env pull .env.local

# Run seed
pnpm db:seed
```

Or use Vercel's CLI:

```bash
vercel run pnpm db:seed
```

### 6. Configure Domain

In Vercel dashboard → Settings → Domains, add your domain.

## Project Structure

```
src/
├── app/
│   ├── @[handle]/          # Author pages
│   ├── admin/              # Admin pages
│   ├── api/                # API routes
│   ├── subscribed/         # Subscription confirmation
│   └── unsubscribed/       # Unsubscribe confirmation
├── components/             # React components
├── lib/                    # Utilities
└── types/                  # TypeScript types

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed script
```

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/@handle` | Author page |
| `/@handle/slug` | Footnote page |
| `/@handle/tag/tag` | Tag filter |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Login |
| `/admin` | Dashboard |
| `/admin/new` | Create footnote |
| `/admin/edit/[id]` | Edit footnote |

## Email Setup (Resend)

1. Create account at https://resend.com
2. Verify your sending domain
3. Create API key
4. Add `RESEND_API_KEY` and `FROM_EMAIL` to environment

Without `RESEND_API_KEY`, emails are logged to console (useful for development).

## Security Notes

- Single admin user (seeded at setup)
- bcrypt password hashing (cost 12)
- Session tokens in httpOnly cookies
- 7-day session expiry
- Double opt-in for subscriptions
- Unsubscribe tokens in all emails

## License

MIT
