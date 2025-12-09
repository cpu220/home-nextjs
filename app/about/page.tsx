// 这是 /about 页面
// 路由规则：app/about/page.tsx => /about

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '关于我 - 个人作品集',
  description: '了解我的背景和技能',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            关于我
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                个人简介
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                我是一名热爱编程的开发者，专注于 Web 开发和前端技术。
                喜欢学习新技术，构建有趣的应用程序。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                技能栈
              </h2>
              <div className="flex flex-wrap gap-3">
                {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                学习目标
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>深入学习 Next.js 和 SSR 技术</li>
                <li>掌握现代前端开发最佳实践</li>
                <li>构建高性能的 Web 应用程序</li>
                <li>持续学习和改进</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}




