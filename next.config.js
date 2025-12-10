/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 启用standalone输出模式，用于Docker部署
}

module.exports = nextConfig

