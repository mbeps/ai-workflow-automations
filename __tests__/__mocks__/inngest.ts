import { vi } from 'vitest';

export const stepMock = {
  run: vi.fn((id, cb) => cb()),
  ai: {
    wrap: vi.fn((id, fn, args) => fn(args)),
  },
};

export const publishMock = vi.fn().mockImplementation((val) => val);

vi.mock('@/inngest/client', () => ({
  inngest: {
    send: vi.fn(),
  },
}));

vi.mock('@/inngest/utils', () => ({
  sendWorkflowExecution: vi.fn(),
}));
