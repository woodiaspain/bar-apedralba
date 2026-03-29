import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: ReactNode
  className?: string
  light?: boolean
}

export default function SectionTitle({ children, className, light = false }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        'font-serif text-3xl font-bold md:text-4xl',
        light ? 'text-brand-cream' : 'text-brand-dark',
        className,
      )}
    >
      {children}
    </h2>
  )
}
