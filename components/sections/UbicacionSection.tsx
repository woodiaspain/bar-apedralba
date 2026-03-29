import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function UbicacionSection() {
  const mapsUrl = 'https://maps.google.com/maps?q=43.3089,-8.2156&z=16&output=embed'
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=43.3089,-8.2156'

  return (
    <section id="ubicacion" className="bg-brand-cream py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimatedSection variant="fadeIn">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
              Encuéntranos
            </p>
            <SectionTitle>¿Dónde estamos?</SectionTitle>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-md ring-1 ring-brand-earth/20">
            <div className="relative h-[280px] w-full sm:h-[400px]">
              <iframe
                src={mapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del Club de Tenis A Pedralba en Google Maps"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-brand-earth">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Club de Tenis A Pedralba, Bergondo, A Coruña
            </p>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-2.5 text-sm font-semibold text-brand-cream transition-all duration-200 hover:scale-[1.03] hover:bg-brand-medium"
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
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Cómo llegar
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
