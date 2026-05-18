import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../../../../__tests__/__mocks__/prisma';
import { appRouter } from '@/trpc/routers/_app';

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
});
