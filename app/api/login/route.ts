import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { LoginResponseType, ServerResponseType } from "@/types/api-response";
import { generateJWT } from "@/utils/jwt";

export async function POST(
  req: Request
): Promise<NextResponse<ServerResponseType<LoginResponseType>>> {
  try {
    const { email, password } = await req.json();

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

    const token = generateJWT(email);

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
    console.error("User login error:", error);

    return NextResponse.json(
      { ok: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
