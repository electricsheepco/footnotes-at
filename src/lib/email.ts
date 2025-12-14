import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "footnotes@example.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4050";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const { to, subject, text, html } = options;

  if (resend) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        text,
        html: html || text,
      });
      return true;
    } catch (error) {
      console.error("[EMAIL ERROR]", error);
      return false;
    }
  } else {
    // Console fallback for development
    console.log("\n" + "=".repeat(60));
    console.log("[EMAIL] Would send email:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("-".repeat(60));
    console.log(text);
    console.log("=".repeat(60) + "\n");
    return true;
  }
}

// Email templates

export async function sendConfirmationEmail(
  to: string,
  authorName: string,
  confirmToken: string
): Promise<boolean> {
  const confirmUrl = `${BASE_URL}/api/subscribe/confirm/${confirmToken}`;

  const subject = `Confirm your subscription to ${authorName}`;

  const text = `
You've requested to subscribe to ${authorName} on footnotes.at.

Click the link below to confirm your subscription:
${confirmUrl}

If you didn't request this, you can safely ignore this email.
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>You've requested to subscribe to <strong>${authorName}</strong> on footnotes.at.</p>
  <p>Click the link below to confirm your subscription:</p>
  <p><a href="${confirmUrl}" style="color: #000; text-decoration: underline;">${confirmUrl}</a></p>
  <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
</body>
</html>
`.trim();

  return sendEmail({ to, subject, text, html });
}

export async function sendFootnoteEmail(
  to: string,
  authorName: string,
  authorHandle: string,
  footnoteTitle: string | null,
  footnoteExcerpt: string,
  footnoteSlug: string,
  unsubscribeToken: string
): Promise<boolean> {
  const footnoteUrl = `${BASE_URL}/@${authorHandle}/${footnoteSlug}`;
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe/${unsubscribeToken}`;

  const title = footnoteTitle || "New footnote";
  const subject = `${title} — ${authorName}`;

  const text = `
${title}

${footnoteExcerpt}

Read more: ${footnoteUrl}

---
Unsubscribe: ${unsubscribeUrl}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; font-weight: 500; margin-bottom: 16px;">${title}</h1>
  <p style="color: #444;">${footnoteExcerpt}</p>
  <p><a href="${footnoteUrl}" style="color: #000; text-decoration: underline;">Read more →</a></p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="color: #999; font-size: 12px;">
    <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
  </p>
</body>
</html>
`.trim();

  return sendEmail({ to, subject, text, html });
}
