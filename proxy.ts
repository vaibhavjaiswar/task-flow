import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isAuthTokenValid } from "./utils/jwt";
import { ServerError } from "./utils/server-error";

export async function proxy(request: NextRequest) {
  console.log(
    `Next.js Middleware/Proxy executed for: ${request.nextUrl.pathname}`
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "No token found." },
      { status: 401 }
    );
  }

  try {
    isAuthTokenValid(token);
  } catch (error) {
    console.error("Middleware/Proxy error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "Error occured in middleware/proxy.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 400;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}

export const config = {
  matcher: ["/api/logout", "/api/user"],
};
