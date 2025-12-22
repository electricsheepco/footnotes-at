// Date formatting for footnotes

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function formatDateShort(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

// Get first non-empty line from text (for untitled headlines)
export function getFirstLine(text: string, maxLength: number = 100): string {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return "Untitled";

  let firstLine = lines[0]
    .replace(/^#+\s*/, "") // Remove markdown headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .trim();

  if (firstLine.length > maxLength) {
    firstLine = firstLine.slice(0, maxLength) + "…";
  }

  return firstLine || "Untitled";
}

// Generate excerpt from markdown body
export function getExcerpt(body: string, maxLength: number = 160): string {
  // Strip markdown syntax for excerpt
  const plain = body
    .replace(/#{1,6}\s+/g, "") // headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/_([^_]+)_/g, "$1") // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/\n+/g, " ") // newlines to spaces
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  // Cut at word boundary
  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}
