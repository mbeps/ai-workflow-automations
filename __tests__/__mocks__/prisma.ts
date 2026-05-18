import { vi } from 'vitest';

export const prismaMock = {
  workflow: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  credential: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  node: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  connection: {
    createMany: vi.fn(),
  },
  execution: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn(async (cb) => await cb(prismaMock)),
};

vi.mock('@/lib/db', () => ({
  __esModule: true,
  prisma: prismaMock,
  default: prismaMock,
}));

vi.mock('@prisma/client', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    PrismaClient: vi.fn().mockImplementation(() => prismaMock),
  };
});

export default prismaMock;
