import { Project, ProjectRole, Task, User } from "@/prisma/generated/client";

export interface SuccessResponse<T = unknown> {
  ok: true;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  ok: false;
  message: string;
  error?: {
    code?: string | number;
    detail?: string;
  };
}

export type ServerResponseType<T = unknown> =
  | SuccessResponse<T>
  | ErrorResponse;

export interface RegisterResponseType {
  user: { email: string; name: string | null; createdAt: Date };
}

export interface LoginResponseType {
  user: { email: string; name: string | null; createdAt: Date };
}

export interface UserResponseType {
  user: Pick<User, "createdAt" | "email" | "name">;
}

export type DashboardProjectType = Project & {
  owner: Pick<User, "email" | "name">;
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
};

export interface UserProjectsResponseType {
  projects: DashboardProjectType[];
}

export type ProjectWithDetails = Project & {
  owner: Pick<User, "createdAt" | "email" | "name">;
  tasks: Task[];
  members: {
    user: {
      name: string;
      email: string;
    };
    role: ProjectRole;
  }[];
};

export interface ProjectResponseType {
  project: ProjectWithDetails;
}

export type TaskType = Task & {
  project: Pick<Project, "id" | "name">;
  creator: Pick<User, "email" | "name">;
};

export interface TaskResponseType {
  task: TaskType;
}
