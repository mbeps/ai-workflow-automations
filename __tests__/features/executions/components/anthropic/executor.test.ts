import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../../__mocks__/encryption';
import { anthropicExecutor } from '@/features/executions/components/anthropic/executor';
import { prismaMock } from '../../../../__tests__/__mocks__/prisma';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';
import { generateText } from 'ai';
import { NonRetriableError } from 'inngest';

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

describe('anthropicExecutor', () => {
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

  it('should throw error if variableName is missing', async () => {
    const data = { credentialId: 'c1', userPrompt: 'hello' };
    await expect(anthropicExecutor({ ...baseParams, data }))
      .rejects.toThrow('Variable name is missing');
  });

  it('should throw error if credentialId is missing', async () => {
    const data = { variableName: 'v1', userPrompt: 'hello' };
    await expect(anthropicExecutor({ ...baseParams, data }))
      .rejects.toThrow('Credential is required');
  });

  it('should throw error if userPrompt is missing', async () => {
    const data = { variableName: 'v1', credentialId: 'c1' };
    await expect(anthropicExecutor({ ...baseParams, data }))
      .rejects.toThrow('User prompt is missing');
  });

  it('should execute successfully', async () => {
    const data = { 
        variableName: 'v1', 
        credentialId: 'c1', 
        userPrompt: 'hello {{name}}',
        systemPrompt: 'You are {{role}}'
    };
    const context = { name: 'World', role: 'Hero' };
    
    stepMock.run.mockResolvedValue({ value: 'encrypted_key' });
    (generateText as any).mockResolvedValue({
      steps: [{ content: [{ type: 'text', text: 'response' }] }]
    });

    const result = await anthropicExecutor({ ...baseParams, data, context });

    expect(result).toEqual({ ...context, v1: { text: 'response' } });
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({
        system: 'You are Hero',
        prompt: 'hello World'
    }));
  });

  it('should handle missing credential', async () => {
    const data = { variableName: 'v1', credentialId: 'c1', userPrompt: 'hello' };
    stepMock.run.mockResolvedValue(null);

    await expect(anthropicExecutor({ ...baseParams, data }))
      .rejects.toThrow('Credential not found');
  });

  it('should handle execution error', async () => {
    const data = { variableName: 'v1', credentialId: 'c1', userPrompt: 'hello' };
    stepMock.run.mockResolvedValue({ value: 'encrypted_key' });
    (generateText as any).mockRejectedValue(new Error('AI Error'));

    await expect(anthropicExecutor({ ...baseParams, data }))
      .rejects.toThrow('AI Error');
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'error' })
    }));
  });
});
