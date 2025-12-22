# footnotes.at

A quiet place for short writing. No likes. No followers. No algorithms. Just words that accumulate over time.

## What is this?

footnotes.at is a shared space where anyone can publish small, self-contained pieces of writing. You can also add footnotes to your personal collection. Not to perform. Not to rank. Just to keep the things that stayed with you.

Everything here is public. The writing flows slowly, newest first.

**Live site:** https://footnotes.at

## Features

### Public Pages
- **Homepage** (`/`) - Two-column layout with about section and "The River" (footnote feed)
- **Author page** (`/@handle`) - Author bio, tag navigation, footnotes list
- **Footnote page** (`/@handle/slug`) - Individual footnote with full markdown rendering
- **Tag filtering** (`/@handle/tag/tagname`) - Footnotes filtered by tag
- **Help** (`/help`) - User guide

### Authentication
- **Login/Signup/Change Password** (`/login`) - Tabbed authentication page
- Session-based auth with httpOnly cookies
- bcrypt password hashing (12 rounds)
- 7-day session expiry

### Writing
- **Dashboard** (`/@handle/footnotes`) - List of drafts and published footnotes
- **Write** (`/@handle/write`) - Markdown editor with live preview
- **Edit** (`/@handle/edit/[id]`) - Edit existing footnotes
- Tag support with `#tag` syntax in body
- Draft/Publish workflow

### Subscriptions
- Double opt-in email subscription per author
- Email notifications on new footnotes (via Resend)
- One-click unsubscribe

### Dog-ear (Private Collections)
- Click the earmark icon to save any footnote to your collection
- Select text and dog-ear to save with context
- Private underlines show your selected passages
- Icon: outline when not saved, filled when saved

## Typography

- **Body font:** Gentium Book Plus (serif)
- **UI font:** JetBrains Mono (monospace)
- **Date format:** YYYYMMDD

## Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 6
- **Email:** Resend
- **Validation:** Zod
- **Markdown:** react-markdown + remark-gfm
- **Hosting:** Vercel

## Project Structure

```
footnotes-at/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── [handle]/      # Author routes (/@handle)
│   │   │   ├── [slug]/    # Individual footnote
│   │   │   ├── edit/      # Edit footnote
│   │   │   ├── footnotes/ # Dashboard
│   │   │   ├── tag/       # Tag filtering
│   │   │   └── write/     # New footnote
│   │   ├── api/           # API routes
│   │   │   ├── dogear/    # Dog-ear CRUD
│   │   │   ├── footnotes/ # Footnote CRUD
│   │   │   ├── login/     # Authentication
│   │   │   ├── logout/    # Session end
│   │   │   ├── signup/    # Registration
│   │   │   ├── subscribe/ # Email subscriptions
│   │   │   └── change-password/
│   │   ├── help/          # Help page
│   │   ├── login/         # Auth page
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── DogEarButton.tsx
│   │   ├── DogEarWrapper.tsx
│   │   ├── FootnoteCard.tsx
│   │   ├── FootnoteCardDogEar.tsx
│   │   ├── FootnoteEditor.tsx
│   │   ├── Markdown.tsx
│   │   ├── SubscribeForm.tsx
│   │   ├── TagList.tsx
│   │   └── TextSelectionPopover.tsx
│   ├── lib/               # Utilities
│   │   ├── auth.ts        # Session management
│   │   ├── db.ts          # Prisma client
│   │   ├── email.ts       # Resend integration
│   │   ├── formatting.ts  # Date/text utilities
│   │   └── validation.ts  # Zod schemas
│   └── types/             # TypeScript types
│       └── index.ts
├── public/                # Static assets
└── package.json
```

## Database Models

- **User** - Author profile and credentials
- **Footnote** - Writing content (draft/published/unlisted)
- **Tag** - Normalized tags
- **FootnoteTag** - Many-to-many join table
- **Subscriber** - Email subscriptions with double opt-in
- **Session** - Auth sessions
- **DogEar** - Private saved footnotes with optional selected text

## Local Development

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL database (or Neon account)

### Setup

```bash
# Clone repository
git clone https://github.com/electricsheepco/footnotes-at.git
cd footnotes-at

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env
# Edit .env with your DATABASE_URL, RESEND_API_KEY, etc.

# Push database schema
pnpm db:push

# Seed admin user (optional)
pnpm db:seed

# Start development server
pnpm dev
```

Open http://localhost:4050

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (port 4050) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Create migration |
| `pnpm db:seed` | Seed database with demo data |
| `pnpm db:studio` | Open Prisma Studio |

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://footnotes.at"

# Email (Resend) - optional for dev, emails logged to console
RESEND_API_KEY="re_..."
FROM_EMAIL="footnotes.at <noreply@footnotes.at>"

# Admin seed credentials (for db:seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"
ADMIN_HANDLE="admin"
ADMIN_DISPLAY_NAME="Admin"
```

## Deployment (Vercel)

### 1. Create Vercel Project

```bash
vercel
```

### 2. Configure Database

Connect your PostgreSQL database (Neon, Vercel Postgres, etc.) and add `DATABASE_URL` to environment variables.

### 3. Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=hello@footnotes.at
NEXT_PUBLIC_BASE_URL=https://footnotes.at
```

### 4. Deploy

```bash
vercel --prod
```

### 5. Seed Database (First Deploy)

```bash
# Pull environment variables
vercel env pull .env.local

# Run seed
DATABASE_URL="..." pnpm db:seed
```

## Security

- bcrypt password hashing (cost 12)
- Session tokens in httpOnly cookies
- 7-day session expiry
- Double opt-in for email subscriptions
- Unsubscribe tokens in all emails
- Cascade deletes for data cleanup

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Homepage with feed |
| `/@handle` | Author page |
| `/@handle/slug` | Footnote page |
| `/@handle/tag/tag` | Tag filter |
| `/login` | Sign in / Sign up / Change password |
| `/help` | User guide |

### Authenticated

| Route | Description |
|-------|-------------|
| `/@handle/footnotes` | Dashboard (owner only) |
| `/@handle/write` | Create footnote |
| `/@handle/edit/[id]` | Edit footnote |

## License

MIT
