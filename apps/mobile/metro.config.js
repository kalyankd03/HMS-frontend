const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration for monorepo
 * https://facebook.github.io/metro/docs/configuration
 */
const config = {
  watchFolders: [
    // Include workspace packages
    path.resolve(__dirname, '../../packages'),
    path.resolve(__dirname, '../../tooling'),
  ],
  
  resolver: {
    alias: {
      '@hms/core': path.resolve(__dirname, '../../packages/core/src'),
      '@hms/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@hms/state': path.resolve(__dirname, '../../packages/state/src'),
      '@hms/design-tokens': path.resolve(__dirname, '../../packages/design-tokens/src'),
      '@hms/ui-mobile': path.resolve(__dirname, '../../packages/ui-mobile/src'),
    },
    
    // Handle workspace packages
    nodeModulesPaths: [
      path.resolve(__dirname, '../../node_modules'),
      path.resolve(__dirname, './node_modules'),
    ],
  },
  
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);