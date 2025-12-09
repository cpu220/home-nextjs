// 这是动态路由的 404 页面
// 当项目不存在时显示
// 路由规则：app/projects/[id]/not-found.tsx => /projects/:id (当项目不存在时)

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            项目不存在
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            抱歉，找不到这个项目。它可能已被删除或从未存在。
          </p>
          <div className="space-x-4">
            <Link
              href="/projects"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回项目列表
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}




