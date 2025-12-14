import { db } from "./db";

// Generate a URL-safe slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Generate a date-based slug: YYYY-MM-DD
function dateSlug(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Generate a unique slug for a footnote
// Uses title if available, otherwise uses date
// Appends a suffix if slug already exists for this author
export async function generateSlug(
  authorId: string,
  title?: string | null
): Promise<string> {
  const base = title ? slugify(title) : dateSlug();

  // If base is empty (title was all special chars), use date
  const slugBase = base || dateSlug();

  // Check if slug exists
  let slug = slugBase;
  let suffix = 1;

  while (true) {
    const existing = await db.footnote.findUnique({
      where: { authorId_slug: { authorId, slug } },
      select: { id: true },
    });

    if (!existing) {
      break;
    }

    // Append suffix and try again
    suffix++;
    slug = `${slugBase}-${suffix}`;
  }

  return slug;
}

// Generate a slug for a tag
export function tagSlug(name: string): string {
  return slugify(name) || name.toLowerCase().replace(/\s+/g, "-");
}
