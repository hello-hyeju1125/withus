/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 서브경로 배포 시 .env.local에 NEXT_PUBLIC_BASE_PATH=/repo이름 설정
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "withus-web-99dbf.firebasestorage.app", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
