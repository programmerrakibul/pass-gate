import { TJwtPayload } from "@/types/jwt.types";
import { SignOptions } from "jsonwebtoken";
import { envConfig } from "../envConfig";
import jwt from "jsonwebtoken";

export const generateToken = async (
  user: TJwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"] = "15m",
) => {
  try {
    // Validate inputs
    if (!user._id || !user.email) {
      throw new Error("User must have _id and email to generate token!");
    }

    // Validate secret
    if (secret?.trim() === "") {
      throw new Error("Token secret is required!");
    }

    const token = jwt.sign(user, secret, { expiresIn });

    return token;
  } catch (error: unknown) {
    throw new Error(`Token generation failed: ${(error as Error).message}`);
  }
};

// Generate access token
export const generateAccessToken = async (
  user: TJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "15m",
) => {
  const secret = envConfig.ACCESS_TOKEN_SECRET as string;

  return generateToken(user, secret, expiresIn);
};

// Generate refresh token (longer expiration)
export const generateRefreshToken = async (
  user: TJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d",
) => {
  const secret = envConfig.REFRESH_TOKEN_SECRET as string;

  return generateToken(user, secret, expiresIn);
};

// Generate email verification token
export const generateEmailVerificationToken = async (
  user: TJwtPayload,
  expiresIn: SignOptions["expiresIn"] = "24h",
) => {
  const secret = envConfig.VERIFICATION_TOKEN_SECRET as string;

  return generateToken(user, secret, expiresIn);
};
