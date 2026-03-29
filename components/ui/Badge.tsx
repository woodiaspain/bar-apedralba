import type { ReactNode } from 'react'

type BadgeVariant = 'takeaway' | 'available' | 'soldout'

const variantStyles: Record<BadgeVariant, string> = {
  takeaway: 'bg-brand-earth/15 text-brand-earth border border-brand-earth/30',
  available: 'bg-brand-medium/15 text-brand-medium border border-brand-medium/30',
  soldout: 'bg-red-100 text-red-700 border border-red-200',
}

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  )
}
