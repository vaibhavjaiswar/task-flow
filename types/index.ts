import { TaskPriority, TaskStatus } from "@/prisma/generated/enums";

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export interface NewProjectFormInputs {
  name: string;
  description: string;
}

export interface NewTaskFormInputs {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface AuthTokenType {
  useremail: string;
  iat: number;
  exp: number;
}
