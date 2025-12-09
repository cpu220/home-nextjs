// 这是 /contact 页面
// 路由规则：app/contact/page.tsx => /contact

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '联系方式 - 个人作品集',
  description: '联系我',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            联系方式
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                与我联系
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                如果你对我的作品感兴趣，或者想要合作，欢迎通过以下方式联系我：
              </p>
            </section>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">邮箱</h3>
                  <p className="text-gray-600 dark:text-gray-300">your.email@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐙</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">GitHub</h3>
                  <p className="text-gray-600 dark:text-gray-300">github.com/yourusername</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">LinkedIn</h3>
                  <p className="text-gray-600 dark:text-gray-300">linkedin.com/in/yourprofile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}




