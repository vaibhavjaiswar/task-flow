import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getTokenPayloadByVerifying } from "@/utils/jwt";
import { ServerError } from "@/utils/server-error";
import { InputMemberType } from "@/types";
import { ServerResponseType, ProjectResponseType } from "@/types/api-response";

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
    console.log("Add new members:", newMembers);

    const usersToBeAdded = await prisma.user.findMany({
      where: { email: { in: newMembers.map((member) => member.email) } },
      select: { id: true, email: true, name: true },
    });
    console.log(usersToBeAdded);

    const response = await prisma.projectMember.createMany({
      data: usersToBeAdded.map((user) => ({
        projectId,
        userId: user.id,
        role: "MEMBER",
      })),
    });

    console.log("Members added count:", response.count);

    // const project = {};

    // const normalizedProject = {
    //   ...project,
    //   owner: project.user,
    //   user: undefined,
    // };

    // const responseData: ProjectResponseType = {
    //   project: normalizedProject,
    // };

    return NextResponse.json(
      {
        ok: true,
        message: "N members added to project successfully.",
        // data: responseData,
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
