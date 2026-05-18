import { vi, beforeAll } from 'vitest';
import prismaMock from './__tests__/__mocks__/prisma';
// import './__tests__/__mocks__/encryption';
import './__tests__/__mocks__/inngest';
import './__tests__/__mocks__/polar';
import './__tests__/__mocks__/ai';

// Provide mandatory environment variables for tests
process.env.ENCRYPTION_KEY = 'test_encryption_key_32_characters_long';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.BETTER_AUTH_SECRET = 'test_secret';

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock lib/db to use prismaMock
vi.mock('@/lib/db', () => ({
  __esModule: true,
  prisma: prismaMock,
  default: prismaMock,
}));

// Mock lib/auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockImplementation(async () => {
        return {
          user: { id: 'user_123', email: 'test@example.com' },
          session: { id: 'session_123' }
        };
      }),
    },
  },
}));

beforeAll(() => {
  vi.clearAllMocks();
});

vi.mock('@inngest/realtime', () => ({
  channel: vi.fn(() => ({
    addTopic: vi.fn(() => vi.fn(() => ({
      status: vi.fn((payload) => ({ payload })),
    }))),
  })),
  topic: vi.fn(() => ({
    type: vi.fn(() => ({})),
  })),
}));
