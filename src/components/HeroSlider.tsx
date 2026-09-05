import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function HeroSlider() {
  return (
    <section className="overflow-hidden border-b border-[#e7e5e4] bg-[#f5f1ec]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6d3d1] bg-[#faf8f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6f57]">
            <Sparkles className="size-3.5 text-[#ff6b4a]" /> Tu lugar para crear
          </div>
          <h1 className="max-w-2xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#1c1917] sm:text-7xl">
            Todo lo que necesitás para hacer <span className="text-[#ff6b4a]">real</span> una idea.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-[#57534e] sm:text-lg">
            Papelería, útiles y pequeños objetos que convierten una mesa vacía en el comienzo de algo nuevo.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/libreria" className="group inline-flex items-center gap-2 rounded-full bg-[#ff6b4a] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,107,74,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#e8572f]">
              Explorar catálogo <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="#novedades" className="rounded-full px-5 py-3 text-sm font-semibold text-[#57534e] transition-colors hover:bg-[#faf8f6] hover:text-[#1c1917]">Ver destacados</Link>
          </div>
        </div>
        <div className="relative min-h-[280px] md:min-h-[390px]">
          <div className="absolute right-0 top-4 h-64 w-[78%] rotate-3 rounded-[2rem] bg-[#ff8265] shadow-2xl shadow-[#ff8265]/20 md:h-80" />
          <div className="absolute bottom-0 left-0 flex h-64 w-[78%] -rotate-6 flex-col justify-between rounded-[2rem] bg-[#274844] p-7 text-[#f6faf8] shadow-2xl shadow-[#274844]/20 md:h-80">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#c9ddd2]"><span>BIA / 2026</span><span>01</span></div>
            <div><p className="text-4xl font-semibold leading-none tracking-[-0.06em] md:text-5xl">Elegí<br />inspirarte.</p><p className="mt-4 text-xs text-[#c9ddd2]">Objetos cotidianos,<br />ideas extraordinarias.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
