/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['src'],
  },
  // React Native Web configuration
  webpack: (config, { isServer }) => {
    // Add React Native Web aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      'react-native-linear-gradient$': 'react-native-web-linear-gradient',
      'react-native-svg$': 'react-native-svg-web',
    };

    // Add React Native Web extensions for platform-specific files
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.native.js',
      '.native.jsx', 
      '.native.ts',
      '.native.tsx',
      ...config.resolve.extensions,
    ];

    // Configure module rules for React Native Web
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: 'defaults' }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
          plugins: [
            ['react-native-web/babel', { commonjs: true }],
          ],
        },
      },
      include: [
        /node_modules\/react-native-/,
        /node_modules\/@react-native/,
        /node_modules\/react-native$/,
      ],
    });

    return config;
  },
  // Transpile React Native modules
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-safe-area-context',
    'react-native-linear-gradient', 
    'react-native-svg',
    'react-native-vector-icons',
  ],
};

export default nextConfig;
