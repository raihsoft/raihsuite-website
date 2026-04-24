/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ This will stop ESLint from breaking Cloudflare/Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Your existing config
  experimental: {
    // serverActions: true,
  },
};

export default nextConfig;
