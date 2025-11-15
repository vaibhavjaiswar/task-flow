import { LoginFormInputs, RegisterFormInputs } from "@/types";
import {
  LoginResponseType,
  RegisterResponseType,
  ServerResponseType,
} from "@/types/api-response";

export async function register(formData: RegisterFormInputs) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data: ServerResponseType<RegisterResponseType> = await response.json();

  return data;
}

export async function login(formData: LoginFormInputs) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data: ServerResponseType<LoginResponseType> = await response.json();

  return data;
}

export async function logout() {
  const response = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  const data: ServerResponseType = await response.json();

  return data;
}
