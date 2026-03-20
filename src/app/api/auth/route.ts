import { userBaseSchema } from "@/validators/user.validator";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = userBaseSchema.parse(body);
    console.log(validatedData);

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.log(error.issues[0].message);
    }

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
};
