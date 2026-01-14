/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: When deploying to Cloudflare Pages + Functions with adapter:
  // Integrate @cloudflare/next-on-pages or confirm direct support.
  // Edge runtime can be specified per route handler via `export const runtime = 'edge';`
  experimental: {
    // Example placeholders:
    // serverActions: true,
  }
};

export default nextConfig;