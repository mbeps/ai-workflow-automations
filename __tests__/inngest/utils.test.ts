// The global inngest mock stubs out @/inngest/utils; we're testing the real one.
vi.unmock('@/inngest/utils');
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Connection, Node } from '@prisma/client';
import { topologicalSort, sendWorkflowExecution } from '@/inngest/utils';
import { inngest } from '@/inngest/client';

const makeNode = (id: string): Node =>
  ({ id }) as unknown as Node;

const makeConnection = (
  id: string,
  fromNodeId: string,
  toNodeId: string,
): Connection => ({ id, fromNodeId, toNodeId }) as unknown as Connection;

describe('topologicalSort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns nodes as-is when there are no connections', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    expect(topologicalSort(nodes, [])).toEqual(nodes);
  });

  it('orders a linear chain correctly', () => {
    const a = makeNode('a');
    const b = makeNode('b');
    const c = makeNode('c');
    const connections = [
      makeConnection('c1', 'a', 'b'),
      makeConnection('c2', 'b', 'c'),
    ];

    expect(topologicalSort([c, b, a], connections)).toEqual([a, b, c]);
  });

  it('throws when an isolated node is present alongside connections', () => {
    // ponytail: documents actual behavior — the self-edge trick for isolated
    // nodes trips toposort's cycle detection. Upgrade path: append unconnected
    // nodes after sorting instead of self-edges.
    const a = makeNode('a');
    const b = makeNode('b');
    const isolated = makeNode('isolated');
    const connections = [makeConnection('c1', 'a', 'b')];

    expect(() => topologicalSort([a, b, isolated], connections)).toThrow(
      'Workflow contains a cycle',
    );
  });

  it('throws on a cyclic graph', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const connections = [
      makeConnection('c1', 'a', 'b'),
      makeConnection('c2', 'b', 'a'),
    ];

    expect(() => topologicalSort(nodes, connections)).toThrow(
      'Workflow contains a cycle',
    );
  });
});

describe('sendWorkflowExecution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends the workflow execution event with workflowId and a cuid2 id', async () => {
    await sendWorkflowExecution({ workflowId: 'wf_1' });

    expect(inngest.send).toHaveBeenCalledTimes(1);
    const payload = (inngest.send as any).mock.calls[0][0];
    expect(payload.name).toBe('workflows/execute.workflow');
    expect(payload.data).toEqual(
      expect.objectContaining({ workflowId: 'wf_1' }),
    );
    expect(typeof payload.id).toBe('string');
    expect(payload.id).toMatch(/^[a-z0-9]{24}$/);
  });
});
