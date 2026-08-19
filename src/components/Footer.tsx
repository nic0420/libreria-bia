import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 border-t border-blue-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Marca */}
          <div>
            <h3 className="text-base font-bold text-white">Librería Bia</h3>
            <p className="mt-2 text-xs text-blue-200 max-w-xs leading-relaxed">
              Útiles, papelería y artículos de oficina. Envíos y retiros coordinados por WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-xs text-blue-200 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/libreria" className="text-xs text-blue-200 hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-xs text-blue-200 hover:text-white transition-colors">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Contacto</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-xs text-blue-200">
                <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>Barrio San Roque Este, Corrientes</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-blue-200">
                <Phone className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>+54 9 379 401-2485</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-blue-200">
                <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>libreria.bia@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-blue-300">
            &copy; {new Date().getFullYear()} Librería Bia. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-blue-400">
            Aceptamos transferencia y efectivo
          </p>
        </div>
      </div>
    </footer>
  );
}
