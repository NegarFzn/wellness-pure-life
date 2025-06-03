// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['images.unsplash.com', 'cdn.wellnesspurelife.com'], // update based on use
    },
  };
  
  module.exports = nextConfig;
  