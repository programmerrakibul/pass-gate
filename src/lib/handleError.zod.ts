import { ZodError } from "zod";

export const isZodError = (error: unknown): error is ZodError<unknown> => {
  return error instanceof ZodError;
};
