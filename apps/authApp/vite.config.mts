/// <reference types='vitest' />
import { join } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const workspaceRoot = join(import.meta.dirname, '../..');

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/authApp',
  plugins: [
    angular({
      workspaceRoot,
      // The workspace libs are consumed from source through tsconfig paths, so
      // they sit outside this project's own program. Without them here their
      // components keep their `templateUrl`/`styleUrl` and fail to resolve
      // under TestBed.
      include: [
        '/packages/ui/src/**/*.ts',
        '/packages/data-access-user/src/**/*.ts',
      ],
    }),
    // `vite-tsconfig-paths` rather than the deprecated `nxViteTsPaths`: the
    // latter resolves workspace libs through Nx's own root, which on Windows
    // differs from Vite's by drive-letter case. The Angular compiler then fails
    // to match those files to its program and leaves their templates unresolved.
    tsconfigPaths({ root: workspaceRoot }),
    nxCopyAssetsPlugin(['*.md']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'authApp',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/authApp',
      provider: 'v8' as const,
    },
  },
}));
