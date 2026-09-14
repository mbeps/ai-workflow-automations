import { describe, it, expect } from 'vitest';
import { NodeType } from '@prisma/client';
import {
  executorRegistry,
  getExecutor,
} from '@/features/executions/lib/executor-registry';

describe('executor-registry', () => {
  it('maps every NodeType enum value to a defined executor function', () => {
    for (const type of Object.values(NodeType)) {
      const executor = executorRegistry[type];
      expect(executor, `missing executor for ${type}`).toBeDefined();
      expect(typeof executor).toBe('function');
    }
  });

  it('getExecutor returns an executor for every NodeType', () => {
    for (const type of Object.values(NodeType)) {
      expect(typeof getExecutor(type)).toBe('function');
    }
  });

  it('getExecutor throws for unknown node types', () => {
    expect(() =>
      getExecutor('UNKNOWN_TYPE' as NodeType),
    ).toThrowError(/No executor found for node type/);
  });
});
