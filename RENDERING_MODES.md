# Next.js 渲染模式说明

## 当前状态

✅ **当前项目已启用 SSR（服务端渲染）**

在 Next.js App Router 中，`app/page.tsx` 默认是 **Server Component**，会进行服务端渲染。

## 三种渲染模式对比

| 模式 | 说明 | 何时使用 |
|------|------|----------|
| **SSR** (Server-Side Rendering) | 每次请求都在服务端渲染 | 需要实时数据、用户个性化内容 |
| **SSG** (Static Site Generation) | 构建时生成静态 HTML | 内容不经常变化、博客、文档 |
| **CSR** (Client-Side Rendering) | 在浏览器中渲染 | 需要交互、动态更新、不需要 SEO |

## 如何控制渲染模式

### 1. 强制使用 SSR（服务端渲染）

在 `app/page.tsx` 中添加：

```typescript
// 强制使用 SSR，每次请求都重新渲染
export const dynamic = 'force-dynamic'
```

**适用场景：**
- 需要实时数据
- 用户个性化内容
- 需要访问 cookies、headers 等请求信息

### 2. 使用 SSG（静态生成，关闭 SSR）

在 `app/page.tsx` 中添加：

```typescript
// 强制使用 SSG，构建时生成静态页面
export const dynamic = 'force-static'
```

或者使用 `revalidate` 进行增量静态再生：

```typescript
// 每 60 秒重新生成一次静态页面
export const revalidate = 60
```

**适用场景：**
- 内容不经常变化
- 博客文章
- 文档网站
- 需要更好的性能

### 3. 使用 CSR（客户端渲染，完全关闭 SSR）

将组件改为 Client Component，在文件顶部添加 `'use client'`：

```typescript
'use client'

import { useState, useEffect } from 'react'
// ... 其他代码
```

**适用场景：**
- 需要浏览器 API（localStorage, window 等）
- 需要用户交互和状态管理
- 不需要 SEO 的页面

## 实际示例

### 示例 1：当前项目（SSR）

```typescript
// app/page.tsx
import { Project } from '@/types/portfolio'
import ProjectCard from '@/components/ProjectCard'
import portfolioData from '@/data/portfolio.json'

// 可选：明确指定使用 SSR
export const dynamic = 'force-dynamic'

export default function Home() {
  const projects: Project[] = portfolioData as Project[]
  // ... 组件代码
}
```

### 示例 2：改为 SSG（静态生成）

```typescript
// app/page.tsx
import { Project } from '@/types/portfolio'
import ProjectCard from '@/components/ProjectCard'
import portfolioData from '@/data/portfolio.json'

// 强制使用静态生成
export const dynamic = 'force-static'

// 或者使用增量静态再生（每 3600 秒重新生成一次）
export const revalidate = 3600

export default function Home() {
  const projects: Project[] = portfolioData as Project[]
  // ... 组件代码
}
```

### 示例 3：改为 CSR（客户端渲染）

```typescript
// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/types/portfolio'
import ProjectCard from '@/components/ProjectCard'
import portfolioData from '@/data/portfolio.json'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // 在客户端加载数据
    setProjects(portfolioData as Project[])
  }, [])

  // ... 组件代码
}
```

## 如何验证当前渲染模式

### 方法 1：查看构建输出

运行 `npm run build`，查看输出信息：

- **SSR**: 会显示 `λ (Server)` 或 `○ (Static)` 带有动态标记
- **SSG**: 会显示 `○ (Static)` 或 `● (Static)`
- **CSR**: 会显示 `ƒ (Dynamic)`

### 方法 2：查看页面源代码

1. 在浏览器中打开页面
2. 右键 -> 查看页面源代码
3. 如果能看到完整的 HTML 内容（包括作品列表），说明是 SSR 或 SSG
4. 如果只有 `<div id="__next"></div>`，说明是 CSR

### 方法 3：添加时间戳测试

在组件中添加当前时间：

```typescript
export default function Home() {
  const renderTime = new Date().toLocaleString()
  
  return (
    <div>
      <p>页面渲染时间: {renderTime}</p>
      {/* ... 其他内容 */}
    </div>
  )
}
```

- **SSR**: 每次刷新页面，时间都会更新（服务端渲染时间）
- **SSG**: 刷新页面时间不变（构建时的时间）
- **CSR**: 每次刷新，时间都会更新（客户端渲染时间）

## 推荐配置

对于个人作品集网站，推荐使用 **SSG（静态生成）**：

1. ✅ 内容不经常变化
2. ✅ 更好的性能（CDN 缓存）
3. ✅ 更低的服务器成本
4. ✅ 更好的 SEO

## 注意事项

1. **Server Components 和 Client Components 的区别**
   - Server Component：默认，不能使用 hooks、浏览器 API
   - Client Component：需要 `'use client'`，可以使用所有 React 功能

2. **混合使用**
   - 可以在同一个页面中混合使用 Server 和 Client Components
   - Server Component 可以导入 Client Component
   - Client Component 不能直接导入 Server Component

3. **数据获取**
   - Server Component：可以直接读取文件、访问数据库
   - Client Component：需要通过 API 路由或 useEffect 获取数据

