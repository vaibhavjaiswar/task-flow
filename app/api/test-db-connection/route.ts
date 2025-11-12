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
  } catch (error: any) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Database connection failed ❌",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
