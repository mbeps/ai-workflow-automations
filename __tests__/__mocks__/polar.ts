import { vi } from 'vitest';

export const polarMock = {
  customers: {
    getStateExternal: vi.fn(),
  },
};

vi.mock('@/lib/polar', () => ({
  polarClient: polarMock,
}));
