import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client configuration.
 * Provides the React client for managing authentication state,
 * sign-in/sign-out, and optional Polar subscription management.
 * 
 * @author Maruf Bepary
 */
export const authClient = createAuthClient({
  plugins: [
    ...(process.env.NEXT_PUBLIC_ENABLE_POLAR === "true" ? [polarClient()] : []),
  ],
});
