import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const dogEarSchema = z.object({
  footnoteId: z.string().min(1, "Footnote ID is required"),
  selectedText: z.string().optional(),
});

// Create or update a dog-ear
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = dogEarSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { footnoteId, selectedText } = parsed.data;

    // Verify footnote exists and is published
    const footnote = await db.footnote.findUnique({
      where: { id: footnoteId },
      select: { id: true, status: true },
    });

    if (!footnote || footnote.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Footnote not found" },
        { status: 404 }
      );
    }

    // Upsert the dog-ear (create or update selected text)
    const dogEar = await db.dogEar.upsert({
      where: {
        userId_footnoteId: {
          userId: session.user.id,
          footnoteId,
        },
      },
      update: {
        selectedText: selectedText || null,
      },
      create: {
        userId: session.user.id,
        footnoteId,
        selectedText: selectedText || null,
      },
    });

    return NextResponse.json({
      success: true,
      dogEar: {
        id: dogEar.id,
        selectedText: dogEar.selectedText,
      },
    });
  } catch (error) {
    console.error("Dog-ear error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Remove a dog-ear
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const footnoteId = searchParams.get("footnoteId");

    if (!footnoteId) {
      return NextResponse.json(
        { error: "Footnote ID is required" },
        { status: 400 }
      );
    }

    await db.dogEar.deleteMany({
      where: {
        userId: session.user.id,
        footnoteId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dog-ear delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Get dog-ear status for footnotes
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ dogEars: [] });
    }

    const { searchParams } = new URL(request.url);
    const footnoteIds = searchParams.get("footnoteIds");

    if (!footnoteIds) {
      return NextResponse.json({ dogEars: [] });
    }

    const ids = footnoteIds.split(",").filter(Boolean);

    const dogEars = await db.dogEar.findMany({
      where: {
        userId: session.user.id,
        footnoteId: { in: ids },
      },
      select: {
        footnoteId: true,
        selectedText: true,
      },
    });

    return NextResponse.json({ dogEars });
  } catch (error) {
    console.error("Dog-ear fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
