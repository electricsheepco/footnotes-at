import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

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
