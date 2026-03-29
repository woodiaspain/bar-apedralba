'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Menú del día', href: '#menu-del-dia' },
  { label: 'Pizzas', href: '#pizzas' },
  { label: 'Paellas', href: '#paellas' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 bg-brand-dark/95 transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-brand-dark/40 backdrop-blur-md' : 'backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Club de Tenis A Pedralba"
            width={48}
            height={48}
            className="rounded-full"
            priority
          />
          <span className="font-serif text-lg font-semibold tracking-wide text-brand-cream">
            Bar A Pedralba
          </span>
        </div>

        <nav className="hidden gap-6 sm:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="nav-underline text-sm text-brand-cream/80 transition-colors hover:text-brand-cream"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
