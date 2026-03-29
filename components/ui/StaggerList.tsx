'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useIsMobile } from '@/lib/hooks'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

interface StaggerListProps {
  items: string[]
}

export default function StaggerList({ items }: StaggerListProps) {
  const prefersReduced = useReducedMotion()
  const isMobile = useIsMobile()
  const shouldAnimate = !prefersReduced && !isMobile

  return (
    <motion.ul
      className="space-y-2"
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={{ once: true, margin: '0px' }}
    >
      {items.map((plato, i) => (
        <motion.li
          key={i}
          variants={shouldAnimate ? itemVariants : {}}
          className="flex items-start gap-2 text-gray-700"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-earth/50" />
          <span className="capitalize">{plato}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
