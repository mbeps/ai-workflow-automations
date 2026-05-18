import { z } from "zod";
import { PAGINATION } from "@/config/constants";

/**
 * Schemas for workflow execution tRPC procedures.
 * Handles validation for fetching execution history and individual execution details.
 * @author Maruf Bepary
 */

export const executionIdSchema = z.object({ id: z.string() });

export const executionGetManySchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
});

export type ExecutionIdValues = z.infer<typeof executionIdSchema>;
export type ExecutionGetManyValues = z.infer<typeof executionGetManySchema>;
