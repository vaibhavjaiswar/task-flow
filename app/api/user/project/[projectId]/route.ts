import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { ProjectResponseType, ServerResponseType } from "@/types/api-response";

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

    const { userId, email } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        user: {
          select: {
            createdAt: true,
            email: true,
            name: true,
          },
        },
        tasks: {
          select: {
            createdAt: true,
            description: true,
            dueDate: true,
            id: true,
            name: true,
            priority: true,
            projectId: true,
            status: true,
            updatedAt: true,
            creatorId: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const responseData: ProjectResponseType = {
      project: {
        ...project,
        owner: project.user,
      },
    };

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

export async function PATCH(
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

    const { email, userId } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name && !description) {
      return NextResponse.json(
        { ok: false, message: "Nothing to update." },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existingProject) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name?.trim() ?? existingProject.name,
        description: description ?? existingProject.description,
      },
      include: {
        user: {
          select: {
            createdAt: true,
            email: true,
            name: true,
          },
        },
        tasks: {
          select: {
            createdAt: true,
            description: true,
            dueDate: true,
            id: true,
            name: true,
            priority: true,
            projectId: true,
            status: true,
            updatedAt: true,
            creatorId: true,
          },
        },
      },
    });

    const responseData: ProjectResponseType = {
      project: {
        ...updatedProject,
        owner: updatedProject.user,
      },
    };

    return NextResponse.json(
      {
        ok: true,
        message: "Project updated successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update project error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while updating the project.";

    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}

export async function DELETE(
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

    const { userId, email } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const response = await prisma.project.delete({
      where: { id: project.id },
    });

    console.log(response);

    return NextResponse.json(
      {
        ok: true,
        message: "Project deleted successfully.",
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
