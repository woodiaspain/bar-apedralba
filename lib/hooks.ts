'use client'

import { useEffect, useState } from 'react'

/** Returns true when the viewport width is ≤ 768px (mobile/tablet).
 *  Returns false on the server (SSR-safe). */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}
