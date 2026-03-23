import { handleZodError, isZodError } from "@/lib/handleError.zod";
import { generateAccessToken } from "@/lib/jwt/generateToken.jwt";
import User from "@/models/user.model";
import type { TApiResponse } from "@/types";
import type { TUserDocument } from "@/types/user.types";
import { loginSchema } from "@/validators/user.validator";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<TApiResponse<Omit<TUserDocument, "password">>>> => {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in",
        },
        {
          status: 401,
        },
      );
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials!",
        },
        {
          status: 401,
        },
      );
    }

    user.lastLoggedIn = new Date();

    const data = (await user.save()).toObject();
    const accessToken = await generateAccessToken(data);

    delete data.password;

    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      ACCESS_TOKEN: accessToken,
      data: data as Omit<TUserDocument, "password">,
    });
  } catch (error) {
    console.log(error);

    let message = (error as Error).message || "Login Failed!";
    let status = 500;

    if (isZodError(error)) {
      status = 422;
      message = handleZodError(error);
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      },
    );
  }
};
