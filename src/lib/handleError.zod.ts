import { ZodError } from "zod";

export const isZodError = (error: unknown): error is ZodError<unknown> => {
  return error instanceof ZodError;
};

export const handleZodError = (err: ZodError<unknown>) => {
  const issues = Object.values(err.issues);
  const message = issues.map((val) => val.message).join(", ");

  return message;
};
