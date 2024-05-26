/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/upload/:slug",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/:slug`,
      },
    ];
  },
  reactStrictMode: false,
  images: {
    domains: ["s3.ap-northeast-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
