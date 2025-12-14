import { db } from "./db";
import { tagSlug } from "./slug";

// Parse comma-separated tag string into array of trimmed, non-empty tags
export function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0)
    .slice(0, 10); // Max 10 tags
}

// Get or create tags, return their IDs
export async function getOrCreateTags(
  tagNames: string[]
): Promise<{ id: string; name: string; slug: string }[]> {
  const tags: { id: string; name: string; slug: string }[] = [];

  for (const name of tagNames) {
    const slug = tagSlug(name);

    // Try to find existing tag
    let tag = await db.tag.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });

    // Create if not exists
    if (!tag) {
      tag = await db.tag.create({
        data: { name, slug },
        select: { id: true, name: true, slug: true },
      });
    }

    tags.push(tag);
  }

  return tags;
}

// Update footnote tags - removes old, adds new
export async function updateFootnoteTags(
  footnoteId: string,
  tagNames: string[]
): Promise<void> {
  // Get or create all tags
  const tags = await getOrCreateTags(tagNames);

  // Delete existing tag associations
  await db.footnoteTag.deleteMany({
    where: { footnoteId },
  });

  // Create new associations
  if (tags.length > 0) {
    await db.footnoteTag.createMany({
      data: tags.map((tag) => ({
        footnoteId,
        tagId: tag.id,
      })),
    });
  }
}
