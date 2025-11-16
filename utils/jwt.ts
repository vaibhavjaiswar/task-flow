import jwt from "jsonwebtoken";
import environment from "@/config/env";

export function createNewToken(tokenPayload: string): string | null {
  try {
    const token = jwt.sign({ tokenPayload }, environment.JWT_SECRET, {
      expiresIn: environment.JWT_EXPIRATION_IN_SECONDS,
    });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function isAuthTokenValid(token: string): boolean {
  try {
    jwt.verify(token, environment.JWT_SECRET);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
