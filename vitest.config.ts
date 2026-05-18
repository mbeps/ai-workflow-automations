import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**', 'schemas/**', 'hooks/**', 'features/**'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/**',
        'prisma/**',
        'inngest/client.ts',
        'lib/env.ts',
        '**/*.d.ts',
        'components/ui/**',
        'components/react-flow/**',
        
        'lib/db.ts',
        'lib/auth.ts',
        'lib/polar.ts',
        'features/**/server/prefetch.ts',
        'features/**/server/params-loader.ts',
        'trpc/client.tsx',
        'trpc/query-client.ts',
        'trpc/server.tsx', '**/node.tsx', '**/dialog.tsx', '**/actions.ts',
      ],
    },
  },
});
