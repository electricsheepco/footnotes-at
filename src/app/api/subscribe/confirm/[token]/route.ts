import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    // Find subscriber by confirm token
    const subscriber = await db.subscriber.findUnique({
      where: { confirmToken: token },
      include: {
        author: {
          select: { handle: true },
        },
      },
    });

    if (!subscriber) {
      // Invalid or expired token
      return NextResponse.redirect(
        new URL("/subscribed?error=invalid", request.url)
      );
    }

    if (subscriber.confirmedAt) {
      // Already confirmed
      return NextResponse.redirect(
        new URL(
          `/subscribed?author=${subscriber.author.handle}&already=true`,
          request.url
        )
      );
    }

    // Confirm the subscription
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: { confirmedAt: new Date() },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/subscribed?author=${subscriber.author.handle}`, request.url)
    );
  } catch (error) {
    console.error("Confirm subscription error:", error);
    return NextResponse.redirect(
      new URL("/subscribed?error=unknown", request.url)
    );
  }
}
