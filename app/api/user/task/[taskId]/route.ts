import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { TaskResponseType, ServerResponseType } from "@/types/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
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

    const { userId } = payload;
    const { taskId } = await params;

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: {
        user: {
          select: {
            createdAt: true,
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

    const responseData: TaskResponseType = { task };

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
  { params }: { params: Promise<{ taskId: string }> }
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

    const { userId } = payload;
    const { taskId } = await params;

    const body = await request.json();
    const { name, description } = body;

    if (!name && !description) {
      return NextResponse.json(
        { ok: false, message: "Nothing to update." },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        name: name?.trim() ?? existingTask.name,
        description: description ?? existingTask.description,
      },
    });

    const responseData: TaskResponseType = {
      task: updatedTask,
    };

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
