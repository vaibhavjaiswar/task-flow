import environment from "@/config/env";
import jwt from "jsonwebtoken";

export function generateJWT(useremail: string) {
  return jwt.sign({ useremail }, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRATION_IN_SECONDS,
  });
}
