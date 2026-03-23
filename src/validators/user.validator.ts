import z from "zod";

export const createUserSchema = z.object(
  {
    name: z
      .string("Invalid Name type!")
      .min(3, "Name must be at least 3 characters long!")
      .max(20, "Name must be at most 20 characters long!")
      .optional(),
    email: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Email field is required!"
            : "Invalid Email format!",
      })
      .email("Please provide a valid email address!")
      .lowercase(),
    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Password field is required!"
            : "Invalid Password type!",
      })
      .min(8, "Password must be 8 characters long!")
      .max(32, "Password must be at most 32 characters long!")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
      ),
    photoURL: z.url("Invalid Photo URL format!").optional(),
  },
  "User data is required in the request body!",
);

export const loginSchema = z.object({
  email: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Email field is required!"
          : "Invalid Email format!",
    })
    .email("Please provide a valid email address!")
    .transform((val) => val.toLowerCase()),
  password: z.string({
    error: (iss) =>
      iss.input === undefined
        ? "Password field is required!"
        : "Invalid Password type!",
  }),
});

export type TCreateUser = z.infer<typeof createUserSchema>;
export type TLoginUser = z.infer<typeof loginSchema>;
