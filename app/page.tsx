//  'use client'
import { Project } from '@/types/portfolio'
import ProjectCard from '@/components/ProjectCard'
import portfolioData from '@/data/portfolio.json'

// 强制使用 SSR（服务端渲染）- 每次请求都会重新渲染
// 如果想关闭 SSR，改为 SSG，请注释掉下面这行，并添加：export const dynamic = 'force-static'
// 如果想使用 CSR，请添加 'use client' 在文件顶部
export const dynamic = 'force-dynamic'
// export const dynamic = 'force-static'cl
// 如果想使用 CSR，请添加 'use client' 在文件顶部'

// 这是一个 Server Component，使用 SSR
export default function Home() {
  const projects: Project[] = portfolioData as Project[]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* 头部区域 */}
        {/* <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            我的作品集
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            欢迎来到我的个人作品展示页面，这里汇集了我的一些项目作品
          </div>
        </header> */}

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* 空状态 */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无作品展示
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

