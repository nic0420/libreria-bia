import Link from "next/link";
import { ArrowUpRight, Camera, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#e7e5e4] bg-[#1c1917] text-[#faf8f6]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm"><p className="text-2xl font-semibold tracking-tight">Librería Bia<span className="text-[#ff8265]">.</span></p><p className="mt-4 text-sm leading-6 text-[#a8a29d]">Un espacio para encontrar los objetos que acompañan tus ideas, tus proyectos y tus días.</p></div>
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3"><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716f]">Explorar</p><div className="flex flex-col gap-3 text-sm text-[#d6d3d1]"><Link href="/" className="hover:text-[#ff8265]">Inicio</Link><Link href="/libreria" className="hover:text-[#ff8265]">Catálogo</Link><Link href="/#novedades" className="hover:text-[#ff8265]">Novedades</Link></div></div><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716f]">Contacto</p><div className="flex flex-col gap-3 text-sm text-[#d6d3d1]"><span className="flex gap-2"><MapPin className="size-4 text-[#ff8265]" /> Corrientes</span><span className="flex gap-2"><Phone className="size-4 text-[#ff8265]" /> +54 9 379 401-2485</span></div></div><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716f]">Seguinos</p><Link href="#" className="inline-flex items-center gap-2 text-sm text-[#d6d3d1] hover:text-[#ff8265]"><Camera className="size-4" /> Instagram <ArrowUpRight className="size-3" /></Link></div></div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-[#44403c] pt-5 text-xs text-[#78716f] sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Librería Bia</span><span>Hecho para crear cosas lindas.</span></div>
      </div>
    </footer>
  );
}
