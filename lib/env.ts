import { z } from "zod";

/**
 * Zod validation schema for required environment variables.
 * Ensures the application fails at startup if critical config is missing or invalid.
 *
 * @author Maruf Bepary
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Sentry
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Polar
  NEXT_PUBLIC_ENABLE_POLAR: z.string().optional().default("true"),
  POLAR_ACCESS_TOKEN: z.string().optional(),
  POLAR_SUCCESS_URL: z.string().url().optional(),
  POLAR_PRODUCT_ID: z.string().optional(),
  NEXT_PUBLIC_POLAR_PRODUCT_SLUG: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NGROK_URL: z.string().optional(),
  ENCRYPTION_KEY: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Inngest
  INNGEST_EVENT_KEY: z.string().optional().default("local"),
  INNGEST_SIGNING_KEY: z.string().optional().default("local"),
  INNGEST_BASE_URL: z.string().url().optional(),

  // Next.js / Vercel / CI
  VERCEL_URL: z.string().optional(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
  CI: z.string().optional(),
});

/**
 * Validated environment variables parsed from process.env.
 * Import this instead of accessing process.env directly to ensure type safety
 * and runtime validation. Guaranteed to contain all required variables on server startup.
 *
 * @example
 * import { env } from "@/lib/env";
 * const dbUrl = env.DATABASE_URL;
 */
export const env =
  typeof window === "undefined"
    ? envSchema.parse(process.env)
    : (process.env as unknown as z.infer<typeof envSchema>);
