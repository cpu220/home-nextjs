# 个人作品集网站

这是一个基于 Next.js 14 构建的个人作品展示网站，使用 SSR (Server-Side Rendering) 技术，展示个人作品项目。

## 技术栈

- **Next.js 14** - React 框架，支持 SSR/SSG
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的 CSS 框架
- **App Router** - Next.js 13+ 的新路由系统

## 项目结构

```
home/
├── app/                           # Next.js App Router 目录
│   ├── layout.tsx                # 根布局组件（包含导航）
│   ├── page.tsx                  # 主页 (/)
│   ├── globals.css               # 全局样式
│   ├── about/                    # 关于页面路由
│   │   └── page.tsx             # /about
│   ├── contact/                  # 联系方式页面路由
│   │   └── page.tsx             # /contact
│   └── projects/                 # 项目路由
│       ├── page.tsx             # /projects (项目列表)
│       └── [id]/                # 动态路由
│           ├── page.tsx         # /projects/:id (项目详情)
│           └── not-found.tsx   # 404 页面
├── components/                    # 可复用组件
│   ├── Navigation.tsx            # 导航组件（Client Component）
│   └── ProjectCard.tsx           # 作品卡片组件
├── data/                          # 数据文件
│   └── portfolio.json           # 作品数据配置
├── types/                         # TypeScript 类型定义
│   └── portfolio.ts              # 作品类型定义
├── package.json                  # 项目依赖配置
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── next.config.js                # Next.js 配置
├── README.md                     # 项目文档
├── ROUTING_GUIDE.md              # 路由系统详细指南
└── RENDERING_MODES.md            # 渲染模式说明
```

## 功能特性

- ✅ 服务端渲染 (SSR) - 使用 Next.js App Router
- ✅ 多页面路由 - 包含首页、关于、联系、项目列表和详情页
- ✅ 动态路由 - `/projects/[id]` 支持动态项目 ID
- ✅ 响应式导航 - 顶部导航栏，自动高亮当前页面
- ✅ 响应式设计 - 支持移动端和桌面端
- ✅ 暗色模式支持 - 自动适配系统主题
- ✅ TypeScript - 完整的类型支持
- ✅ 作品卡片展示 - 点击卡片跳转到项目 URL
- ✅ 标签分类 - 支持项目标签和分类展示
- ✅ 404 页面 - 自定义错误页面

## 如何启动开发

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

开发服务器启动后，打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 3. 开发说明

- 修改 `data/portfolio.json` 文件来添加/编辑作品
- 修改 `app/page.tsx` 来调整页面布局
- 修改 `components/ProjectCard.tsx` 来调整卡片样式
- 修改 `app/globals.css` 和 `tailwind.config.ts` 来调整全局样式

## 如何打包构建

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

构建完成后，会在 `.next` 目录生成优化后的生产代码。

### 启动生产服务器

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

生产服务器会在 [http://localhost:3000](http://localhost:3000) 启动。

## 如何部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [Vercel](https://vercel.com)
3. 导入你的 Git 仓库
4. Vercel 会自动检测 Next.js 项目并完成部署

### 其他平台部署

#### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### 静态导出（可选）

如果需要静态导出，可以在 `next.config.js` 中添加：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

然后运行：

```bash
npm run build
```

静态文件会生成在 `out` 目录中，可以部署到任何静态托管服务。

## 自定义作品数据

编辑 `data/portfolio.json` 文件来添加你的作品：

```json
[
  {
    "id": "1",
    "title": "项目标题",
    "description": "项目描述",
    "url": "https://项目链接.com",
    "image": "https://图片链接.com/image.jpg",
    "tags": ["标签1", "标签2"],
    "category": "分类名称"
  }
]
```

字段说明：
- `id`: 唯一标识符
- `title`: 项目标题
- `description`: 项目描述
- `url`: 项目链接（点击卡片跳转的地址）
- `image`: 项目图片链接（可选）
- `tags`: 项目标签数组（可选）
- `category`: 项目分类（可选）

## SSR 说明

本项目使用 Next.js App Router 的 Server Components，**当前已启用 SSR（服务端渲染）**：

- `app/page.tsx` 是 Server Component，在服务端执行
- 数据从 `data/portfolio.json` 读取，在服务端完成
- 首次页面加载时，HTML 已经在服务端生成，提升 SEO 和首屏加载速度
- 使用 `export const dynamic = 'force-dynamic'` 强制 SSR 模式

### 如何切换渲染模式？

📖 **详细说明请查看：[RENDERING_MODES.md](./RENDERING_MODES.md)**

**快速切换：**

1. **关闭 SSR，使用 SSG（静态生成）**：
   - 在 `app/page.tsx` 中，将 `export const dynamic = 'force-dynamic'` 改为 `export const dynamic = 'force-static'`

2. **使用 CSR（客户端渲染）**：
   - 在 `app/page.tsx` 文件顶部添加 `'use client'`
   - 参考示例文件：`app/page.csr.example.tsx`

3. **保持 SSR（当前模式）**：
   - 保持 `export const dynamic = 'force-dynamic'` 即可

## 路由系统

本项目包含多个页面路由，展示 Next.js App Router 的使用：

| 路由 | 文件路径 | 说明 |
|------|---------|------|
| `/` | `app/page.tsx` | 首页，展示所有作品 |
| `/about` | `app/about/page.tsx` | 关于页面 |
| `/contact` | `app/contact/page.tsx` | 联系方式页面 |
| `/projects` | `app/projects/page.tsx` | 项目列表页面 |
| `/projects/:id` | `app/projects/[id]/page.tsx` | 项目详情（动态路由） |

**详细路由说明：** 📖 查看 [ROUTING_GUIDE.md](./ROUTING_GUIDE.md)

### 路由特点

- **静态路由**：`/about`、`/contact` 等固定路径
- **动态路由**：`/projects/[id]` 支持动态参数
- **嵌套布局**：所有页面共享根布局和导航
- **404 处理**：项目不存在时显示自定义 404 页面

## 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [App Router 文档](https://nextjs.org/docs/app)
- [路由文档](https://nextjs.org/docs/app/building-your-application/routing)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 许可证

MIT

