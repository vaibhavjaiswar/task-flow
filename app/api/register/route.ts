import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import environment from "@/config/env";
import { RegisterResponseType, ServerResponseType } from "@/types/api-response";
import { ServerError } from "@/utils/server-error";

const PASSWORD_SALT = environment.PASSWORD_SALT;

export async function POST(
  req: Request
): Promise<NextResponse<ServerResponseType<RegisterResponseType>>> {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "User with this email already registered." },
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

    const responseData: RegisterResponseType = {
      user: newUser,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "User registered successfully.",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "Error occured while registering user.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
