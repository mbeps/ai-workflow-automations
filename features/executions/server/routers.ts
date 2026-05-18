/**
 * tRPC router for workflow execution management.
 * Provides protected procedures for retrieving execution history and details.
 * All queries scoped to authenticated user's workflows.
 *
 * @author Maruf Bepary
 */

import z from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import {
  executionGetManySchema,
  executionIdSchema,
} from "@/schemas/executions/execution-router-schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const executionsRouter = createTRPCRouter({
  /**
   * Retrieves a single execution by ID with workflow metadata.
   * Protected: requires valid session and ownership of workflow.
   *
   * @input executionIdSchema - Execution ID
   * @returns Execution record with workflow name and ID
   */
  getOne: protectedProcedure
    .input(executionIdSchema)
    .query(({ ctx, input }) => {
      return prisma.execution.findUniqueOrThrow({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  /**
   * Retrieves paginated execution list ordered by most recent first.
   * Protected: scoped to authenticated user's workflows.
   * Includes pagination metadata for UI implementation.
   *
   * @input executionGetManySchema - Page and pageSize parameters
   * @returns Paginated execution list with workflow metadata
   */
  getMany: protectedProcedure
    .input(executionGetManySchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
