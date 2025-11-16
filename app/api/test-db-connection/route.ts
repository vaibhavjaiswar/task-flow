import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServerResponseType } from "@/types/api-response";
import { ServerError } from "@/utils/server-error";

export async function GET(): Promise<NextResponse<ServerResponseType>> {
  try {
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      ok: true,
      message: "Database connection successful ✅",
      data: { usersCount },
    });
  } catch (error) {
    console.error("Database connection error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "Database connection failed ❌";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
