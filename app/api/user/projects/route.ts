import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import {
  ServerResponseType,
  UserProjectsResponseType,
} from "@/types/api-response";

export async function GET(
  // req: Request
): Promise<NextResponse<ServerResponseType<UserProjectsResponseType>>> {
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

    const { userId } = payload;

    const projects = await prisma.project.findMany({ where: { userId } });

    const responseData: UserProjectsResponseType = {
      projects,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "User projects fetched successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch projects error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while fetching user projects.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
