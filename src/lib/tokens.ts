// Generate cryptographically secure random tokens

export function generateToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate a confirm token (64 hex chars = 32 bytes)
export function generateConfirmToken(): string {
  return generateToken(32);
}

// Generate an unsubscribe token (64 hex chars = 32 bytes)
export function generateUnsubscribeToken(): string {
  return generateToken(32);
}
