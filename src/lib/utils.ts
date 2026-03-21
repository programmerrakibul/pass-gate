import { ZodError } from "zod";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isZodError = (error: unknown): error is ZodError<unknown> => {
  return error instanceof ZodError;
};
