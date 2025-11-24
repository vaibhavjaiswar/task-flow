import { User } from "@/prisma/generated/browser";
import { Project } from "@/prisma/generated/client";

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
  user: Pick<User, "createdAt" | "email" | "id" | "name">;
}

export interface UserProjectsResponseType {
  projects: Project[];
}

export interface ProjectResponseType {
  project: Project;
}
