import { describe, it, expect, beforeEach, vi } from 'vitest';
import { googleFormTriggerExecutor } from '@/features/triggers/components/google-form-trigger/executor';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';

describe('googleFormTriggerExecutor', () => {
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
    const result = await googleFormTriggerExecutor(baseParams);
    expect(result).toEqual({ foo: 'bar' });
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'success' })
    }));
  });
});
