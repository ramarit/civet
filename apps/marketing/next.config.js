/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.civet.io/signup',
        permanent: false,
      },
      {
        source: '/login',
        destination: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.civet.io/login',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
