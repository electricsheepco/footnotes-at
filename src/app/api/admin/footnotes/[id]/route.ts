import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { footnoteSchema } from "@/lib/validations";
import { updateFootnoteTags } from "@/lib/tags";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/footnotes/[id] - Update a footnote
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check footnote exists and belongs to user
    const existing = await db.footnote.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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

    // Update the footnote
    await db.footnote.update({
      where: { id },
      data: {
        title: title || null,
        body: content,
      },
    });

    // Update tags
    await updateFootnoteTags(id, tags || []);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update footnote error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/footnotes/[id] - Delete a footnote
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check footnote exists and belongs to user
    const existing = await db.footnote.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete (cascades to FootnoteTag)
    await db.footnote.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete footnote error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
