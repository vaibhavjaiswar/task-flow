import { NextResponse } from "next/server";
import { sleep } from "@/utils";

export async function POST(req: Request) {
  await sleep();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Temporary response", data: { email, password } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
