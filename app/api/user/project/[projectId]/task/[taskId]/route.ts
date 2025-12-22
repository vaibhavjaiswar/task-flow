import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { TaskResponseType, ServerResponseType } from "@/types/api-response";

interface ParamsType {
  params: Promise<{ projectId: string; taskId: string }>;
}

export async function GET(
  request: Request,
  { params }: ParamsType
): Promise<NextResponse<ServerResponseType<TaskResponseType>>> {
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
    const { projectId, taskId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const projectMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { projectId, userId } },
    });

    if (!projectMember) {
      return NextResponse.json(
        {
          ok: false,
          message: "You do not have permission to access this task.",
        },
        { status: 403 }
      );
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, projectId: projectId },
      include: {
        project: {
          select: { id: true, name: true },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { ok: false, message: "Task not found." },
        { status: 404 }
      );
    }

    const formattedTask = { ...task, creator: task.user, user: undefined };

    const responseData: TaskResponseType = {
      task: formattedTask,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "Task fetched successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch task error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while fetching the task.";
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
  { params }: ParamsType
): Promise<NextResponse<ServerResponseType<TaskResponseType>>> {
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
    const { projectId, taskId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const projectMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { projectId, userId } },
    });

    if (!projectMember) {
      return NextResponse.json(
        {
          ok: false,
          message: "You do not have permission to access this task.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, status, priority, assignedToEmail } = body;

    if (
      !name &&
      description === undefined &&
      !status &&
      !priority &&
      !assignedToEmail
    ) {
      return NextResponse.json(
        { ok: false, message: "Nothing to update." },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, projectId: projectId },
    });

    if (!existingTask) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    if (projectMember.role !== "ADMIN" && existingTask.creatorId !== user.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "You do not have permission to edit this task.",
        },
        { status: 403 }
      );
    }

    const assignedToUser = await prisma.user.findUnique({
      where: { email: assignedToEmail },
    });

    if (!assignedToUser) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        name: name?.trim() ?? existingTask.name,
        description: description ?? existingTask.description,
        status: status ?? existingTask.status,
        priority: priority ?? existingTask.priority,
        assignedToId: assignedToUser.id ?? existingTask.assignedToId,
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const formattedTask = {
      ...updatedTask,
      creator: updatedTask.user,
      user: undefined,
    };

    const responseData: TaskResponseType = { task: formattedTask };

    return NextResponse.json(
      {
        ok: true,
        message: "Task updated successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update task error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while updating the task.";

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
  { params }: ParamsType
): Promise<NextResponse<ServerResponseType<null>>> {
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
    const { projectId, taskId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const projectMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { projectId, userId } },
    });

    if (!projectMember) {
      return NextResponse.json(
        {
          ok: false,
          message: "You do not have permission to access this task.",
        },
        { status: 403 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, projectId: projectId },
    });

    if (!existingTask) {
      return NextResponse.json(
        { ok: false, message: "Task not found." },
        { status: 404 }
      );
    }

    if (projectMember.role !== "ADMIN" && existingTask.creatorId !== user.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "You do not have permission to delete this task.",
        },
        { status: 403 }
      );
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Task deleted successfully.",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while deleting the task.";
    const errorStatus = error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatus }
    );
  }
}
