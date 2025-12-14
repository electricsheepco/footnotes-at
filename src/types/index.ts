// Shared types for footnotes.at

import type { Footnote, User, Tag, FootnoteTag } from "@prisma/client";

// Footnote with related data for display
export type FootnoteWithTags = Footnote & {
  tags: (FootnoteTag & { tag: Tag })[];
};

export type FootnoteWithAuthor = FootnoteWithTags & {
  author: Pick<User, "handle" | "displayName">;
};

// Author profile for public display
export type AuthorProfile = Pick<User, "id" | "handle" | "displayName" | "bio">;

// Re-export Prisma types for convenience
export type { Footnote, User, Tag, FootnoteTag } from "@prisma/client";
export { FootnoteStatus } from "@prisma/client";
