import jwt from "jsonwebtoken";
import { envConfig } from "../envConfig";

import type { TJwtPayload } from "@/types/jwt.types";

export const verifyToken = async (token: string, secret: string) => {
  try {
    // Validate token
    if (token?.trim() === "") {
      throw new Error("Token is required!");
    }

    // Validate secret
    if (secret?.trim() === "") {
      throw new Error("Token secret is required!");
    }

    const result = jwt.verify(token, secret) as TJwtPayload & jwt.JwtPayload;

    return result;
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};

export const verifyVerificationToken = async (token: string) => {
  const secret = envConfig.VERIFICATION_TOKEN_SECRET as string;
  return verifyToken(token, secret);
};
