import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    ...(process.env.NEXT_PUBLIC_ENABLE_POLAR === "true" ? [polarClient()] : []),
  ],
});
