'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

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

  return (
    <motion.ul
      className="space-y-2"
      variants={prefersReduced ? {} : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {items.map((plato, i) => (
        <motion.li
          key={i}
          variants={prefersReduced ? {} : itemVariants}
          className="flex items-start gap-2 text-gray-700"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-earth/50" />
          <span className="capitalize">{plato}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
