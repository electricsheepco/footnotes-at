import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must be at most 30 characters")
    .regex(/^[a-z0-9_-]+$/, "Handle can only contain lowercase letters, numbers, hyphens, and underscores"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Footnotes
export const footnoteSchema = z.object({
  title: z.string().max(200, "Title too long").optional(),
  body: z.string().min(1, "Body is required").max(50000, "Body too long"),
  tags: z.array(z.string().max(50)).max(10, "Too many tags").optional(),
});

export type FootnoteInput = z.infer<typeof footnoteSchema>;

export const publishOptionsSchema = z.object({
  emailSubscribers: z.boolean().optional(),
});

export type PublishOptions = z.infer<typeof publishOptionsSchema>;

// Subscriptions
export const subscribeSchema = z.object({
  email: z.email("Invalid email address"),
  authorId: z.string().min(1, "Author ID is required"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
