import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import environment from "@/config/env";
import { ServerResponseType } from "@/types";
import { RegisterResponseType } from "@/types/api-response";

const PASSWORD_SALT = environment.PASSWORD_SALT;

export async function POST(
  req: Request
): Promise<NextResponse<ServerResponseType<RegisterResponseType>>> {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Namem email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "User registered successfully.",
        data: { user: newUser },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User registration error:", error);

    return NextResponse.json(
      { ok: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
