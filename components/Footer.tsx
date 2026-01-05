import BeianBadge from './BeianBadge'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} 我的作品集. All rights reserved.
          </p>
          
          <BeianBadge />
        </div>
      </div>
    </footer>
  )
}
