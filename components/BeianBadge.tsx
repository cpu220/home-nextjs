'use client'

import { BEIAN_CONFIG } from '@/app/const'
import { useEffect, useState } from 'react'

export default function BeianBadge() {
  const [showBeian, setShowBeian] = useState(false)

  useEffect(() => {
    const currentDomain = window.location.hostname
    const isAllowed = BEIAN_CONFIG.ALLOWED_DOMAINS.some(domain => 
      currentDomain === domain || currentDomain.endsWith(`.${domain}`)
    )
    const isLocalDev = currentDomain === 'localhost' || currentDomain === '127.0.0.1'
    setShowBeian((isAllowed || isLocalDev) && !!BEIAN_CONFIG.CODE_VALUE)
  }, [])

  if (!showBeian) {
    return null
  }

  return (
    <a
      href={`${BEIAN_CONFIG.URL_PREFIX}?code=${BEIAN_CONFIG.CODE_VALUE}`}
      rel="noreferrer"
      target="_blank"
      className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <img
      src="/home-static/logo/ba_icon.png"
      alt="公安备案图标"
      className="w-4 h-4"
      width="16"
      height="16"
    />
      {BEIAN_CONFIG.CODE_PREFIX}{BEIAN_CONFIG.CODE_VALUE}
    </a>
  )
}
