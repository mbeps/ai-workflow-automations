import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { ROUTES } from "../routes";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTES.AUTH.LOGIN.path);
  }

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(ROUTES.HOME.path);
  }
};
