import { z } from "zod";

/**
 * Schema for user registration validation.
 * Validates email, password, and confirmation for sign-up forms.
 * @author Maruf Bepary
 */
export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
