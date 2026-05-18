import { describe, it, expect, beforeEach, vi } from 'vitest';
import { discordExecutor } from '@/features/executions/components/discord/executor';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';
import ky from 'ky';

vi.mock('ky', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('discordExecutor', () => {
  const baseParams = {
    nodeId: 'node_1',
    userId: 'user_123',
    context: {},
    step: stepMock,
    publish: publishMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if content is missing', async () => {
    await expect(discordExecutor({ ...baseParams, data: {} }))
      .rejects.toThrow('Message content is required');
  });

  it('should execute successfully', async () => {
    const data = { 
        webhookUrl: 'http://discord.com/webhook', 
        content: 'Hello {{name}}', 
        variableName: 'v1' 
    };
    const context = { name: 'World' };
    
    await discordExecutor({ ...baseParams, data, context });

    expect(ky.post).toHaveBeenCalledWith('http://discord.com/webhook', expect.objectContaining({
      json: expect.objectContaining({
        content: 'Hello World'
      })
    }));
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'success' })
    }));
  });

  it('should throw error if webhookUrl is missing', async () => {
    const data = { content: 'Hello', variableName: 'v1' };
    await expect(discordExecutor({ ...baseParams, data }))
      .rejects.toThrow('Webhook URL is required');
  });

  it('should throw error if variableName is missing', async () => {
    const data = { content: 'Hello', webhookUrl: 'http://ok.com' };
    await expect(discordExecutor({ ...baseParams, data }))
      .rejects.toThrow('Variable name is missing');
  });
});
