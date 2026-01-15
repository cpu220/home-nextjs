/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 启用standalone输出模式，用于Docker部署
  assetPrefix: '/home-static', // 添加静态资源前缀
}

module.exports = nextConfig

