'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.25 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion()
  const [showScroll, setShowScroll] = useState(true)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], ['0%', '20%'])

  useEffect(() => {
    return scrollY.on('change', (y) => setShowScroll(y < 80))
  }, [scrollY])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-dark">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-[-10%]"
        style={prefersReduced ? {} : { y: bgY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1502819126416-d387f86d47a1?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ambiente del Bar A Pedralba"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay verde oscuro */}
      <div className="absolute inset-0 bg-brand-dark/55" />

      {/* Overlay degradado hacia abajo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark/60" />

      {/* Contenido con stagger */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        variants={prefersReduced ? {} : containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={prefersReduced ? {} : itemVariants}
          className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-brand-earth"
        >
          Club de Tenis A Pedralba · Bergondo
        </motion.p>

        <motion.h1
          variants={prefersReduced ? {} : itemVariants}
          className="mb-6 font-serif text-5xl font-bold text-brand-cream drop-shadow-sm sm:text-6xl lg:text-7xl"
        >
          Bar A Pedralba
        </motion.h1>

        <motion.p
          variants={prefersReduced ? {} : itemVariants}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-brand-cream/70 sm:text-xl"
        >
          Pizzería artesana, paellas de fin de semana y menú del día.
          <br className="hidden sm:block" />
          El punto de encuentro del club.
        </motion.p>

        <motion.div
          variants={prefersReduced ? {} : itemVariants}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.a
            href="#menu-del-dia"
            whileHover={prefersReduced ? {} : { scale: 1.04 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 20 }}
            className="rounded-full bg-brand-earth px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-earth/90 hover:shadow-xl"
          >
            Ver menú del día
          </motion.a>
          <motion.a
            href="#pizzas"
            whileHover={prefersReduced ? {} : { scale: 1.04 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 20 }}
            className="rounded-full border border-brand-cream/30 px-8 py-3.5 text-sm font-semibold text-brand-cream/90 backdrop-blur-sm hover:border-brand-cream/60 hover:text-brand-cream"
          >
            Nuestras pizzas
          </motion.a>
        </motion.div>

        {/* Horario rápido */}
        <motion.div
          variants={prefersReduced ? {} : itemVariants}
          className="mt-16 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-8"
        >
          <div className="flex items-center gap-2 text-sm text-brand-cream/50">
            <span className="h-px w-8 bg-brand-earth/50" />
            <span>L–V: 16:00 – 23:00</span>
          </div>
          <div className="hidden h-4 w-px bg-brand-cream/20 sm:block" />
          <div className="flex items-center gap-2 text-sm text-brand-cream/50">
            <span>S–D: 10:00 – 24:00</span>
            <span className="h-px w-8 bg-brand-earth/50" />
          </div>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll — desaparece al hacer scroll */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <a
              href="#sobre-nosotros"
              className="flex flex-col items-center gap-1 text-brand-cream/30 transition-colors hover:text-brand-cream/60"
              aria-label="Desplazarse hacia abajo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 animate-bounce"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
