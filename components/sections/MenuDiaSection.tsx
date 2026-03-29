import SectionTitle from '@/components/ui/SectionTitle'
import { getMenuDelDia } from '@/lib/queries'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function MenuDiaSection() {
  const menu = await getMenuDelDia()

  return (
    <section id="menu-del-dia" className="bg-brand-offwhite py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
            Hoy en el bar
          </p>
          <SectionTitle>Menú del día</SectionTitle>
        </div>

        {menu ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-brand-earth/10">
            {/* Cabecera */}
            <div className="bg-brand-dark px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-brand-earth">
                    Menú del día
                  </p>
                  <p className="mt-0.5 text-sm capitalize text-brand-cream/60">
                    {formatDate(menu.fecha)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-cream/50">Precio</p>
                  <p className="font-serif text-3xl font-bold text-brand-cream">
                    {formatPrice(menu.precio)}
                  </p>
                </div>
              </div>
            </div>

            {/* Platos */}
            <div className="divide-y divide-brand-earth/10">
              {/* Primeros */}
              <div className="px-6 py-6 sm:px-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-earth">
                  Primeros
                </h3>
                <ul className="space-y-2">
                  {menu.primeros.map((plato, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-earth/50" />
                      <span className="capitalize">{plato}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Segundos */}
              <div className="px-6 py-6 sm:px-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-earth">
                  Segundos
                </h3>
                <ul className="space-y-2">
                  {menu.segundos.map((plato, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-earth/50" />
                      <span className="capitalize">{plato}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Postre */}
              {menu.postre && (
                <div className="px-6 py-6 sm:px-8">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-earth">
                    Postre
                  </h3>
                  <p className="capitalize text-gray-700">{menu.postre}</p>
                </div>
              )}
            </div>

            {/* Nota */}
            <div className="bg-brand-cream/50 px-6 py-4 sm:px-8">
              <p className="text-xs text-gray-500">
                El menú incluye primero, segundo, postre y bebida. Sujeto a disponibilidad.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-earth/20 bg-white px-8 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-earth/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-brand-earth"
                aria-hidden="true"
              >
                <path
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-serif text-xl font-semibold text-brand-dark">
              Menú no disponible
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              El menú de hoy aún no está publicado.
              <br />
              Consúltanos por teléfono o en nuestro Instagram.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="tel:+34981794488"
                className="rounded-full bg-brand-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-medium"
              >
                Llamar al bar
              </a>
              <a
                href="https://www.instagram.com/bar_apedralba"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-earth/40 px-6 py-2.5 text-sm font-semibold text-brand-earth transition-colors hover:bg-brand-earth/5"
              >
                Ver Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
