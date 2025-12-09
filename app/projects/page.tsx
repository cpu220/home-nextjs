// 这是 /projects 页面
// 路由规则：app/projects/page.tsx => /projects

import Link from 'next/link'
import { Project } from '@/types/portfolio'
import portfolioData from '@/data/portfolio.json'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '项目列表 - 个人作品集',
  description: '查看我的所有项目',
}

export default function ProjectsPage() {
  const projects: Project[] = portfolioData as Project[]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          所有项目
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          点击项目卡片可以查看详情，或直接跳转到项目地址。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    查看详情 →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无项目
            </p>
          </div>
        )}
      </div>
    </main>
  )
}




