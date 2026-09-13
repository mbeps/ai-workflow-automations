import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import { prismaMock } from '@/__tests__/__mocks__/prisma';
import { appRouter } from '@/trpc/routers/_app';
import { PAGINATION } from '@/config/constants';

describe('executionsRouter', () => {
  const ctx = {
    auth: {
      user: { id: 'user_123' },
    },
  };

  const caller = appRouter.createCaller(ctx as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getOne should return specific execution with workflow info', async () => {
    const input = { id: 'ex_1' };
    prismaMock.execution.findUniqueOrThrow.mockResolvedValue({
      id: 'ex_1',
      workflow: { id: 'wf_1', name: 'Workflow 1' },
    });

    const result = await caller.executions.getOne(input);

    expect(prismaMock.execution.findUniqueOrThrow).toHaveBeenCalledWith({
      where: {
        id: 'ex_1',
        workflow: { userId: 'user_123' },
      },
      include: {
        workflow: {
          select: { id: true, name: true },
        },
      },
    });
    expect(result.id).toBe('ex_1');
  });

  it('getMany should return paginated executions', async () => {
    const input = { page: 1, pageSize: 10 };
    prismaMock.execution.findMany.mockResolvedValue([{ id: 'ex_1' }]);
    prismaMock.execution.count.mockResolvedValue(1);

    const result = await caller.executions.getMany(input);

    expect(prismaMock.execution.findMany).toHaveBeenCalled();
    expect(prismaMock.execution.count).toHaveBeenCalled();
    expect(result.items).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("getOne of another user's execution surfaces Prisma not-found as INTERNAL_SERVER_ERROR", async () => {
    // ponytail: ownership is enforced via the nested workflow.userId filter;
    // the mock simulates Prisma's P2025 rejection for a foreign row.
    const input = { id: 'ex_other' };
    prismaMock.execution.findUniqueOrThrow.mockRejectedValue(
      new Error('Record to access not found'),
    );

    await expect(caller.executions.getOne(input)).rejects.toThrow(TRPCError);
    await expect(caller.executions.getOne(input)).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    });
    expect(prismaMock.execution.findUniqueOrThrow).toHaveBeenCalledWith({
      where: {
        id: 'ex_other',
        workflow: { userId: 'user_123' },
      },
      include: {
        workflow: {
          select: { id: true, name: true },
        },
      },
    });
  });

  it('getMany should reject pageSize above MAX_PAGE_SIZE', async () => {
    await expect(
      caller.executions.getMany({
        page: 1,
        pageSize: PAGINATION.MAX_PAGE_SIZE + 1,
      }),
    ).rejects.toThrow(TRPCError);
    expect(prismaMock.execution.findMany).not.toHaveBeenCalled();
  });

  it('getMany should compute skip/take from page and pageSize', async () => {
    prismaMock.execution.findMany.mockResolvedValue([]);
    prismaMock.execution.count.mockResolvedValue(0);

    await caller.executions.getMany({ page: 2, pageSize: 25 });

    expect(prismaMock.execution.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 25, take: 25 }),
    );
  });

  it('getMany should return empty page metadata when no executions exist', async () => {
    prismaMock.execution.findMany.mockResolvedValue([]);
    prismaMock.execution.count.mockResolvedValue(0);

    const result = await caller.executions.getMany({ page: 1, pageSize: 10 });

    expect(result.items).toEqual([]);
    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });
});
