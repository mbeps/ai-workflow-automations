import { describe, it, expect, beforeEach, vi } from 'vitest';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';

describe('manualTriggerExecutor', () => {
  const baseParams = {
    nodeId: 'node_1',
    userId: 'user_123',
    context: { foo: 'bar' },
    step: stepMock,
    publish: publishMock,
    data: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute successfully and return context', async () => {
    const result = await manualTriggerExecutor(baseParams);
    expect(result).toEqual({ foo: 'bar' });
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'success' })
    }));
  });
});
