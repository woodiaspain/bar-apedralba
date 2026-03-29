import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-brand-dark">
      {/* Foto de fondo */}
      <Image
        src="https://images.unsplash.com/photo-1502819126416-d387f86d47a1?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Ambiente del Bar A Pedralba"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay verde oscuro */}
      <div className="absolute inset-0 bg-brand-dark/55" />

      {/* Overlay degradado hacia abajo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark/60" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="animate-fade-up mb-4 text-sm font-medium uppercase tracking-[0.25em] text-white">
          Club de Tenis A Pedralba · Bergondo
        </p>

        <h1 className="animate-fade-up delay-150 mb-6 font-serif text-5xl font-bold text-brand-cream drop-shadow-sm sm:text-6xl lg:text-7xl">
          Bar A Pedralba
        </h1>

        <p className="animate-fade-up delay-300 mx-auto mb-10 max-w-xl text-lg leading-relaxed text-brand-cream/70 sm:text-xl">
          Pizzería artesana, paellas de fin de semana y menú del día.
          <br className="hidden sm:block" />
          El punto de encuentro del club.
        </p>

        <div className="animate-fade-up delay-450 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#menu-del-dia"
            className="rounded-full bg-brand-earth px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-earth/90 hover:shadow-xl active:scale-95"
          >
            Ver menú del día
          </a>
          <a
            href="#pizzas"
            className="rounded-full border border-brand-cream/30 px-8 py-3.5 text-sm font-semibold text-brand-cream/90 backdrop-blur-sm transition-all hover:border-brand-cream/60 hover:text-brand-cream active:scale-95"
          >
            Nuestras pizzas
          </a>
        </div>

        {/* Horario rápido */}
        <div className="animate-fade-up delay-600 mt-16 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-brand-cream/50">
            <span className="h-px w-8 bg-brand-earth/50" />
            <span>L–V: 16:00 – 23:00</span>
          </div>
          <div className="hidden h-4 w-px bg-brand-cream/20 sm:block" />
          <div className="flex items-center gap-2 text-sm text-brand-cream/50">
            <span>S–D: 10:00 – 24:00</span>
            <span className="h-px w-8 bg-brand-earth/50" />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
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
      </div>
    </section>
  )
}
