import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    let message: string = "Internal Server Error!";
    let status: number = 500;

    if (error instanceof ZodError) {
      const issues = Object.values(error.issues);

      status = 400;
      message = issues.map((val) => val.message).join(", ");
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
