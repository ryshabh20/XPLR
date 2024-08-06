import { z } from "zod";

export const SignUpSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Please enter a valid input name" })
    .max(18, { message: "Full name can't be bigger than 18 characters" }),
  username: z
    .string()
    .min(3, {
      message: "Please enter a valid name",
    })
    .max(18, { message: "Username can't be bigger than 18 characters" })
    .regex(/^(?!.*[._]{2})[a-zA-Z0-9][a-zA-Z0-9._]{0,28}[a-zA-Z0-9]$/, {
      message: "Invalid Username",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z.string().min(1, { message: "Password is required" }).max(20, {
    message: "Password should be smaller than 20 characters",
  }),
});

export const OtpSchema = z.object({
  otp: z.string().min(6, { message: "Otp must contain 6 characters" }).max(6),
});
