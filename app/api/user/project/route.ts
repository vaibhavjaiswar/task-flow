import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { ServerResponseType } from "@/types/api-response";
import { NewProjectFormInputs } from "@/types";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponseType>> {
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

    const { userId, email } = payload;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const json = (await request.json()) as NewProjectFormInputs;

    const { name, description } = json;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, message: "Project name is required." },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: { name, description, userId },
    });

    const responseData = {
      project: newProject,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "Project created successfully.",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project creation error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while creating the project.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
