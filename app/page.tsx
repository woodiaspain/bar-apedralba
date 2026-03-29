import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
import HeroSection from '@/components/sections/HeroSection'
import SobreNosotros from '@/components/sections/SobreNosotros'
import MenuDiaSection from '@/components/sections/MenuDiaSection'
import PizzasSection from '@/components/sections/PizzasSection'
import PaellasSection from '@/components/sections/PaellasSection'
import UbicacionSection from '@/components/sections/UbicacionSection'
import SkeletonCard from '@/components/ui/SkeletonCard'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SobreNosotros />
      <Suspense
        fallback={
          <section className="bg-brand-offwhite py-20 sm:py-28">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <SkeletonCard lines={5} />
            </div>
          </section>
        }
      >
        <MenuDiaSection />
      </Suspense>
      <PizzasSection />
      <Suspense
        fallback={
          <section className="bg-brand-dark py-20 sm:py-28">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <SkeletonCard lines={3} />
            </div>
          </section>
        }
      >
        <PaellasSection />
      </Suspense>
      <UbicacionSection />
    </main>
  )
}
