import User from "@/models/user.model";
import { envConfig } from "@/lib/envConfig";
import { type NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/jwt/verifyToken.jwt";

export const GET = async (req: NextRequest) => {
  const baseUrl = envConfig.CLIENT_URL;
  const url = new URL(`${baseUrl}/sign-in?callbackUrl=${baseUrl}`);

  try {
    const token = req.nextUrl.searchParams.get("token")?.trim();

    if (!token) {
      url.searchParams.set("error", "Invalid_Token");
      return NextResponse.redirect(url);
    }

    const { _id } = await verifyVerificationToken(token);
    const user = await User.findById(_id);

    if (!user) {
      url.searchParams.set("error", "User_Not_Found");
      return NextResponse.redirect(url);
    }

    if (user.isVerified) {
      url.searchParams.set("error", "Already_Verified");
      return NextResponse.redirect(url);
    }

    user.isVerified = true;
    await user.save();

    url.searchParams.set("success", "Verified_Successfully");

    return NextResponse.redirect(url);
  } catch (error: unknown) {
    url.searchParams.set("error", "Invalid_Token");

    if ((error as Error).name === "TokenExpiredError") {
      url.searchParams.set("error", "Token_Expired");
    }

    return NextResponse.redirect(url);
  }
};
