import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionStatus, type NodeType } from '@prisma/client';
import { NonRetriableError } from 'inngest';

vi.mock('@/features/executions/lib/executor-registry', () => ({
  getExecutor: vi.fn(),
}));

// The global inngest mock stubs the client without createFunction; provide a
// minimal passthrough so the real function config/handler is captured.
vi.mock('@/inngest/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/inngest/client')>();
  return {
    inngest: {
      ...actual.inngest,
      createFunction: (_config: unknown, handler: unknown) => ({
        fn: handler,
        options: _config,
      }),
    },
  };
});

// The global inngest mock stubs @/inngest/utils; use the real implementation.
vi.unmock('@/inngest/utils');

import { executeWorkflow } from '@/inngest/functions';
import { prismaMock } from '../__mocks__/prisma';
import { stepMock } from '../__mocks__/inngest';
import { getExecutor } from '@/features/executions/lib/executor-registry';

const makeNode = (id: string, type: string = 'INITIAL', data: Record<string, unknown> = {}) =>
  ({ id, type, data }) as any;

const baseEvent = {
  id: 'event_123',
  name: 'workflows/execute.workflow',
  data: {
    workflowId: 'wf_1',
  },
};

describe('executeWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.execution.create = vi.fn().mockResolvedValue({});
    prismaMock.execution.update = vi.fn().mockResolvedValue({});
    prismaMock.workflow.findUniqueOrThrow
      .mockResolvedValueOnce({
        id: 'wf_1',
        nodes: [],
        connections: [],
      })
      .mockResolvedValueOnce({ userId: 'user_123' });
  });

  it('throws NonRetriableError when event id or workflowId is missing', async () => {
    await expect(
      (executeWorkflow as any).fn({ event: { ...baseEvent, id: undefined }, step: stepMock }),
    ).rejects.toThrow(NonRetriableError);

    await expect(
      (executeWorkflow as any).fn({
        event: { ...baseEvent, data: {} },
        step: stepMock,
      }),
    ).rejects.toThrow(NonRetriableError);

    expect(prismaMock.execution.create).not.toHaveBeenCalled();
  });

  it('runs executors in topological order and marks execution SUCCESS', async () => {
    const order: string[] = [];
    const executorA = vi.fn((params: any) => {
      order.push('a');
      return { ...params.context, a: 1 };
    });
    const executorB = vi.fn((params: any) => {
      order.push('b');
      return { ...params.context, b: 2 };
    });
    (getExecutor as any).mockImplementation((type: NodeType) =>
      type === ('ANTHROPIC' as NodeType) ? executorA : executorB,
    );

    prismaMock.workflow.findUniqueOrThrow
      .mockReset()
      .mockResolvedValueOnce({
        id: 'wf_1',
        nodes: [makeNode('b', 'OPENAI'), makeNode('a', 'ANTHROPIC')],
        connections: [{ fromNodeId: 'a', toNodeId: 'b' }],
      })
      .mockResolvedValueOnce({ userId: 'user_123' });

    const result = await (executeWorkflow as any).fn({
      event: baseEvent,
      step: stepMock,
    });

    expect(order).toEqual(['a', 'b']);
    expect(executorB).toHaveBeenCalledWith(
      expect.objectContaining({
        nodeId: 'b',
        context: { a: 1 },
        userId: 'user_123',
      }),
    );
    expect(prismaMock.execution.create).toHaveBeenCalledWith({
      data: { workflowId: 'wf_1', inngestEventId: 'event_123' },
    });
    expect(prismaMock.execution.update).toHaveBeenCalledWith({
      where: { inngestEventId: 'event_123', workflowId: 'wf_1' },
      data: expect.objectContaining({ status: ExecutionStatus.SUCCESS }),
    });
    expect(result).toEqual({
      workflowId: 'wf_1',
      result: { a: 1, b: 2 },
    });
  });

  it('marks execution FAILED when an executor throws', async () => {
    (getExecutor as any).mockReturnValue(
      vi.fn().mockRejectedValue(new Error('boom')),
    );

    prismaMock.workflow.findUniqueOrThrow
      .mockReset()
      .mockResolvedValueOnce({
        id: 'wf_1',
        nodes: [makeNode('n_1', 'OPENAI')],
        connections: [],
      })
      .mockResolvedValueOnce({ userId: 'user_123' });

    await expect(
      (executeWorkflow as any).fn({ event: baseEvent, step: stepMock }),
    ).rejects.toThrow('boom');

    expect(prismaMock.execution.update).not.toHaveBeenCalledWith(
      expect.anything(),
      // update-execution step should never run
    );
    const successCall = prismaMock.execution.update.mock.calls.find(
      ([args]: any) => args?.data?.status === ExecutionStatus.SUCCESS,
    );
    expect(successCall).toBeUndefined();
  });

  it('onFailure marks the execution FAILED with error and errorStack', async () => {
    prismaMock.execution.update.mockResolvedValue({});

    const onFailure = (executeWorkflow as any).options.onFailure;
    expect(onFailure).toBeTypeOf('function');

    await onFailure({
      event: {
        data: {
          event: { id: 'event_123' },
          error: { message: 'kaboom', stack: 'stack-trace' },
        },
      },
      step: stepMock,
    });

    expect(prismaMock.execution.update).toHaveBeenCalledWith({
      where: { inngestEventId: 'event_123' },
      data: {
        status: ExecutionStatus.FAILED,
        error: 'kaboom',
        errorStack: 'stack-trace',
      },
    });
  });
});
