import { describe, it, expect, beforeEach, vi } from 'vitest';

import { prismaMock } from '../../../../__tests__/__mocks__/prisma';
import '../../../../__tests__/__mocks__/encryption';
import { appRouter } from '@/trpc/routers/_app';

describe('credentialsRouter', () => {
  const ctx = {
    auth: {
      user: { id: 'user_123' },
    },
  };

  const caller = appRouter.createCaller(ctx as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create should create an encrypted credential', async () => {
    const ctxPremium = { ...ctx, customer: {} };
    const premiumCaller = appRouter.createCaller(ctxPremium as any);
    const input = { name: 'My Key', value: 'secret_value', type: 'OPENAI' as any };
    prismaMock.credential.create.mockResolvedValue({ id: 'cred_1', ...input, value: 'encrypted_secret_value' });

    const result = await premiumCaller.credentials.create(input);

    expect(prismaMock.credential.create).toHaveBeenCalledWith({
      data: {
        name: 'My Key',
        userId: 'user_123',
        type: 'OPENAI',
        value: 'salt|iv|tag|secret_value',
      },
    });
    expect(result.id).toBe('cred_1');
  });

  it('remove should delete the credential', async () => {
    const input = { id: 'cred_1' };
    prismaMock.credential.delete.mockResolvedValue({ id: 'cred_1' });

    const result = await caller.credentials.remove(input);

    expect(prismaMock.credential.delete).toHaveBeenCalledWith({
      where: { id: 'cred_1', userId: 'user_123' },
    });
    expect(result.id).toBe('cred_1');
  });

  it('update should update the credential with encryption', async () => {
    const input = { id: 'cred_1', name: 'Updated Key', type: 'OPENAI' as any, value: 'new_secret' };
    prismaMock.credential.update.mockResolvedValue({ id: 'cred_1', ...input, value: 'encrypted_new_secret' });

    const result = await caller.credentials.update(input);

    expect(prismaMock.credential.update).toHaveBeenCalledWith({
      where: { id: 'cred_1', userId: 'user_123' },
      data: {
        name: 'Updated Key',
        type: 'OPENAI',
        value: 'salt|iv|tag|new_secret',
      },
    });
    expect(result.id).toBe('cred_1');
  });

  it('getOne should return credential', async () => {
    const input = { id: 'cred_1' };
    prismaMock.credential.findUniqueOrThrow.mockResolvedValue({ id: 'cred_1' });

    const result = await caller.credentials.getOne(input);

    expect(prismaMock.credential.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'cred_1', userId: 'user_123' },
    });
    expect(result.id).toBe('cred_1');
  });

  it('getMany should return paginated credentials', async () => {
    const input = { page: 1, pageSize: 10, search: 'test' };
    prismaMock.credential.findMany.mockResolvedValue([{ id: 'cred_1' }]);
    prismaMock.credential.count.mockResolvedValue(1);

    const result = await caller.credentials.getMany(input);

    expect(prismaMock.credential.findMany).toHaveBeenCalled();
    expect(prismaMock.credential.count).toHaveBeenCalled();
    expect(result.items).toHaveLength(1);
  });

  it('getByType should return credentials of specific type', async () => {
    const input = { type: 'OPENAI' as any };
    prismaMock.credential.findMany.mockResolvedValue([{ id: 'cred_1', type: 'OPENAI' }]);

    const result = await caller.credentials.getByType(input);

    expect(prismaMock.credential.findMany).toHaveBeenCalledWith({
      where: { type: 'OPENAI', userId: 'user_123' },
      orderBy: { updatedAt: 'desc' },
    });
    expect(result).toHaveLength(1);
  });
});
