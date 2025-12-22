import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { InputMemberType } from "@/types";
import {
  ProjectMembersResponseType,
  ServerResponseType,
} from "@/types/api-response";

export interface MemberResponseType {
  count: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<NextResponse<ServerResponseType<ProjectMembersResponseType>>> {
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

    const { userId, email: userEmail } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: userEmail, id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const projectMembers = await prisma.projectMember.findMany({
      where: { projectId: projectId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const formattedProjectMembers = projectMembers.map((projectMember) => ({
      user: projectMember.user,
      role: projectMember.role,
    }));

    const responseData: ProjectMembersResponseType = {
      members: formattedProjectMembers,
    };

    return NextResponse.json(
      {
        ok: true,
        message: "Project members fetched sucessfully.",
        data: responseData,
      },
      { status: 200 }
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<NextResponse<ServerResponseType<MemberResponseType>>> {
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

    const { userId, email: userEmail } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: userEmail, id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const { newMembers } = (await request.json()) as {
      newMembers: InputMemberType[];
    };

    const usersToBeAdded = await prisma.user.findMany({
      where: { email: { in: newMembers.map((member) => member.email) } },
      select: { id: true, email: true, name: true },
    });

    const { count } = await prisma.projectMember.createMany({
      data: usersToBeAdded.map((user) => ({
        projectId,
        userId: user.id,
        role: "MEMBER",
      })),
    });

    const responseData: MemberResponseType = { count };

    return NextResponse.json(
      {
        ok: true,
        message:
          count > 0
            ? `${count} member${
                count > 1 ? "s" : ""
              } added to project successfully.`
            : "0 members added from given user email(s).",
        data: responseData,
      },
      { status: 200 }
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<NextResponse<ServerResponseType<MemberResponseType>>> {
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

    const { userId, email: userEmail } = payload;
    const { projectId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: userEmail, id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const { membersToRemove } = (await request.json()) as {
      membersToRemove: InputMemberType[];
    };

    const usersToBeRemoved = (
      await prisma.user.findMany({
        where: { email: { in: membersToRemove.map((member) => member.email) } },
        select: { id: true, email: true, name: true },
      })
    ).filter((user) => user.id !== project.creatorId);

    const { count } = await prisma.projectMember.deleteMany({
      where: { userId: { in: usersToBeRemoved.map((user) => user.id) } },
    });

    const responseData: MemberResponseType = { count };

    return NextResponse.json(
      {
        ok: true,
        message: `${count} member${
          count > 1 ? "s" : ""
        } removed from project successfully.`,
        data: responseData,
      },
      { status: 200 }
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
