import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-primary-600">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -left-1/4 top-0 h-full w-1/2 bg-gradient-to-r from-secondary-500 to-transparent blur-3xl"></div>
        <div className="absolute -right-1/4 bottom-0 h-full w-1/2 bg-gradient-to-l from-secondary-400 to-transparent blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center lg:py-32">
          {/* Main Copy */}
          <span className="mb-4 inline-flex items-center rounded-full bg-secondary-400/20 px-3 py-1 text-sm font-semibold text-secondary-300 ring-1 ring-inset ring-secondary-400/50">
            Novedades Exclusivas 2026
          </span>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Toda tu inspiración <br />
            <span className="text-secondary-400">en un solo lugar</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-100">
            Tenemos las mejores agendas, útiles y papelería comercial de Corrientes. Desliza hacia abajo y descubre nuestra selección premium.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#novedades"
              className="flex items-center gap-2 rounded-full bg-secondary-400 px-8 py-4 text-sm font-bold text-zinc-900 shadow-md transition-all hover:scale-105 hover:bg-secondary-500 hover:text-white"
            >
              Comprar Ahora
            </Link>
            <Link
              href="/ofertas"
              className="group flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-500"
            >
              Ver Promos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative slider indicators at bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        <div className="h-1.5 w-8 rounded-full bg-secondary-400"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
      </div>
    </section>
  );
}
