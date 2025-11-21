import jwt from "jsonwebtoken";
import environment from "@/config/env";

export interface TokenPayloadType {
  userId: number;
  email: string;
}

export function createNewToken(tokenPayload: TokenPayloadType): string | null {
  try {
    const token = jwt.sign(tokenPayload, environment.JWT_SECRET, {
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

export function getTokenPayloadByVerifying(
  token: string
): TokenPayloadType | null {
  try {
    const tokenPayload = jwt.verify(token, environment.JWT_SECRET);
    const { email, userId } = tokenPayload as TokenPayloadType;
    return { email, userId };
  } catch (error) {
    console.error(error);
    return null;
  }
}
