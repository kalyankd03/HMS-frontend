/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable transpiling of monorepo packages
  transpilePackages: [
    '@hms/core',
    '@hms/api-client', 
    '@hms/state',
    '@hms/design-tokens'
  ],
  
  // Experimental features
  experimental: {
    // Enable server components for packages that should remain external
    serverComponentsExternalPackages: []
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle workspace packages properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_PATIENT_URL: process.env.NEXT_PUBLIC_PATIENT_URL,
  },

  // Image domains
  images: {
    domains: ['localhost'],
  }
};

export default nextConfig;
