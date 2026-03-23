import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/sendEmail";
import { type NextRequest, NextResponse } from "next/server";
import { createUserSchema } from "@/validators/user.validator";
import { handleZodError, isZodError } from "@/lib/handleError.zod";
import type { TApiResponse } from "@/types";
import type { TUserDocument } from "@/types/user.types";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<TApiResponse<TUserDocument>>> => {
  try {
    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    // Connect to Database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend verification email for unverified users
        await sendVerificationEmail(existingUser);

        return NextResponse.json(
          {
            success: false,
            message:
              "Account exists but not verified. A new verification email has been sent.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists. Please login instead.",
        },
        { status: 409 },
      );
    }

    const newUser = new User(validatedData);

    await newUser.save();
    sendVerificationEmail(newUser);

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! Please check your email to verify your account.",
      },
      {
        status: 201,
      },
    );
  } catch (err: unknown) {
    console.log(err);

    const mongoError = err as {
      code?: number;
      keyValue?: Record<string, unknown>;
    };

    let status = 500;
    let message = (err as Error).message || "An unexpected error occurred";

    if (isZodError(err)) {
      status = 422;
      message = handleZodError(err);
    }

    if (mongoError.code === 11000 && mongoError.keyValue) {
      const fields = Object.keys(mongoError.keyValue);

      status = 409;
      message = fields
        .map(
          (field) =>
            `${field.charAt(0).toUpperCase() + field.slice(1)} is already exist!`,
        )
        .join(", ");
    }

    return NextResponse.json(
      {
        success: false,
        message: message,
      },
      {
        status,
      },
    );
  }
};
