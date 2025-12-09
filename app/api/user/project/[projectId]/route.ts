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
      // where: { id: projectId, creatorId: userId },
      where: {
        AND: [
          { id: projectId },
          {
            OR: [
              { creatorId: userId },
              { members: { some: { userId: userId } } },
            ],
          },
        ],
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
        members: {
          select: {
            user: { select: { email: true, name: true } },
            role: true,
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

    const normalizedProject = {
      ...project,
      owner: project.user,
      user: undefined,
    };

    const responseData: ProjectResponseType = {
      project: normalizedProject,
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
      where: { id: projectId, creatorId: userId },
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
        members: {
          select: {
            user: { select: { email: true, name: true } },
            role: true,
          },
        },
      },
    });

    const normalizedUpdatedProject = {
      ...updatedProject,
      owner: updatedProject.user,
      user: undefined,
    };

    const responseData: ProjectResponseType = {
      project: normalizedUpdatedProject,
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
      where: { id: projectId, creatorId: userId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: project.id },
    });

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
