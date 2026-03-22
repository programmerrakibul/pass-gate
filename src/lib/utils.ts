import { ZodError } from "zod";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { TUserDocument } from "@/types/user.type";
import jwt, { type SignOptions } from "jsonwebtoken";
import { envConfig } from "./envConfig";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isZodError = (error: unknown): error is ZodError<unknown> => {
  return error instanceof ZodError;
};

export const generateToken = async (
  user: Pick<TUserDocument, "email" | "_id">,
  secret: string,
  expiresIn: SignOptions["expiresIn"] = "15m",
) => {
  try {
    if (!user._id || !user.email) {
      throw new Error("User must have _id and email to generate token!");
    }

    if (secret?.trim() === "") {
      throw new Error("Token secret is required!");
    }

    const token = jwt.sign(user, secret, { expiresIn });
    return token;
  } catch (error: unknown) {
    throw new Error(`Token generation failed: ${(error as Error).message}`);
  }
};

export const generateAccessToken = async (
  user: Pick<TUserDocument, "email" | "_id">,
  expiresIn: SignOptions["expiresIn"] = "15m",
) => {
  const secret = envConfig.ACCESS_TOKEN_SECRET as string;

  return generateToken(user, secret, expiresIn);
};

export const generateRefreshToken = async (
  user: Pick<TUserDocument, "email" | "_id">,
  expiresIn: SignOptions["expiresIn"] = "7d",
) => {
  const secret = envConfig.REFRESH_TOKEN_SECRET as string;

  return generateToken(user, secret, expiresIn);
};
