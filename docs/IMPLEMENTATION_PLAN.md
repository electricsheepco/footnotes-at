# footnotes.at — Implementation Plan

## Build Order

Each phase is a logical unit that can be reviewed and tested independently.

---

### Phase 1: Foundation

**1.1 Project Setup**
- Install dependencies: Prisma, Zod, bcrypt, react-markdown, remark-gfm
- Create `.env.example` with required variables
- Set up folder structure under `src/`

**1.2 Database Schema**
- Define Prisma schema (Author, Footnote, Subscriber, Session)
- Configure Prisma for Postgres
- Create initial migration
- Write seed script (demo author + sample footnotes)

**1.3 Core Library Code**
- `lib/db.ts` — Prisma client singleton
- `lib/auth.ts` — password hashing, session creation/validation
- `lib/tokens.ts` — secure random token generation
- `lib/slug.ts` — slug generation from title or timestamp
- `lib/markdown.ts` — markdown rendering config

---

### Phase 2: Public Reading Experience

**2.1 Shared Components**
- `components/Layout.tsx` — minimal page wrapper
- `components/FootnoteCard.tsx` — footnote preview (title, excerpt, date, tags)
- `components/FootnoteBody.tsx` — full markdown rendering
- `components/TagList.tsx` — clickable tag display
- `components/SubscribeForm.tsx` — email input + submit

**2.2 Public Pages**
- `/` — homepage with product pitch
- `/@[handle]` — author page with footnote list
- `/@[handle]/[slug]` — single footnote page
- `/@[handle]/tag/[tag]` — filtered footnote list

**2.3 Data Fetching**
- Server components fetching directly from Prisma
- No client-side data fetching for public pages
- Static generation where possible (revalidate on publish)

---

### Phase 3: Admin Authentication

**3.1 Auth Infrastructure**
- `lib/session.ts` — cookie management (set, get, clear)
- Middleware to protect `/admin/*` routes
- Zod schemas for login input

**3.2 Auth Pages & API**
- `/admin/login` — login form
- `/api/admin/login` — validate credentials, create session
- `/api/admin/logout` — destroy session, clear cookie

**3.3 Auth Verification**
- Session validation on each admin request
- Redirect to login if invalid/expired

---

### Phase 4: Admin Dashboard & Editor

**4.1 Dashboard**
- `/admin` — list all footnotes (drafts, published, unlisted)
- Show subscriber count
- Links to create/edit

**4.2 Editor**
- `/admin/new` — create new footnote
- `/admin/edit/[id]` — edit existing footnote
- Markdown textarea with live preview toggle
- Tag input (comma-separated)
- Status selector (draft/published/unlisted)
- "Email to subscribers" checkbox (shown on publish)

**4.3 Footnote API**
- `POST /api/admin/footnotes` — create
- `PUT /api/admin/footnotes/[id]` — update
- `DELETE /api/admin/footnotes/[id]` — delete
- `POST /api/admin/footnotes/[id]/publish` — publish + optional email

---

### Phase 5: Email Subscriptions

**5.1 Email Infrastructure**
- `lib/email.ts` — Resend client with console fallback
- Email templates (plain text + simple HTML)
- Template: confirmation email
- Template: footnote notification

**5.2 Subscribe Flow**
- `POST /api/subscribe` — create subscriber, send confirmation
- `GET /api/subscribe/confirm/[token]` — confirm subscription
- `GET /api/unsubscribe/[token]` — remove subscriber

**5.3 Notification on Publish**
- When publish API called with `emailSubscribers: true`
- Query confirmed subscribers
- Send email to each (batch if needed)

---

### Phase 6: Polish & Deploy

**6.1 UI Refinement**
- Typography tuning (font sizes, line heights, spacing)
- Dark mode verification
- Mobile responsiveness check
- Loading and error states

**6.2 Security Hardening**
- Review all inputs for Zod validation
- Verify session cookie settings
- Test auth flows

**6.3 Deployment**
- Vercel project setup
- Vercel Postgres provisioning
- Environment variables configured
- Production seed (or manual author creation)
- Domain configuration

---

## MVP Cut-Lines

### In MVP
- Single author
- CRUD for footnotes
- Draft/published/unlisted status
- Tag filtering
- Email subscription with double opt-in
- Email notification on publish
- Basic admin auth

### Post-MVP (Do Not Build Now)
- Multiple authors
- Weekly digest emails
- Image uploads
- Custom domains
- Analytics
- Comments/reactions
- OAuth/social login
- Password reset flow
- Subscriber management UI
- Batch operations
- Search

---

## Auth Approach

**Choice: Cookie-based sessions with bcrypt**

**Rationale:**
- Simplest secure approach for single-admin scenario
- No external dependencies (no Auth0, Clerk, NextAuth complexity)
- bcrypt is battle-tested for password hashing
- httpOnly cookies prevent XSS token theft
- No JWT complexity (no refresh tokens, no client-side storage)
- Session table allows explicit revocation if needed

**Implementation:**
- Password hashed with bcrypt (cost factor 12)
- Session token: 32-byte random hex string
- Cookie: `httpOnly`, `secure` (in prod), `sameSite=lax`
- Expiry: 7 days, checked on each request
- No "remember me" — single expiry policy

**Tradeoff:**
- No password reset in MVP (admin can update via database or seed script)
- Single device limitation not a concern for single admin

---

## Email Approach

**Choice: Resend with console fallback**

**Rationale:**
- Resend is simple, modern, good developer experience
- Generous free tier (100 emails/day, 3000/month)
- No complex SMTP configuration
- Console fallback allows full local development without email setup

**Implementation:**
```typescript
// lib/email.ts
if (process.env.RESEND_API_KEY) {
  // Send via Resend
} else {
  // Log to console in development
  console.log('[EMAIL]', { to, subject, body })
}
```

**Limits:**
- Free tier: 100/day, 3000/month — sufficient for MVP
- No batching in MVP; sequential sends acceptable at small scale
- Plain text + simple HTML (no complex templates)

**Templates:**
1. **Confirmation**: Subject, single CTA link, brief copy
2. **Notification**: Title, excerpt, read link, unsubscribe link

---

## Deployment Assumptions

**Platform: Vercel**
- Next.js native support
- Automatic SSL
- Edge network for static assets
- Serverless functions for API routes

**Database: Vercel Postgres**
- Managed Postgres, no ops overhead
- Connection pooling via `@vercel/postgres` or direct Prisma connection
- Automatic backups on paid plans

**Environment Variables:**
```
DATABASE_URL=           # Vercel Postgres connection string
RESEND_API_KEY=         # Optional in dev
ADMIN_EMAIL=            # For seeding
ADMIN_PASSWORD=         # For seeding (hash generated)
SESSION_SECRET=         # For cookie signing (if needed)
NEXT_PUBLIC_BASE_URL=   # For email links
```

**Deployment Flow:**
1. Push to main triggers Vercel build
2. Prisma migration runs via build script
3. App deploys to production

**DNS:**
- `footnotes.at` pointed to Vercel
- SSL automatic via Vercel

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── @[handle]/
│   │   ├── page.tsx                # Author page
│   │   ├── [slug]/
│   │   │   └── page.tsx            # Footnote page
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx        # Tag filter page
│   ├── admin/
│   │   ├── layout.tsx              # Auth check wrapper
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx                # Dashboard
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx
│   └── api/
│       ├── subscribe/
│       │   ├── route.ts            # POST subscribe
│       │   └── confirm/
│       │       └── [token]/
│       │           └── route.ts    # GET confirm
│       ├── unsubscribe/
│       │   └── [token]/
│       │       └── route.ts        # GET unsubscribe
│       └── admin/
│           ├── login/
│           │   └── route.ts
│           ├── logout/
│           │   └── route.ts
│           └── footnotes/
│               ├── route.ts        # POST create
│               └── [id]/
│                   ├── route.ts    # PUT, DELETE
│                   └── publish/
│                       └── route.ts
├── components/
│   ├── Layout.tsx
│   ├── FootnoteCard.tsx
│   ├── FootnoteBody.tsx
│   ├── TagList.tsx
│   ├── SubscribeForm.tsx
│   └── Editor.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── session.ts
│   ├── tokens.ts
│   ├── slug.ts
│   ├── email.ts
│   └── markdown.ts
└── types/
    └── index.ts
prisma/
├── schema.prisma
└── seed.ts
```

---

## Estimated Build Sequence

| Phase | Description | Dependencies |
|-------|-------------|--------------|
| 1 | Foundation | None |
| 2 | Public pages | Phase 1 |
| 3 | Admin auth | Phase 1 |
| 4 | Admin editor | Phase 2, 3 |
| 5 | Email | Phase 4 |
| 6 | Polish & deploy | All |

Each phase builds on the previous. No phase should be started until its dependencies are complete and tested.
