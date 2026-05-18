import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // path to your auth file

/**
 * Better Auth catch-all API route handler.
 * Manages authentication lifecycle events including sign-in, sign-up, session validation,
 * and OAuth callbacks for GitHub and Google providers.
 *
 * @author Maruf Bepary
 */
export const { POST, GET } = toNextJsHandler(auth);
