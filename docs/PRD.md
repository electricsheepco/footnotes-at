# footnotes.at — Product Requirements Document

## Product Intent

footnotes.at is a quiet microblogging and newsletter tool for writers who want to publish without performing.

A "footnote" is a short piece of writing (50–500 words) that lives alongside everything else the author does. Footnotes stack over time. They do not compete for attention.

The public archive is the canonical home. Email is delivery, not identity.

## Target Users

**Authors:** Writers, thinkers, builders who want a low-friction place to publish short-form writing without social mechanics. They value permanence over virality.

**Readers:** People who prefer to read on the web or via email, without accounts, notifications, or engagement pressure.

## Non-Goals (Explicit)

- Multiple authors (single-author MVP)
- Comments, replies, or reactions
- Likes, shares, follower counts, view counts
- Algorithmic feeds, trending, or recommendations
- Social login or OAuth
- Rich text editor (WYSIWYG)
- Image uploads (external links only)
- Weekly digest
- Analytics dashboard
- Custom domains
- Monetization or payments

---

## Core Objects

### Footnote
A short piece of writing.
- **body**: Markdown content (bold, italics, links, lists)
- **title**: Optional
- **slug**: Generated on publish, permanent
- **status**: `DRAFT` | `PUBLISHED` | `UNLISTED`
- **tags**: Simple string array (e.g., `["notes", "code"]`)
- **publishedAt**: Set once on first publish

### Author
Single admin user for MVP.
- **handle**: URL namespace (e.g., `sam` → `/@sam`)
- **displayName**: Shown on author page
- **bio**: Optional, markdown allowed
- **email**: For login only

### Subscriber
Email-only relationship to one author.
- **email**: Validated, unique per author
- **confirmedAt**: Null until double opt-in completed
- **unsubscribeToken**: For one-click unsubscribe

---

## User Stories

### Reader
- View published footnotes at `/@handle` (newest first)
- Read a single footnote at `/@handle/[slug]`
- Filter by tag at `/@handle/tag/[tag]`
- Subscribe via email form
- Confirm subscription via email link
- Unsubscribe via link in any email

### Author
- Log in to admin area
- Create footnote drafts
- Edit any footnote
- Publish draft (generates slug, sets publishedAt)
- Unlist published footnote (hides from feed, keeps permalink)
- Delete footnote
- Optionally email footnote to subscribers on publish
- View subscriber count (number only)

---

## Data Model

```
Author
  id visibleName handle bio email passwordHash createdAt

Footnote
  id authorId slug? title? body status tags[] publishedAt? createdAt updatedAt

Subscriber
  id email authorId confirmToken confirmedAt? unsubscribeToken createdAt

Session
  id userId token expiresAt createdAt
```

---

## Routes

### Public Pages
| Path | Purpose |
|------|---------|
| `/` | Product homepage |
| `/@[handle]` | Author's published footnotes |
| `/@[handle]/[slug]` | Single footnote |
| `/@[handle]/tag/[tag]` | Footnotes filtered by tag |

### Admin Pages
| Path | Purpose |
|------|---------|
| `/admin/login` | Login form |
| `/admin` | Dashboard: footnote list, subscriber count |
| `/admin/new` | Create footnote |
| `/admin/edit/[id]` | Edit footnote |

### API Routes
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/subscribe` | Create pending subscriber |
| GET | `/api/subscribe/confirm/[token]` | Confirm subscription |
| GET | `/api/unsubscribe/[token]` | Unsubscribe |
| POST | `/api/admin/login` | Authenticate |
| POST | `/api/admin/logout` | End session |
| POST | `/api/admin/footnotes` | Create footnote |
| PUT | `/api/admin/footnotes/[id]` | Update footnote |
| DELETE | `/api/admin/footnotes/[id]` | Delete footnote |
| POST | `/api/admin/footnotes/[id]/publish` | Publish + optional email |

---

## Email Flows

### Subscribe
1. Reader submits email → subscriber created with `confirmedAt = null`
2. Confirmation email sent with tokenized link
3. Reader clicks link → `confirmedAt` set → redirect to author page

### Notify
1. Author publishes with "email subscribers" checked
2. Email sent to all confirmed subscribers with excerpt + link
3. Each email includes unsubscribe link

### Unsubscribe
1. Reader clicks unsubscribe link → subscriber deleted → confirmation page

---

## Security Considerations

**Authentication**
- Single admin seeded at setup
- bcrypt password hashing (cost 12)
- Session token in httpOnly, secure, sameSite=lax cookie
- 7-day session expiry

**Authorization**
- `/admin/*` and `/api/admin/*` require valid session
- Public routes require no auth

**Validation**
- All inputs validated with Zod schemas
- Markdown sanitized via react-markdown (no raw HTML)
- Email format validated before storage

**Tokens**
- confirmToken and unsubscribeToken are cryptographically random
- Tokens are single-use or long-lived (unsubscribe)

---

## Success Criteria

MVP ships when:
1. Author page displays published footnotes
2. Footnote permalinks work
3. Tag filtering works
4. Admin can create, edit, publish, unlist, delete
5. Subscribe flow with double opt-in works
6. Publish-with-email sends to confirmed subscribers
7. Unsubscribe works
