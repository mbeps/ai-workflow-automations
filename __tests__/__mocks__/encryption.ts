import { vi } from 'vitest';

vi.mock('@/lib/encryption', () => ({
  encrypt: vi.fn((val) => 'salt|iv|tag|' + val),
  decrypt: vi.fn((val) => val.split('|').pop()),
}));
