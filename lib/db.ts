import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/**
 * Singleton Prisma client instance.
 * Prevents multiple instances from being created during hot-reloads in development.
 * Always import this instead of `new PrismaClient()` to manage connection pooling efficiently.
 *
 * @author Maruf Bepary
 */
const prisma = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
