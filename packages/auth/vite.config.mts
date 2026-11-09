import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/auth',
  plugins: [
    angular({ tsconfig: `${import.meta.dirname}/tsconfig.spec.json` }),
    nxViteTsPaths(),
  ],
  test: {
    name: 'auth',
    watch: false,
    globals: true,
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://fitness.example/' } },
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/auth',
      provider: 'v8' as const,
    },
  },
}));
