/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "wellnesspurelife.com",
      "cdn.wellnesspurelife.com",
    ],
  },

  async redirects() {
    return [
      // Fix any known broken URLs here once you find them in GA4
      // Example:
      // {
      //   source: "/old-page",
      //   destination: "/new-page",
      //   permanent: true,
      // },
    ];
  },
};

module.exports = nextConfig;