import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { createUserSchema } from "@/validators/user.validator";
import { isZodError } from "@/lib/utils";

import type { TApiResponse } from "@/types";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<TApiResponse<InstanceType<typeof User>>>> => {
  try {
    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    await dbConnect();

    const newUser = new User(validatedData);

    console.log((await newUser.save()).toObject());

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully!",
        data: newUser,
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
      const issues = Object.values(err.issues);

      status = 422;
      message = issues.map((val) => val.message).join(", ");
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
