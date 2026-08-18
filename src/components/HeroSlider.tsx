import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 text-center lg:py-24">
          <span className="mb-4 inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold tracking-wider text-zinc-300 uppercase border border-zinc-700">
            Librería Bia
          </span>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Útiles, papelería y artículos de oficina
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            Explora nuestro catálogo completo con envíos y retiros coordinados directamente por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/libreria"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-md transition-all hover:bg-zinc-200"
            >
              Ver Catálogo Completo
            </Link>
            <Link
              href="#novedades"
              className="group flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
            >
              Destacados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
