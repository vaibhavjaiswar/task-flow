import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ProjectResponseType, ServerResponseType } from "@/types/api-response";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import prisma from "@/lib/prisma";
import { ServerError } from "@/utils/server-error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<NextResponse<ServerResponseType<ProjectResponseType>>> {
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
    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const responseData = { project };

    return NextResponse.json(
      {
        ok: true,
        message: "Project fetched successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch project error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while fetching the project.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
