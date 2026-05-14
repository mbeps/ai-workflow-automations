import { z } from "zod";
import { PAGINATION } from "@/config/constants";

export const workflowIdSchema = z.object({ id: z.string() });

export const workflowUpdateSchema = z.object({
  id: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().nullish(),
      position: z.object({ x: z.number(), y: z.number() }),
      data: z.record(z.string(), z.any()).optional(),
    }),
  ),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().nullish(),
      targetHandle: z.string().nullish(),
    }),
  ),
});

export const workflowUpdateNameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export const workflowGetManySchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export type WorkflowIdValues = z.infer<typeof workflowIdSchema>;
export type WorkflowUpdateValues = z.infer<typeof workflowUpdateSchema>;
export type WorkflowUpdateNameValues = z.infer<typeof workflowUpdateNameSchema>;
export type WorkflowGetManyValues = z.infer<typeof workflowGetManySchema>;
