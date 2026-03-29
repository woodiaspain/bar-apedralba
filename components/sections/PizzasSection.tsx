import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import SectionTitle from '@/components/ui/SectionTitle'

const PIZZAS = [
  {
    nombre: 'Margarita',
    descripcion: 'Mozzarella, tomate y jamón',
    precio: 12,
  },
  {
    nombre: 'Peperoni',
    descripcion: 'Mozzarella, tomate y chorizo picante',
    precio: 13,
  },
  {
    nombre: 'Rúcula & Queso',
    descripcion: 'Mozzarella, tomate, queso de cabra y rúcula fresca',
    precio: 13.5,
  },
  {
    nombre: 'Cuatro Quesos',
    descripcion: 'Mozzarella, tomate, emmental, grana padano y queso del país',
    precio: 13,
  },
  {
    nombre: 'Pulpo',
    descripcion: 'Mozzarella, tomate, queso del país y pulpo',
    precio: 17,
  },
  {
    nombre: 'Pesto',
    descripcion: 'Mozzarella, tomate, pesto y mortadela',
    precio: 15,
  },
  {
    nombre: 'Barbacoa',
    descripcion: 'Mozzarella, tomate, pollo y salsa barbacoa',
    precio: 14,
  },
] as const

function formatPizzaPrice(precio: number): string {
  return precio % 1 === 0
    ? `${precio} €`
    : `${precio.toFixed(2).replace('.', ',')} €`
}

export default function PizzasSection() {
  return (
    <section id="pizzas" className="bg-brand-cream py-20 sm:py-28">
      {/* Banner fotográfico */}
      <div className="relative mx-auto mb-12 h-[200px] max-w-6xl overflow-hidden px-4 sm:px-6">
        <div className="relative h-full overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
            alt="Pizza artesana de cerca con ingredientes frescos"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-brand-dark/30" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-earth">
            Horno de leña
          </p>
          <SectionTitle>Pizzas artesanas</SectionTitle>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            Masa artesana de lenta fermentación, ingredientes frescos y horneadas al momento.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Badge variant="takeaway">También para llevar</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PIZZAS.map((pizza) => (
            <article
              key={pizza.nombre}
              className="card-hover group flex flex-col rounded-xl border border-brand-earth/15 bg-white p-5 shadow-sm"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-brand-dark transition-colors group-hover:text-brand-medium">
                  {pizza.nombre}
                </h3>
                <span className="shrink-0 font-serif text-lg font-bold text-brand-earth">
                  {formatPizzaPrice(pizza.precio)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">{pizza.descripcion}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Precios para consumir en el local o para llevar. IVA incluido.
        </p>
      </div>
    </section>
  )
}
