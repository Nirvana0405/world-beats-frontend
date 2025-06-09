/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Pages Router を使いたい場合は App Router を無効化
  experimental: {
    appDir: false,
  },

  // 外部画像を許可（例：バックエンドに保存されたプロフィール画像など）
  images: {
    domains: ['your-backend.onrender.com'],
  },
};

module.exports = nextConfig;
