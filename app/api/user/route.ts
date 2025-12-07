import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { ServerResponseType, UserResponseType } from "@/types/api-response";
import { ServerError } from "@/utils/server-error";
import { getTokenPayloadByVerifying } from "@/utils/jwt";

export async function GET(): Promise<
  // req: Request
  NextResponse<ServerResponseType<UserResponseType>>
> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Authentication token missing." },
        { status: 401 }
      );
    }

    const payload = getTokenPayloadByVerifying(token);

    if (!payload) {
      return NextResponse.json(
        { ok: false, message: "Authentication token invalid." },
        { status: 401 }
      );
    }

    const { email, userId: id } = payload;

    const user = await prisma.user.findUnique({ where: { email, id } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const responseData: UserResponseType = {
      user: {
        // id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };

    return NextResponse.json(
      {
        ok: true,
        message: "User retrieved successfully.",
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
