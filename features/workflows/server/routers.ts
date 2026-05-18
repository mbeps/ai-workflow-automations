import { NodeType } from "@prisma/client";
import type { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/db";
import {
  workflowGetManySchema,
  workflowIdSchema,
  workflowUpdateNameSchema,
  workflowUpdateSchema,
} from "@/schemas/workflows/workflow-router-schemas";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

/**
 * tRPC workflow router with CRUD and execution procedures.
 * All procedures are user-scoped; users can only access/modify their own workflows.
 * Procedures:
 * - execute: trigger workflow run via Inngest
 * - create: create new workflow (premium only)
 * - remove: delete workflow and cascade delete nodes/connections
 * - update: persist React Flow nodes and edges in transaction
 * - updateName: rename workflow
 * - getOne: fetch single workflow with nodes and edges for editor
 * - getMany: list workflows with pagination and search
 *
 * @author Maruf Bepary
 */
export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(workflowIdSchema)
    .mutation(async ({ input, ctx }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      await sendWorkflowExecution({
        workflowId: input.id,
      });

      return workflow;
    }),
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),
  remove: protectedProcedure
    .input(workflowIdSchema)
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(workflowUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      // Transaction to ensure consistency
      return await prisma.$transaction(async (tx) => {
        // Delete existing nodes and connections (cascade deletes connections)
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // Create nodes
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        // Create connections
        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        // Update workflow's updateAt timestamp
        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),
  updateName: protectedProcedure
    .input(workflowUpdateNameSchema)
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
    }),
  getOne: protectedProcedure
    .input(workflowIdSchema)
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
        include: { nodes: true, connections: true },
      });

      // Transform server nodes to react-flow compatible nodes
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      // Transform server connections to react-flow compatible edges
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),
  getMany: protectedProcedure
    .input(workflowGetManySchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
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
