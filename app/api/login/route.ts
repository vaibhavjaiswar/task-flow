import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import environment from "@/config/env";

const PASSWORD_SALT = environment.PASSWORD_SALT;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: `User with email ${email} is not registered.` },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const responseData = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        message: "User authenticated successfully.",
        data: { user: responseData },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User login error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
