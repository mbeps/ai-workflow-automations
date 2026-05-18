import { z } from "zod";

/**
 * Schema for user login validation.
 * Used for login form validation on the client and server.
 * @author Maruf Bepary
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
