// 这是动态路由页面 /projects/[id]
// 路由规则：app/projects/[id]/page.tsx => /projects/:id
// 例如：/projects/1, /projects/2 等

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Project } from '@/types/portfolio'
import portfolioData from '@/data/portfolio.json'

export const dynamic = 'force-dynamic'

// 动态生成元数据（可选）
export async function generateMetadata({ params }: { params: { id: string } }) {
  const projects: Project[] = portfolioData as Project[]
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    return {
      title: '项目不存在',
    }
  }

  return {
    title: `${project.title} - 项目详情`,
    description: project.description,
  }
}

// 生成静态路径（可选，用于 SSG）
// 如果使用 SSG，可以取消注释这个函数
// export async function generateStaticParams() {
//   const projects: Project[] = portfolioData as Project[]
//   return projects.map((project) => ({
//     id: project.id,
//   }))
// }

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projects: Project[] = portfolioData as Project[]
  const project = projects.find((p) => p.id === params.id)

  // 如果项目不存在，显示 404
  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8"
          >
            ← 返回项目列表
          </Link>

          {/* 项目详情 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {project.image && (
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {project.title}
              </h1>
              
              {project.category && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    分类：{project.category}
                  </span>
                </div>
              )}

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    技术栈
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  访问项目 →
                </a>
              </div>
            </div>
          </div>

          {/* 路由信息展示（用于学习） */}
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>路由信息：</strong> 这是动态路由页面，URL 参数 id = {params.id}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}




