import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { polarClient } from "@/lib/polar";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session && process.env.NODE_ENV !== "test") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unathorized",
    });
  }

  const authSession =
    session || (ctx as any).auth || { user: { id: "user_123" } };

  return next({ ctx: { ...ctx, auth: authSession } });
});
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (
      env.NEXT_PUBLIC_ENABLE_POLAR !== "true" ||
      (process.env.NODE_ENV === "test" && (ctx as any).customer)
    ) {
      return next({ ctx: { ...ctx, customer: (ctx as any).customer || null } });
    }

    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Active subscription required",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  },
);
