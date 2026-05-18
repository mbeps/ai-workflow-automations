import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../../../../__tests__/__mocks__/prisma';
import { appRouter } from '@/trpc/routers/_app';
import { sendWorkflowExecution } from '@/inngest/utils';
import { NodeType } from '@prisma/client';

// Mock inngest utils
vi.mock('@/inngest/utils', () => ({
  sendWorkflowExecution: vi.fn(),
}));

describe('workflowsRouter', () => {
  const ctx = {
    auth: {
      user: { id: 'user_123' },
    },
  };

  const caller = appRouter.createCaller(ctx as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('execute should send workflow execution', async () => {
    const input = { id: 'wf_1' };
    prismaMock.workflow.findUniqueOrThrow.mockResolvedValue({ id: 'wf_1' });

    const result = await caller.workflows.execute(input);

    expect(prismaMock.workflow.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'wf_1', userId: 'user_123' },
    });
    expect(sendWorkflowExecution).toHaveBeenCalledWith({ workflowId: 'wf_1' });
    expect(result).toEqual({ id: 'wf_1' });
  });

  it('create should create a new workflow with INITIAL node', async () => {
    const ctxPremium = { ...ctx, customer: {} };
    const premiumCaller = appRouter.createCaller(ctxPremium as any);
    prismaMock.workflow.create.mockResolvedValue({ id: 'wf_new' });

    const result = await premiumCaller.workflows.create();

    expect(prismaMock.workflow.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'user_123',
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      }),
    }));
    expect(result).toEqual({ id: 'wf_new' });
  });

  it('remove should delete the workflow', async () => {
    const input = { id: 'wf_1' };
    prismaMock.workflow.delete.mockResolvedValue({ id: 'wf_1' });

    const result = await caller.workflows.remove(input);

    expect(prismaMock.workflow.delete).toHaveBeenCalledWith({
      where: { id: 'wf_1', userId: 'user_123' },
    });
    expect(result).toEqual({ id: 'wf_1' });
  });

  it('update should use transaction to update nodes and edges', async () => {
    const input = {
      id: 'wf_1',
      nodes: [
        { id: 'n1', type: 'INITIAL', position: { x: 0, y: 0 }, data: {} },
        { id: 'n2', position: { x: 10, y: 10 }, data: { foo: 'bar' } } as any
      ],
      edges: [
        { source: 'n1', target: 'n2', sourceHandle: 'h1', targetHandle: 'h2' },
        { source: 'n2', target: 'n3' } as any
      ],
    };
    prismaMock.workflow.findUniqueOrThrow.mockResolvedValue({ id: 'wf_1' });
    prismaMock.node.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.node.createMany.mockResolvedValue({ count: 1 });
    prismaMock.connection.createMany.mockResolvedValue({ count: 1 });
    prismaMock.workflow.update.mockResolvedValue({ id: 'wf_1' });

    await caller.workflows.update(input);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(prismaMock.node.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
            expect.objectContaining({ name: 'INITIAL' }),
            expect.objectContaining({ name: 'unknown' })
        ])
    });
    expect(prismaMock.connection.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
            expect.objectContaining({ fromOutput: 'h1', toInput: 'h2' }),
            expect.objectContaining({ fromOutput: 'main', toInput: 'main' })
        ])
    });
  });

  it('getOne should return workflow with transformed nodes and edges', async () => {
    const input = { id: 'wf_1' };
    prismaMock.workflow.findUniqueOrThrow.mockResolvedValue({
      id: 'wf_1',
      name: 'Test Workflow',
      nodes: [{ id: 'n1', type: 'INITIAL', position: { x: 0, y: 0 }, data: { a: 1 } }],
      connections: [{ id: 'c1', fromNodeId: 'n1', toNodeId: 'n2', fromOutput: 'out', toInput: 'in' }]
    });

    const result = await caller.workflows.getOne(input);

    expect(result.id).toBe('wf_1');
    expect(result.nodes[0]).toEqual(expect.objectContaining({ id: 'n1', data: { a: 1 } }));
    expect(result.edges[0]).toEqual(expect.objectContaining({ source: 'n1', target: 'n2', sourceHandle: 'out' }));
  });

  it('getMany should return paginated workflows with search', async () => {
    // Test branch where hasNextPage and hasPreviousPage are both true, and search is used
    prismaMock.workflow.findMany.mockResolvedValue([{ id: 'wf_2' }]);
    prismaMock.workflow.count.mockResolvedValue(15); 

    const result = await caller.workflows.getMany({ page: 2, pageSize: 5, search: 'test' });

    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
    
    // Test branch where hasNextPage is false
    prismaMock.workflow.count.mockResolvedValue(10);
    const result2 = await caller.workflows.getMany({ page: 2, pageSize: 5 });
    expect(result2.hasNextPage).toBe(false);
    expect(result2.hasPreviousPage).toBe(true);

    // Test branch where hasPreviousPage is false
    const result3 = await caller.workflows.getMany({ page: 1, pageSize: 5 });
    expect(result3.hasNextPage).toBe(true);
    expect(result3.hasPreviousPage).toBe(false);
  });

  it('updateName should update workflow name', async () => {
    const input = { id: 'wf_1', name: 'New Name' };
    prismaMock.workflow.update.mockResolvedValue({ id: 'wf_1', name: 'New Name' });

    const result = await caller.workflows.updateName(input);

    expect(prismaMock.workflow.update).toHaveBeenCalledWith({
      where: { id: 'wf_1', userId: 'user_123' },
      data: { name: 'New Name' },
    });
    expect(result.name).toBe('New Name');
  });
});
