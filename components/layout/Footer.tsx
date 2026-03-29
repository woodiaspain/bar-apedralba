import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Footer() {
  return (
    <footer id="contacto" className="bg-brand-dark text-brand-cream/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <AnimatedSection variant="fadeIn">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Logo + descripción */}
            <div className="lg:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Club de Tenis A Pedralba"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <span className="font-serif text-base font-semibold text-brand-cream">
                  Bar A Pedralba
                </span>
              </div>
              <p className="text-sm leading-relaxed text-brand-cream/60">
                Pizzería & Bar del Club de Tenis A Pedralba. Bergondo, Galicia.
              </p>
            </div>

            {/* Horarios */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
                Horarios
              </h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-brand-cream/60">Lunes – Viernes</dt>
                  <dd className="font-medium text-brand-cream">16:00 – 23:00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-brand-cream/60">Sábados – Domingos</dt>
                  <dd className="font-medium text-brand-cream">10:00 – 24:00</dd>
                </div>
              </dl>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
                Contacto
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="tel:+34981794488"
                    className="text-brand-cream/80 transition-colors hover:text-brand-cream"
                  >
                    +34 981 794 488
                  </a>
                </li>
                <li className="text-brand-cream/60">Bergondo, A Coruña, Galicia</li>
              </ul>
            </div>

            {/* Redes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
                Síguenos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.instagram.com/bar_apedralba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-cream/80 transition-colors hover:text-brand-cream"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                    @bar_apedralba
                  </a>
                </li>
                <li>
                  <a
                    href="https://tenisapedralba.es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cream/80 transition-colors hover:text-brand-cream"
                  >
                    Club de Tenis A Pedralba
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-brand-medium/30 pt-6 text-center text-xs text-brand-cream/40">
            © {new Date().getFullYear()} Bar A Pedralba · Club de Tenis A Pedralba · Bergondo
          </div>
        </AnimatedSection>
      </div>
    </footer>
  )
}
