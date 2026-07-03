import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, LifeBuoy, Menu, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex-col font-sans">

      {/* Main Header Container */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-secondary-400 shadow-sm transition-transform hover:scale-105">
                <Image src="/logo.jpg" alt="Logo Librería Bia" fill className="object-cover" />
              </div>
              <span className="hidden sm:block text-3xl tracking-tight font-extrabold text-primary-600">
                Librería Bia
              </span>
            </Link>
          </div>

          {/* Search Bar (Centro ancho como en Woopy) */}
          <div className="hidden flex-1 px-8 lg:flex justify-center max-w-2xl">
            <div className="flex w-full items-center rounded-full border-2 border-primary-100 bg-zinc-50 px-4 py-2 transition-colors focus-within:border-primary-500 focus-within:bg-white focus-within:shadow-md">
              <input
                type="text"
                placeholder="¿Qué estás buscando? (Ej: Cuadernos, Agendas, Marcadores...)"
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              />
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-secondary-500">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 text-primary-600">
              <Menu className="h-6 w-6" />
            </button>

             {/* Help (Ayuda) - Only Desktop */}
             <Link href="/contacto" className="hidden lg:flex flex-col items-center justify-center gap-1 group text-zinc-500 hover:text-primary-600 transition-colors">
              <LifeBuoy className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-primary-600">Ayuda</span>
            </Link>

            {/* Account (Mi Cuenta) */}
            <Link href="/cuenta" className="hidden sm:flex flex-col items-center justify-center gap-1 group text-zinc-500 hover:text-primary-600 transition-colors">
              <User className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-primary-600">Cuenta</span>
            </Link>

            {/* Cart (Mi Carrito) */}
            <Link href="/carrito" className="relative flex flex-col items-center justify-center gap-1 group text-zinc-500 hover:text-primary-600 transition-colors cursor-pointer">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 group-hover:-translate-y-1 transition-transform text-primary-600" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-secondary-500 text-[10px] font-bold text-white shadow-sm">
                  0
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-primary-600 mt-1">Mi Carrito</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-4 lg:hidden">
          <div className="flex w-full items-center rounded-full border-2 border-primary-100 bg-zinc-50 px-4 py-2 focus-within:border-primary-500 focus-within:bg-white">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <Search className="h-5 w-5 text-primary-400" />
          </div>
        </div>
      </div>

      {/* Categories Nav (Debajo del header, estilo Woopy) */}
      <nav className="hidden lg:block border-b border-zinc-200 bg-primary-600 shadow-sm relative z-40">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-10 text-sm font-bold uppercase tracking-wide text-white">
            <li className="relative group/menu h-full flex items-center">
              <Link href="/novedades" className="flex items-center gap-1 hover:text-secondary-300 transition-colors">
                Novedades
              </Link>
            </li>
            <li className="relative group/menu h-full flex items-center">
              <Link href="/ofertas" className="flex items-center gap-1 text-secondary-300 hover:text-white transition-colors">
                Promos 📢
              </Link>
            </li>
            <li className="relative group/menu h-full flex items-center group cursor-pointer hover:text-secondary-300 transition-colors">
              <Link href="/libreria" className="flex items-center gap-1">
                Librería
              </Link>
            </li>
            <li className="relative group/menu h-full flex items-center cursor-pointer hover:text-secondary-300 transition-colors">
               <span className="flex items-center gap-1">
                Papelería Comercial <ChevronDown className="h-4 w-4" />
              </span>
            </li>
            <li className="relative group/menu h-full flex items-center">
              <Link href="/regalos" className="hover:text-secondary-300 transition-colors">
                Regalos
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
