'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useIsMobile } from '@/lib/hooks'

type Variant = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fadeIn'

const variants: Record<Variant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  variant?: Variant
  delay?: number
  className?: string
}

export default function AnimatedSection({
  children,
  variant = 'fadeUp',
  delay = 0,
  className,
}: AnimatedSectionProps) {
  const prefersReduced = useReducedMotion()
  const isMobile = useIsMobile()

  // On mobile or reduced-motion: skip animation, render plain div
  if (prefersReduced || isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px' }}
      variants={variants[variant]}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
