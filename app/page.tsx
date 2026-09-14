import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { auth } from "@/lib/auth";

/**
 * Root page component.
 * Redirects authenticated users to the workflows dashboard and unauthenticated users to login.
 *
 * @author Maruf Bepary
 */
export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect(ROUTES.WORKFLOWS.INDEX.path);
  }

  redirect(ROUTES.AUTH.LOGIN.path);
}
