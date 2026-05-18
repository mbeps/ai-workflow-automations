import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../../../__mocks__/encryption';
import { openAiExecutor } from '@/features/executions/components/openai/executor';
import { prismaMock } from '../../../../__mocks__/prisma';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';
import { generateText } from 'ai';
import { NonRetriableError } from 'inngest';

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

describe('openAiExecutor', () => {
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

  it('should throw error if required field is missing', async () => {
    await expect(openAiExecutor({ ...baseParams, data: {} }))
      .rejects.toThrow(NonRetriableError);
  });

  it('should execute successfully', async () => {
    const data = { variableName: 'v1', credentialId: 'c1', userPrompt: 'hello' };
    stepMock.run.mockResolvedValue({ value: 'encrypted_key' });
    (generateText as any).mockResolvedValue({
      steps: [{ content: [{ type: 'text', text: 'response' }] }]
    });

    const result = await openAiExecutor({ ...baseParams, data });

    expect(result).toEqual({ v1: { text: 'response' } });
  });
});
