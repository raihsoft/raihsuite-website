/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ This will stop ESLint from breaking Cloudflare/Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Expose Cloudflare Pages build environment variables to client bundles
  env: {
    NEXT_PUBLIC_CF_PAGES_BRANCH:
      process.env.CF_PAGES_BRANCH ||
      process.env.NEXT_PUBLIC_CF_PAGES_BRANCH ||
      '',
    NEXT_PUBLIC_CF_PAGES_ENVIRONMENT:
      process.env.CF_PAGES_ENVIRONMENT ||
      process.env.NEXT_PUBLIC_CF_PAGES_ENVIRONMENT ||
      '',
  },

  // Your existing config
  experimental: {
    // serverActions: true,
  },
};

export default nextConfig;
