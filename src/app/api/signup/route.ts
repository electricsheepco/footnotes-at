import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { email, handle, displayName, password } = parsed.data;

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if handle already exists
    const existingHandle = await db.user.findUnique({
      where: { handle: handle.toLowerCase() },
    });

    if (existingHandle) {
      return NextResponse.json(
        { error: "This handle is already taken" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        handle: handle.toLowerCase(),
        displayName,
        passwordHash,
      },
    });

    // Create session (this also sets the cookie)
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      handle: user.handle,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
