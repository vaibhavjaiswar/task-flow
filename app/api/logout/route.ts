import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ServerResponseType } from "@/types/api-response";
import { ServerError } from "@/utils/server-error";

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

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "Error occured while logging out.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
