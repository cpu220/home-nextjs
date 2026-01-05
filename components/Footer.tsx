export default function Footer() {
  const beianCodeValue = process.env.NEXT_PUBLIC_BEIAN_CODE_VALUE
  const beianCodePrefix = process.env.NEXT_PUBLIC_BEIAN_CODE_PREFIX || ''
  const beianUrlPrefix = process.env.NEXT_PUBLIC_BEIAN_URL_PREFIX || 'https://beian.mps.gov.cn/#/query/webSearch'

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} 我的作品集. All rights reserved.
          </p>
          
          {beianCodeValue && (
            <a
              href={`${beianUrlPrefix}?code=${beianCodeValue}`}
              rel="noreferrer"
              target="_blank"
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <img 
                src="/ba_icon.png" 
                alt="公安备案图标" 
                className="w-4 h-4"
                width="16"
                height="16"
              />
              {beianCodePrefix}{beianCodeValue}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
