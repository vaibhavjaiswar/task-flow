import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { LoginResponseType, ServerResponseType } from "@/types/api-response";
import { createNewToken } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { LoginFormInputs } from "@/types";

export async function POST(
  req: Request
): Promise<NextResponse<ServerResponseType<LoginResponseType>>> {
  try {
    const { email, password } = (await req.json()) as LoginFormInputs;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { ok: false, message: `User with email ${email} is not registered.` },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = createNewToken({ email: user.email, userId: user.id });

    if (!token) {
      throw new ServerError("Error occured while creating new token.", 500);
    }

    const responseData: LoginResponseType = {
      user: {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };

    const cookieStore = await cookies();
    cookieStore.set("token", token);

    return NextResponse.json(
      {
        ok: true,
        message: "User authenticated successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "Error occured while logging in.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
