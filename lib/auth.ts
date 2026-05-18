import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { polarClient } from "./polar";

/**
 * Better Auth configuration instance.
 * Core authentication engine for Nodebase, handling email/password,
 * social providers (GitHub, Google), and Polar subscription integration.
 * Sessions are persisted in PostgreSQL via Prisma.
 *
 * @author Maruf Bepary
 * @see {@link https://www.better-auth.com/docs|Better Auth Docs}
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    ...(env.NEXT_PUBLIC_ENABLE_POLAR === "true"
      ? [
          polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
              checkout({
                products: [
                  {
                    productId: env.POLAR_PRODUCT_ID as string,
                    slug: env.NEXT_PUBLIC_POLAR_PRODUCT_SLUG as string,
                  },
                ],
                successUrl: env.POLAR_SUCCESS_URL,
                authenticatedUsersOnly: true,
              }),
              portal(),
            ],
          }),
        ]
      : []),
  ],
});
