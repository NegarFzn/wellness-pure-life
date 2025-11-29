/** @type {import('next').NextConfig'} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "127.0.0.1",

      // ✅ ADD YOUR VPS DOMAIN HERE:
      "wellnesspurelife.com",

      // Optional, if you use CDN too
      "cdn.wellnesspurelife.com",
    ],
  },
};

module.exports = nextConfig;
