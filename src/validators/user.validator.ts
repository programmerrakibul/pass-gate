import z from "zod";

export const userBaseSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Name field is required!"
          : "Invalid Name type!",
    })
    .min(3, "Name must be at least 3 characters long!")
    .max(20, "Name must be at most 20 characters long!"),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? "Email field is required!"
        : "Invalid Email format!",
  }),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Password field is required!"
          : "Invalid Password type!",
    })
    .min(8, "Password must be 8 characters long!")
    .max(32, "Password must be at most 32 characters long!"),
});

export type TUserBase = z.infer<typeof userBaseSchema>;
