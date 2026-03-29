'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

interface Pizza {
  nombre: string
  descripcion: string
  precio: number
}

interface AnimatedPizzaGridProps {
  pizzas: readonly Pizza[]
}

function formatPizzaPrice(precio: number): string {
  return precio % 1 === 0
    ? `${precio} €`
    : `${precio.toFixed(2).replace('.', ',')} €`
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export default function AnimatedPizzaGrid({ pizzas }: AnimatedPizzaGridProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={prefersReduced ? {} : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {pizzas.map((pizza) => (
        <motion.article
          key={pizza.nombre}
          variants={prefersReduced ? {} : cardVariants}
          whileHover={prefersReduced ? {} : { y: -4, transition: { type: 'spring', stiffness: 320, damping: 20 } }}
          className="group flex flex-col rounded-xl border border-brand-earth/15 bg-white p-5 shadow-sm hover:shadow-md"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold text-brand-dark transition-colors group-hover:text-brand-medium">
              {pizza.nombre}
            </h3>
            <motion.span
              className="shrink-0 font-serif text-lg font-bold text-brand-earth"
              whileHover={prefersReduced ? {} : { scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {formatPizzaPrice(pizza.precio)}
            </motion.span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">{pizza.descripcion}</p>
        </motion.article>
      ))}
    </motion.div>
  )
}
