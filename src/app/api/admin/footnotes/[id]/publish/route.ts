import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import { publishOptionsSchema } from "@/lib/validations";
import { sendFootnoteEmail } from "@/lib/email";
import { getExcerpt } from "@/lib/formatting";
import { FootnoteStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/footnotes/[id]/publish - Publish, unlist, or revert a footnote
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check footnote exists and belongs to user
    const footnote = await db.footnote.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        title: true,
        body: true,
        slug: true,
        status: true,
        publishedAt: true,
      },
    });

    if (!footnote || footnote.authorId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const { action } = body;

    // Validate action
    if (!["publish", "unlist", "draft"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use: publish, unlist, or draft" },
        { status: 400 }
      );
    }

    // Handle publish
    if (action === "publish") {
      const parsed = publishOptionsSchema.safeParse(body);
      const emailSubscribers = parsed.success
        ? parsed.data.emailSubscribers
        : false;

      // Generate slug if not already published
      let slug = footnote.slug;
      if (!slug) {
        slug = await generateSlug(session.user.id, footnote.title);
      }

      // Update footnote
      await db.footnote.update({
        where: { id },
        data: {
          status: FootnoteStatus.PUBLISHED,
          slug,
          publishedAt: footnote.publishedAt || new Date(),
        },
      });

      // Send email to confirmed subscribers if requested
      if (emailSubscribers) {
        const subscribers = await db.subscriber.findMany({
          where: {
            authorId: session.user.id,
            confirmedAt: { not: null },
          },
          select: {
            email: true,
            unsubscribeToken: true,
          },
        });

        const excerpt = getExcerpt(footnote.body, 300);

        // Send emails sequentially (simple approach for MVP)
        // Could be optimized with batch sending or background jobs later
        for (const subscriber of subscribers) {
          await sendFootnoteEmail(
            subscriber.email,
            session.user.displayName,
            session.user.handle,
            footnote.title,
            excerpt,
            slug,
            subscriber.unsubscribeToken
          );
        }

        console.log(
          `[EMAIL] Sent footnote to ${subscribers.length} subscriber(s)`
        );
      }

      return NextResponse.json({ success: true, slug });
    }

    // Handle unlist
    if (action === "unlist") {
      await db.footnote.update({
        where: { id },
        data: { status: FootnoteStatus.UNLISTED },
      });

      return NextResponse.json({ success: true });
    }

    // Handle revert to draft
    if (action === "draft") {
      await db.footnote.update({
        where: { id },
        data: { status: FootnoteStatus.DRAFT },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Publish footnote error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
