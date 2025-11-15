import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ServerResponseType } from "@/types/api-response";

export async function POST(): Promise<NextResponse<ServerResponseType<null>>> {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "User logged out successfully.",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Internal server error during logout.",
      },
      { status: 500 }
    );
  }
}
