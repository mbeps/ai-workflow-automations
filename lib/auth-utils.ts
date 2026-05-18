import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "../routes";
import { auth } from "./auth";

/**
 * Ensures the user is authenticated in Server Components.
 * Redirects to the login page if no active session is found.
 * 
 * @author Maruf Bepary
 * @returns The active session object.
 */
export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTES.AUTH.LOGIN.path);
  }

  return session;
};

/**
 * Ensures the user is NOT authenticated in Server Components.
 * Redirects to the home page if an active session is found.
 * 
 * @author Maruf Bepary
 */
export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(ROUTES.HOME.path);
  }
};
