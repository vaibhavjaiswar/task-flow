import {
  LoginFormInputs,
  NewProjectFormInputs,
  RegisterFormInputs,
} from "@/types";
import {
  LoginResponseType,
  ProjectResponseType,
  RegisterResponseType,
  ServerResponseType,
  UserProjectsResponseType,
  UserResponseType,
} from "@/types/api-response";
import environment from "@/config/env";

const SERVER_URL = environment.NEXT_PUBLIC_BASE_URL;

export async function register(formData: RegisterFormInputs) {
  const response = await fetch(`${SERVER_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data: ServerResponseType<RegisterResponseType> = await response.json();

  return data;
}

export async function login(formData: LoginFormInputs) {
  const response = await fetch(`${SERVER_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data: ServerResponseType<LoginResponseType> = await response.json();

  return data;
}

export async function logout() {
  const response = await fetch(`${SERVER_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data: ServerResponseType = await response.json();

  return data;
}

export async function fetchUser() {
  const response = await fetch(`${SERVER_URL}/api/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: ServerResponseType<UserResponseType> = await response.json();

  return data;
}

export async function fetchUserProjects() {
  const response = await fetch(`${SERVER_URL}/api/user/projects`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: ServerResponseType<UserProjectsResponseType> =
    await response.json();

  return data;
}

export async function createNewProject(project: NewProjectFormInputs) {
  const response = await fetch(`${SERVER_URL}/api/user/project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  const data: ServerResponseType<UserProjectsResponseType> =
    await response.json();

  return data;
}

export async function fetchUserProject(projectId: string) {
  const response = await fetch(`${SERVER_URL}/api/user/project/${projectId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: ServerResponseType<ProjectResponseType> = await response.json();

  return data;
}

interface updateUserProjectArgsType {
  projectName?: string;
  projectDescription?: string;
}

export async function updateUserProject(
  projectId: string,
  { projectName, projectDescription }: updateUserProjectArgsType
) {
  const response = await fetch(`${SERVER_URL}/api/user/project/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: projectName,
      description: projectDescription,
    }),
  });

  const data: ServerResponseType<ProjectResponseType> = await response.json();

  return data;
}
