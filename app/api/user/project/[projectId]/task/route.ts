import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { NewTaskFormInputs } from "@/types";
import { TaskResponseType, ServerResponseType } from "@/types/api-response";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
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
    const { projectId } = await params;

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const json = (await request.json()) as NewTaskFormInputs;

    const { name, description, priority, status, dueDate } = json;
    const dueDateObject = dueDate ? new Date(dueDate) : null;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, message: "Task name is required." },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        name: name.trim(),
        description,
        priority,
        status,
        dueDate: dueDateObject,
        projectId,
        creatorId: userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const formattedTask = {
      ...newTask,
      creator: newTask.user,
    };

    const responseData: TaskResponseType = {
      task: formattedTask,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "Task created successfully.",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Task creation error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while creating the task.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
