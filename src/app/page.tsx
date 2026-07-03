import { getProducts as getSheetProducts } from "@/lib/google-sheets";
import { getProducts as getDbProducts, createTable, Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import BrandsMarquee from "@/components/BrandsMarquee";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  let products: Product[] = [];
  try {
    // Attempt to load from Postgres Database first
    await createTable();
    products = await getDbProducts();
  } catch (e) {
    console.log("No DB configured, falling back to Google Sheets");
  }

  // If DB is empty or not configured, fallback to original logic
  if (products.length === 0) {
    products = await getSheetProducts();
  }

  return (
    <div className="flex flex-col bg-zinc-50">
      <HeroSlider />
      <BrandsMarquee />

      {/* Categoría Dinámica: Destacados / Novedades */}
      <section id="novedades" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between border-b pb-4 border-zinc-200">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-primary-800">
              Novedades
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Lo último en tendencias de librería ha llegado.
            </p>
          </div>
          <Link href="/libreria" className="hidden sm:flex group items-center gap-1 text-sm font-semibold text-secondary-500 hover:text-secondary-600 transition-colors">
            Ver Todo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Scrollable Container replacing the static wrap grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-500">No hay productos disponibles por el momento.</p>
          </div>
        ) : (
          <div className="flex w-full gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar">
            {products.map((product) => (
              <div key={product.id} className="min-w-[280px] max-w-[320px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Banner secundario de Promoción (al estilo Woopy) */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[300px] w-full flex-col items-start justify-center overflow-hidden rounded-3xl bg-primary-600 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-3xl font-bold tracking-tight text-white mb-4">
              Equipá tu oficina al completo
            </h3>
            <p className="text-primary-100 mb-8">
              En Librería Bia tenemos los mejores combos y descuentos exclusivos por cantidad para papelería comercial.
            </p>
            <Link href="/contacto" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-600 shadow-sm transition hover:bg-secondary-400 hover:text-zinc-900">
              Pedir Presupuesto
            </Link>
          </div>
          {/* Decorative element replacing image */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-secondary-400/20 blur-3xl lg:relative lg:mr-0 lg:mt-0"></div>
        </div>
      </section>
    </div>
  );
}
