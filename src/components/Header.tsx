"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, Sparkles } from "lucide-react";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e5e4]/80 bg-[#faf8f6]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Librería Bia, inicio">
          <div className="relative size-10 overflow-hidden rounded-2xl bg-[#ff8265] shadow-[0_8px_20px_rgba(255,130,101,0.25)] transition-transform group-hover:-rotate-3">
            <Image src="/logo.jpg" alt="Logo Librería Bia" fill className="object-cover mix-blend-multiply" />
          </div>
          <div className="hidden sm:block">
            <span className="block font-semibold tracking-tight text-[#1c1917]">Librería Bia</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#a68d76]">Ideas en movimiento</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          <Link href="/" className="text-sm font-medium text-[#57534e] transition-colors hover:text-[#ff6b4a]">Inicio</Link>
          <Link href="/libreria" className="text-sm font-medium text-[#57534e] transition-colors hover:text-[#ff6b4a]">Catálogo</Link>
          <Link href="/#novedades" className="text-sm font-medium text-[#57534e] transition-colors hover:text-[#ff6b4a]">Novedades</Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-[#e7e5e4] bg-white px-3 py-2 lg:flex">
            <Search className="mr-2 size-4 text-[#a8a29d]" aria-hidden="true" />
            <input aria-label="Buscar productos" placeholder="Buscar productos" disabled className="w-32 bg-transparent text-xs outline-none placeholder:text-[#a8a29d]" />
          </div>
          <Link href="/admin" className="hidden rounded-full p-2.5 text-[#57534e] transition-colors hover:bg-[#f5f1ec] hover:text-[#ff6b4a] sm:block" aria-label="Administración">
            <Sparkles className="size-4" />
          </Link>
          <CartIcon />
          <button className="rounded-full p-2.5 text-[#57534e] hover:bg-[#f5f1ec] md:hidden" aria-label="Abrir menú">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
