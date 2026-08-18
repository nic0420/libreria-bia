import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, ChevronDown } from "lucide-react";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="w-full flex-col font-sans sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Minimalista */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
              <Image src="/logo.jpg" alt="Logo Librería Bia" fill className="object-cover" />
            </div>
            <span className="text-xl tracking-tight font-bold text-zinc-900">
              Librería Bia
            </span>
          </Link>
        </div>

        {/* Buscador minimalista */}
        <div className="hidden flex-1 px-8 lg:flex justify-center max-w-xl">
          <div className="flex w-full items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors focus-within:border-zinc-400 focus-within:bg-white">
            <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar productos en la librería..."
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/libreria" className="hidden sm:inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Catálogo
          </Link>
          <Link href="/admin" className="hidden sm:inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Admin
          </Link>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
