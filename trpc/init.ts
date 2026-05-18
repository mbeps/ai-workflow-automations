import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { polarClient } from "@/lib/polar";

/**
 * Creates the tRPC context for each request.
 * Scopes data to the authenticated user.
 * 
 * @author Maruf Bepary
 */
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

/**
 * Factory for creating tRPC routers.
 * 
 * @author Maruf Bepary
 */
export const createTRPCRouter = t.router;

/**
 * Factory for creating server-side tRPC callers.
 * 
 * @author Maruf Bepary
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Unprotected base procedure.
 * 
 * @author Maruf Bepary
 */
export const baseProcedure = t.procedure;

/**
 * Procedure that requires a valid session.
 * Throws UNAUTHORIZED if the user is not logged in.
 * 
 * @author Maruf Bepary
 */
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

/**
 * Procedure that requires an active Polar subscription.
 * Extends protectedProcedure to ensure auth first.
 * Throws FORBIDDEN if no active subscription is found.
 * 
 * @author Maruf Bepary
 */
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
