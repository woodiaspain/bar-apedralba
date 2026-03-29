import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'
import Badge from '@/components/ui/Badge'
import { getPaellaHoy } from '@/lib/queries'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function PaellasSection() {
  const paella = await getPaellaHoy()

  if (!paella) {
    return (
      <section id="paellas" className="bg-brand-medium/10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-earth">
            Fin de semana
          </p>
          <SectionTitle className="mb-4">Paellas</SectionTitle>
          <p className="text-base text-gray-500">
            Las paellas se ofrecen los fines de semana cuando hay disponibilidad.
            <br />
            Consulta en Instagram o llámanos para informarte.
          </p>
        </div>
      </section>
    )
  }

  const soldOut = paella.plazas_disponibles !== null && paella.plazas_disponibles === 0
  const fewLeft =
    paella.plazas_disponibles !== null &&
    paella.plazas_disponibles > 0 &&
    paella.plazas_disponibles <= 5

  return (
    <section id="paellas" className="bg-brand-dark py-20 sm:py-28">
      {/* Banner fotográfico */}
      <div className="relative mx-auto mb-12 h-[200px] max-w-4xl overflow-hidden px-4 sm:px-6">
        <div className="relative h-full overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80"
            alt="Paella tradicional con mariscos y verduras"
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-brand-dark/40" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
            Hoy tenemos
          </p>
          <SectionTitle light>Paellas</SectionTitle>
        </div>

        <div className="overflow-hidden rounded-2xl bg-brand-medium/20 ring-1 ring-brand-earth/20">
          {/* Cabecera */}
          <div className="border-b border-brand-medium/30 px-6 py-5 sm:px-8">
            <p className="text-sm capitalize text-brand-cream/50">{formatDate(paella.fecha)}</p>
          </div>

          {/* Contenido */}
          <div className="px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold capitalize text-brand-cream sm:text-3xl">
                  {paella.tipo}
                </h3>

                {paella.hora_recogida && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-cream/60">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Recogida a las {paella.hora_recogida}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {soldOut ? (
                    <Badge variant="soldout">Sin plazas disponibles</Badge>
                  ) : fewLeft ? (
                    <Badge variant="available">
                      ¡Solo quedan {paella.plazas_disponibles} raciones!
                    </Badge>
                  ) : paella.plazas_disponibles !== null ? (
                    <Badge variant="available">
                      {paella.plazas_disponibles} raciones disponibles
                    </Badge>
                  ) : (
                    <span className="badge-pulse inline-flex items-center rounded-full bg-brand-medium/40 px-3 py-1 text-xs font-medium text-green-300 ring-1 ring-green-500/30">
                      Disponible hoy
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-widest text-brand-earth">
                  Precio por persona
                </p>
                <p className="font-serif text-4xl font-bold text-brand-cream">
                  {formatPrice(paella.precio)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-brand-medium/30 px-6 py-4 sm:px-8">
            <p className="text-xs text-brand-cream/40">
              Reserva tu ración llamando al{' '}
              <a
                href="tel:+34981794488"
                className="underline underline-offset-2 hover:text-brand-cream/70"
              >
                +34 981 794 488
              </a>{' '}
              o por Instagram.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
