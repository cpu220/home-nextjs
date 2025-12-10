# Next.js App Router 路由指南

本文档详细说明 Next.js App Router 中的路由系统，以及本项目的路由结构。

## 路由规则

在 Next.js App Router 中，路由是基于文件系统的：

| 文件路径 | URL 路由 | 说明 |
|---------|---------|------|
| `app/page.tsx` | `/` | 首页 |
| `app/about/page.tsx` | `/about` | 关于页面 |
| `app/contact/page.tsx` | `/contact` | 联系方式页面 |
| `app/projects/page.tsx` | `/projects` | 项目列表页面 |
| `app/projects/[id]/page.tsx` | `/projects/:id` | 动态路由，例如 `/projects/1` |

## 项目路由结构

```
app/
├── layout.tsx              # 根布局（所有页面共享）
├── page.tsx                # 首页 (/)
├── globals.css             # 全局样式
├── about/
│   └── page.tsx           # 关于页面 (/about)
├── contact/
│   └── page.tsx           # 联系方式页面 (/contact)
└── projects/
    ├── page.tsx           # 项目列表 (/projects)
    └── [id]/              # 动态路由目录
        ├── page.tsx       # 项目详情 (/projects/:id)
        └── not-found.tsx  # 404 页面
```

## 路由类型

### 1. 静态路由

静态路由是固定的 URL 路径，例如 `/about`、`/contact`。

**示例：`app/about/page.tsx`**

```typescript
// 这是 /about 页面
export default function AboutPage() {
  return <div>关于页面</div>
}
```

访问方式：`http://localhost:3001/about`

### 2. 动态路由

动态路由使用方括号 `[]` 来表示动态参数。

**示例：`app/projects/[id]/page.tsx`**

```typescript
// params 包含动态路由参数
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <div>项目 ID: {params.id}</div>
}
```

访问方式：
- `http://localhost:3001/projects/1`
- `http://localhost:3001/projects/2`
- `http://localhost:3001/projects/abc`

### 3. 捕获所有路由（可选）

如果需要匹配多个路径段，可以使用 `[...slug]`：

```
app/blog/[...slug]/page.tsx
```

这将匹配：
- `/blog/a`
- `/blog/a/b`
- `/blog/a/b/c`

### 4. 可选捕获路由（可选）

使用 `[[...slug]]` 可以匹配可选的路径段：

```
app/shop/[[...slug]]/page.tsx
```

这将匹配：
- `/shop`
- `/shop/a`
- `/shop/a/b`

## 特殊文件

### `layout.tsx`

布局文件会在所有子路由中共享，不会卸载和重新挂载。

```
app/
├── layout.tsx          # 根布局
├── about/
│   └── page.tsx       # 会使用根布局
└── projects/
    ├── layout.tsx     # 项目页面的布局（嵌套布局）
    └── [id]/
        └── page.tsx   # 会使用根布局 + 项目布局
```

### `not-found.tsx`

自定义 404 页面。

```
app/
├── not-found.tsx           # 全局 404
└── projects/
    └── [id]/
        └── not-found.tsx   # 项目详情页的 404
```

### `loading.tsx`

加载状态组件（用于 Suspense）。

```
app/
└── loading.tsx    # 全局加载状态
```

### `error.tsx`

错误边界组件。

```
app/
└── error.tsx      # 全局错误处理
```

### `route.ts` / `route.js`

API 路由文件（类似 Pages Router 的 API）。

```
app/
└── api/
    └── users/
        └── route.ts    # /api/users
```

## 导航组件

### 使用 Next.js Link 组件

```typescript
import Link from 'next/link'

<Link href="/about">关于</Link>
<Link href="/projects/1">项目 1</Link>
```

### 编程式导航（Client Component）

```typescript
'use client'
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/about')
```

### 获取当前路径（Client Component）

```typescript
'use client'
import { usePathname } from 'next/navigation'

const pathname = usePathname()
// pathname 会是 '/about' 或 '/projects/1' 等
```

## 元数据（Metadata）

### 静态元数据

```typescript
export const metadata = {
  title: '关于我',
  description: '了解我的背景',
}
```

### 动态元数据

```typescript
export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `项目 ${params.id}`,
  }
}
```

## 数据获取

### Server Component（默认）

```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  // 可以直接读取文件、访问数据库
  const projects = await fetchProjects()
  
  return <div>{/* 渲染项目 */}</div>
}
```

### Client Component

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])
  
  return <div>{/* 渲染项目 */}</div>
}
```

## 路由参数

### 获取动态路由参数

```typescript
// app/projects/[id]/page.tsx
export default function ProjectPage({ params }: { params: { id: string } }) {
  return <div>项目 ID: {params.id}</div>
}
```

### 异步参数（Next.js 15+）

在 Next.js 15 中，params 可能是异步的：

```typescript
export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return <div>项目 ID: {id}</div>
}
```

## 静态生成（SSG）

### 生成静态路径

```typescript
// app/projects/[id]/page.tsx
export async function generateStaticParams() {
  const projects = await fetchProjects()
  
  return projects.map((project) => ({
    id: project.id,
  }))
}
```

这将为所有项目生成静态页面。

## 路由组（Route Groups）

使用括号 `()` 创建路由组，不会影响 URL：

```
app/
├── (marketing)/
│   ├── about/
│   └── contact/
└── (shop)/
    ├── products/
    └── cart/
```

URL 仍然是 `/about`、`/contact`、`/products`、`/cart`，但可以有不同的布局。

## 并行路由（Parallel Routes）

使用 `@folder` 语法：

```
app/
├── @analytics/
├── @team/
└── layout.tsx
```

## 拦截路由（Intercepting Routes）

使用 `(.)` 或 `(..)` 语法来拦截路由。

## 最佳实践

1. ✅ **使用 Server Components 默认**：只有在需要交互时才使用 Client Components
2. ✅ **使用 Link 组件**：不要使用 `<a>` 标签进行内部导航
3. ✅ **合理使用布局**：避免过度嵌套
4. ✅ **使用元数据**：提升 SEO
5. ✅ **处理错误**：使用 `error.tsx` 和 `not-found.tsx`

## 本项目的路由示例

### 首页
- 文件：`app/page.tsx`
- URL：`/`
- 功能：展示所有作品卡片

### 关于页面
- 文件：`app/about/page.tsx`
- URL：`/about`
- 功能：个人简介和技能

### 联系方式页面
- 文件：`app/contact/page.tsx`
- URL：`/contact`
- 功能：联系方式信息

### 项目列表
- 文件：`app/projects/page.tsx`
- URL：`/projects`
- 功能：所有项目列表

### 项目详情（动态路由）
- 文件：`app/projects/[id]/page.tsx`
- URL：`/projects/1`, `/projects/2` 等
- 功能：单个项目的详细信息

## 测试路由

启动开发服务器后，访问以下 URL：

- `http://localhost:3001/` - 首页
- `http://localhost:3001/about` - 关于页面
- `http://localhost:3001/contact` - 联系方式
- `http://localhost:3001/projects` - 项目列表
- `http://localhost:3001/projects/1` - 项目 1 详情
- `http://localhost:3001/projects/2` - 项目 2 详情
- `http://localhost:3001/projects/999` - 404 页面（项目不存在）

## 更多资源

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [路由文档](https://nextjs.org/docs/app/building-your-application/routing)
- [布局文档](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)




