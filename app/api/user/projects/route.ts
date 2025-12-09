import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import {
  ServerResponseType,
  UserProjectsResponseType,
} from "@/types/api-response";

export async function GET(): Promise<
  // req: Request
  NextResponse<ServerResponseType<UserProjectsResponseType>>
> {
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

    const user = await prisma.user.findUnique({ where: { email, id: userId } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [{ creatorId: userId }, { members: { some: { userId: userId } } }],
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        tasks: {
          select: {
            id: true,
            priority: true,
            status: true,
          },
        },
      },
    });

    const responseData: UserProjectsResponseType = {
      projects: projects.map((project) => {
        const { done, inProgress, todo } = project.tasks.reduce(
          (acc, task) => {
            if (task.status === "DONE") acc.done++;
            else if (task.status === "IN_PROGRESS") acc.inProgress++;
            else if (task.status === "TODO") acc.todo++;
            return acc;
          },
          { done: 0, inProgress: 0, todo: 0 }
        );
        return {
          ...project,
          owner: { email: project.user.email, name: project.user.name },
          user: undefined,
          tasks: {
            done,
            inProgress,
            todo,
            total: project.tasks.length,
          },
        };
      }),
    };

    return NextResponse.json(
      {
        ok: true,
        message: "User projects fetched successfully.",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch projects error:", error);

    const errorMessage =
      error instanceof ServerError
        ? error.message
        : "An error occurred while fetching user projects.";
    const errorStatusCode =
      error instanceof ServerError ? error.statusCode : 500;

    return NextResponse.json(
      { ok: false, message: errorMessage },
      { status: errorStatusCode }
    );
  }
}
