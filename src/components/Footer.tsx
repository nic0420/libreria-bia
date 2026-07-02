import Link from "next/link";
import { Smartphone, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-4 border-secondary-400 bg-primary-600 pt-12">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5 text-white">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                Librería Bia
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-primary-100">
              Tu espacio creativo. Encuentra los mejores artículos de librería, papelería y regalos con un toque único y especial.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="rounded-full bg-primary-500 p-2 text-white transition-colors hover:bg-secondary-500 hover:text-white"
              >
                <Smartphone className="h-5 w-5" />
                <span className="sr-only">Redes Sociales</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Enlaces</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#productos" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Ayuda</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/envios" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Envíos a domicilio
                </Link>
              </li>
              <li>
                <Link href="/puntos-de-encuentro" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Puntos de Encuentro
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-primary-100 transition-colors hover:text-secondary-300">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-100">
                <MapPin className="h-5 w-5 shrink-0 text-secondary-400" />
                <span>Corrientes Capital</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-100">
                <Phone className="h-5 w-5 shrink-0 text-secondary-400" />
                <span>+54 9 379 401-2485</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-100">
                <Mail className="h-5 w-5 shrink-0 text-secondary-400" />
                <span>libreria.bia@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-primary-500 py-6 sm:flex-row">
          <p className="text-sm text-primary-200">
            &copy; {new Date().getFullYear()} Librería Bia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
