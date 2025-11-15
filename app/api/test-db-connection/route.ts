import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ServerResponseType } from "@/types/api-response";

export async function GET(): Promise<NextResponse<ServerResponseType>> {
  try {
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      ok: true,
      message: "Database connection successful ✅",
      data: { usersCount },
    });
  } catch (error) {
    console.error("Database test failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed ❌";

    return NextResponse.json(
      {
        ok: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
