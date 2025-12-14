import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribeSchema } from "@/lib/validations";
import { generateConfirmToken, generateUnsubscribeToken } from "@/lib/tokens";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email, authorId } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check author exists
    const author = await db.user.findUnique({
      where: { id: authorId },
      select: { id: true, displayName: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: {
        authorId_email: { authorId, email: normalizedEmail },
      },
    });

    if (existing) {
      if (existing.confirmedAt) {
        // Already confirmed - don't reveal this, just say check email
        return NextResponse.json({ success: true });
      }

      // Not yet confirmed - resend confirmation email
      const sent = await sendConfirmationEmail(
        normalizedEmail,
        author.displayName,
        existing.confirmToken
      );

      if (!sent) {
        return NextResponse.json(
          { error: "Failed to send confirmation email" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Create new subscriber
    const confirmToken = generateConfirmToken();
    const unsubscribeToken = generateUnsubscribeToken();

    await db.subscriber.create({
      data: {
        email: normalizedEmail,
        authorId,
        confirmToken,
        unsubscribeToken,
      },
    });

    // Send confirmation email
    const sent = await sendConfirmationEmail(
      normalizedEmail,
      author.displayName,
      confirmToken
    );

    if (!sent) {
      // Clean up the subscriber if email failed
      await db.subscriber.delete({
        where: { authorId_email: { authorId, email: normalizedEmail } },
      });

      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
