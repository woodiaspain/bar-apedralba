import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'

export default function SobreNosotros() {
  return (
    <section id="sobre-nosotros" className="bg-brand-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Texto */}
          <div className="animate-fade-in-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
              Quiénes somos
            </p>
            <SectionTitle className="mb-6">
              El bar del club,<br />para toda la familia
            </SectionTitle>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Llevamos años siendo el punto de encuentro del Club de Tenis A Pedralba en
                Bergondo. Un lugar donde los socios del club, sus familias y los vecinos de la
                zona comparten mesa después del partido, el entrenamiento o simplemente para
                disfrutar de una buena comida.
              </p>
              <p>
                Ofrecemos pizzas artesanas hechas en horno de leña, menú del día de cocina
                tradicional gallega y paellas los fines de semana. Todo con productos frescos
                y de temporada.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+34981794488"
                className="flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M2.25 6.338c0 9.17 7.418 16.588 16.587 16.588l.023-.001c1.218-.012 2.27-.848 2.545-2.04l.586-2.556a2.25 2.25 0 00-1.286-2.585l-2.637-1.098a2.25 2.25 0 00-2.627.73l-.543.815a14.093 14.093 0 01-6.303-6.305l.815-.543a2.25 2.25 0 00.73-2.626L9.04 4.178a2.25 2.25 0 00-2.584-1.286l-2.556.586a2.248 2.248 0 00-2.04 2.543c-.015.245-.022.49-.022.736v.581z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                +34 981 794 488
              </a>
              <a
                href="https://www.instagram.com/bar_apedralba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-brand-earth/40 px-6 py-3 text-sm font-semibold text-brand-earth transition-colors hover:border-brand-earth hover:bg-brand-earth/5"
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
            </div>
          </div>

          {/* Foto decorativa + Horarios */}
          <div className="animate-fade-in-right delay-150 flex flex-col gap-6">
            {/* Foto */}
            <div className="relative h-56 overflow-hidden rounded-2xl shadow-lg sm:h-64">
              <Image
                src="/paella.png"
                alt="Paella del Bar A Pedralba"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Horarios */}
            <div className="rounded-2xl bg-brand-dark p-8 text-brand-cream shadow-xl">
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-brand-earth">
                Horario de apertura
              </p>

              <dl className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-brand-medium/30 pb-4">
                  <dt className="text-brand-cream/70">
                    <div className="font-medium text-brand-cream">Lunes – Viernes</div>
                    <div className="text-sm text-brand-cream/50">Tardes y noches</div>
                  </dt>
                  <dd className="whitespace-nowrap font-serif text-xl font-semibold text-brand-cream">
                    16:00 – 23:00
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-brand-cream/70">
                    <div className="font-medium text-brand-cream">Sábados y Domingos</div>
                    <div className="text-sm text-brand-cream/50">Mediodía y noche</div>
                  </dt>
                  <dd className="whitespace-nowrap font-serif text-xl font-semibold text-brand-cream">
                    10:00 – 24:00
                  </dd>
                </div>
              </dl>

              <div className="mt-8 rounded-xl border border-brand-medium/30 bg-brand-medium/20 p-4">
                <p className="text-sm text-brand-cream/60">
                  📍 Covas, s/n, 15165 Pedralba, A Coruña
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
