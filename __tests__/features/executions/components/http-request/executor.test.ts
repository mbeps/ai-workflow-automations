import { describe, it, expect, beforeEach, vi } from 'vitest';
import { httpRequestExecutor } from '@/features/executions/components/http-request/executor';
import { prismaMock } from '../../../../__mocks__/prisma';
import { stepMock, publishMock } from '../../../../__mocks__/inngest';
import ky from 'ky';
import { NonRetriableError } from 'inngest';

vi.mock('ky', () => ({
  default: vi.fn(),
}));

describe('httpRequestExecutor', () => {
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

  it('should throw error if endpoint is missing', async () => {
    const data = { variableName: 'v1', method: 'GET' as const };
    await expect(httpRequestExecutor({ ...baseParams, data }))
      .rejects.toThrow('No endpoint configured');
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'error' })
    }));
  });

  it('should throw error if variableName is missing', async () => {
    const data = { endpoint: 'http://test.com', method: 'GET' as const };
    await expect(httpRequestExecutor({ ...baseParams, data }))
      .rejects.toThrow('Variable name not configured');
  });

  it('should throw error if method is missing', async () => {
    const data = { endpoint: 'http://test.com', variableName: 'v1' };
    await expect(httpRequestExecutor({ ...baseParams, data }))
      .rejects.toThrow('Method not configured');
  });

  it('should execute successfully for GET request', async () => {
    const data = { 
        endpoint: 'http://test.com/{{id}}', 
        variableName: 'v1', 
        method: 'GET' as const 
    };
    const context = { id: '123' };
    
    (ky as any).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ foo: 'bar' }),
    });

    const result = await httpRequestExecutor({ ...baseParams, data, context });

    expect(ky).toHaveBeenCalledWith('http://test.com/123', expect.objectContaining({ method: 'GET' }));
    expect(result).toEqual({
      ...context,
      v1: {
        httpResponse: {
          status: 200,
          statusText: 'OK',
          data: { foo: 'bar' },
        },
      },
    });
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'success' })
    }));
  });

  it('should execute successfully for POST request with body', async () => {
    const data = { 
        endpoint: 'http://test.com', 
        variableName: 'v1', 
        method: 'POST' as const,
        body: '{"id": "{{id}}"}'
    };
    const context = { id: '123' };
    
    (ky as any).mockResolvedValue({
      status: 201,
      statusText: 'Created',
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ success: true }),
    });

    const result = await httpRequestExecutor({ ...baseParams, data, context });

    expect(ky).toHaveBeenCalledWith('http://test.com', expect.objectContaining({ 
        method: 'POST',
        body: '{"id": "123"}'
    }));
    expect(result.v1.httpResponse.data).toEqual({ success: true });
  });

  it('should handle non-json response', async () => {
    const data = { endpoint: 'http://test.com', variableName: 'v1', method: 'GET' as const };
    
    (ky as any).mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: new Map([['content-type', 'text/plain']]),
      text: async () => 'raw text',
    });

    const result = await httpRequestExecutor({ ...baseParams, data });
    expect(result.v1.httpResponse.data).toBe('raw text');
  });

  it('should handle execution error', async () => {
    const data = { endpoint: 'http://test.com', variableName: 'v1', method: 'GET' as const };
    (ky as any).mockRejectedValue(new Error('Network Error'));

    await expect(httpRequestExecutor({ ...baseParams, data }))
      .rejects.toThrow('Network Error');
    expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({
      payload: expect.objectContaining({ status: 'error' })
    }));
  });
});
