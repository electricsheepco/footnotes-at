import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { footnoteSchema } from "@/lib/validations";
import { updateFootnoteTags } from "@/lib/tags";

// POST /api/admin/footnotes - Create a new footnote
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = footnoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, body: content, tags } = parsed.data;

    // Create the footnote as a draft
    const footnote = await db.footnote.create({
      data: {
        authorId: session.user.id,
        title: title || null,
        body: content,
        status: "DRAFT",
      },
    });

    // Handle tags if provided
    if (tags && tags.length > 0) {
      await updateFootnoteTags(footnote.id, tags);
    }

    return NextResponse.json({ id: footnote.id });
  } catch (error) {
    console.error("Create footnote error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
