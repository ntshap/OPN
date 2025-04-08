/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-project-pemuda.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
