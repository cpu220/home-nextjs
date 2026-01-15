/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 启用standalone输出模式，用于Docker部署
  assetPrefix: '/home-static', // 添加静态资源前缀
  // 添加重写规则，将/home-static开头的请求重写到根目录
  rewrites: () => [
    {
      source: '/home-static/:path*',
      destination: '/:path*',
    },
  ],
}

module.exports = nextConfig

