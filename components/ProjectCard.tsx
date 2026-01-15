import { Project } from '@/types/portfolio'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl overflow-hidden h-full border-b border-gray-700 hover:border-b-cyan-500 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 group">
        {/* 霓虹边框效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* 预览图片 */}
        <div className="relative w-full h-52 overflow-hidden border-b border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <img
            src={project.preview}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          {/* 科技感装饰线条 */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6 relative z-10">
          {/* 项目标题 */}
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-400 transition-all duration-300 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            {project.title}
          </h3>
          
          {/* 项目描述 */}
          <p className="text-gray-300 dark:text-gray-300 mb-4 line-clamp-3 font-light leading-relaxed">
            {project.description}
          </p>
          
          {/* 标签 */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-gray-800/80 hover:bg-cyan-900/50 border border-gray-700 hover:border-cyan-500/50 text-cyan-300 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* 分类 */}
          {project.category && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-purple-500 rounded-full"></span>
              {project.category}
            </div>
          )}
          
          {/* 悬停时显示的箭头 */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 text-cyan-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  )
}

