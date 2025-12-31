# CLAUDE.md - Project Context for Claude Code

## Project Overview

**footnotes.at** is a minimal microblogging platform for short-form writing. No likes, no followers, no algorithms. Just words that accumulate over time.

**Live site:** https://footnotes.at
**Repository:** https://github.com/electricsheepco/footnotes-at

## Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Neon) with Prisma 6 ORM
- **Email:** Resend (console fallback in dev)
- **Validation:** Zod
- **Markdown:** react-markdown + remark-gfm
- **Hosting:** Vercel

## Key Commands

```bash
pnpm dev              # Start dev server on port 4050
pnpm build            # Production build
pnpm lint             # ESLint
pnpm db:push          # Push Prisma schema to database
pnpm db:seed          # Seed admin user
pnpm db:studio        # Open Prisma Studio
vercel --prod         # Deploy to production
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [handle]/           # Dynamic author routes (/@handle)
│   │   ├── [slug]/         # Individual footnote page
│   │   ├── edit/[id]/      # Edit footnote
│   │   ├── footnotes/      # User dashboard
│   │   ├── tag/[tag]/      # Tag filtering
│   │   └── write/          # New footnote
│   ├── api/                # API routes
│   ├── about/              # About page
│   ├── help/               # Help page
│   ├── login/              # Auth page (login/signup/change password)
│   └── page.tsx            # Homepage
├── components/             # React components
├── lib/                    # Utilities (auth, db, email, validation)
└── types/                  # TypeScript types

public/
├── favicon.ico             # Asterisk logomark
├── logomark.png            # Logo image (transparent)
├── apple-touch-icon.png    # iOS icon
└── og/                     # OpenGraph images
```

## Database Models (Prisma)

- **User** - Author profile, credentials, handle
- **Footnote** - Writing content (DRAFT/PUBLISHED/UNLISTED status)
- **Tag** - Normalized tags
- **FootnoteTag** - Many-to-many join
- **Subscriber** - Email subscriptions with double opt-in
- **Session** - Auth sessions (7-day expiry)
- **DogEar** - Private saved footnotes with optional selected text

## Key Features

### Authentication
- Session-based auth with httpOnly cookies
- bcrypt password hashing (12 rounds)
- Login redirects preserve `?next=` param

### Dog-ear (Private Collections)
- Click earmark icon to save footnotes
- Select text before dog-earing to save with context
- Underlines show saved passages on return
- Prompts login if not authenticated

### Subscriptions
- Double opt-in email subscription per author
- Notifications via Resend on publish
- One-click unsubscribe with tokens

### SEO
- Dynamic sitemap.xml at /sitemap.xml
- robots.txt at /robots.txt
- OpenGraph + Twitter card metadata per footnote
- JSON-LD Article schema on footnote pages
- Google Search Console verified

## Typography

- **Body/Logo:** Gentium Book Plus (serif) at 36px for logo
- **UI:** JetBrains Mono (monospace)
- **Date format:** YYYYMMDD

## Design Principles

- Server-rendered pages (no client-only rendering where possible)
- No tracking, no third-party scripts
- Calm, precise, minimal tone
- No emojis unless user requests
- Off-white background with transparent logomark

## Environment Variables

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://footnotes.at"
RESEND_API_KEY="re_..."           # Optional in dev
FROM_EMAIL="footnotes.at <noreply@footnotes.at>"
```

## Deployment

```bash
git add . && git commit -m "message" && git push origin main
vercel --prod
```

## Common Patterns

### Adding a new page
1. Create `src/app/pagename/page.tsx`
2. Add metadata export for SEO
3. Use server components by default
4. Add to sitemap.ts if public

### Adding API endpoint
1. Create `src/app/api/endpoint/route.ts`
2. Export async functions: GET, POST, PUT, DELETE
3. Use `getSession()` for auth
4. Return NextResponse.json()

### Modifying database
1. Update `prisma/schema.prisma`
2. Run `pnpm db:push` (dev) or create migration
3. Run `pnpm db:generate` to update client
