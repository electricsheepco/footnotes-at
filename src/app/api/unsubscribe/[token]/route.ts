import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    // Find subscriber by unsubscribe token
    const subscriber = await db.subscriber.findUnique({
      where: { unsubscribeToken: token },
      include: {
        author: {
          select: { handle: true },
        },
      },
    });

    if (!subscriber) {
      // Invalid token - might already be unsubscribed
      return NextResponse.redirect(
        new URL("/unsubscribed?error=invalid", request.url)
      );
    }

    const authorHandle = subscriber.author.handle;

    // Delete the subscriber
    await db.subscriber.delete({
      where: { id: subscriber.id },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/unsubscribed?author=${authorHandle}`, request.url)
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.redirect(
      new URL("/unsubscribed?error=unknown", request.url)
    );
  }
}
