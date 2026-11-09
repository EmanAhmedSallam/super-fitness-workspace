import type { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'authApp',
  shared: (name, config) =>
    name === '@super-fitness/auth' || name === '@org/ui' || name === '@org/i18n'
      ? { ...config, singleton: true }
      : config,
  exposes: {
    './Routes': 'apps/authApp/src/app/remote-entry/entry.routes.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
