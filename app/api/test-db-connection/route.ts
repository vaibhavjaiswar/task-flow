import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      ok: true,
      message: "Database connection successful ✅",
      usersCount,
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
