import { getProducts as getSheetProducts } from "@/lib/google-sheets";
import { getProducts as getDbProducts, createTable, Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  try {
    await createTable();
    products = await getDbProducts();
  } catch (e) {
    console.log("No DB configured, falling back to Google Sheets");
  }

  if (products.length === 0) {
    products = await getSheetProducts();
  }

  // First 12 products for the carousel
  const carouselProducts = products.slice(0, 12);
  // Next 8 for featured
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="flex flex-col bg-blue-50/40">
      <HeroSlider />

      {/* Carrusel automático de productos */}
      {carouselProducts.length > 0 && (
        <section className="w-full overflow-hidden bg-white border-b border-blue-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Lo más buscado</h2>
          </div>
          <div className="relative">
            <div className="flex animate-scroll gap-4 px-4 w-max">
              {[...carouselProducts, ...carouselProducts].map((product, idx) => (
                <div key={`carousel-${product.id}-${idx}`} className="w-[200px] shrink-0">
                  <Link href={`/producto/${product.id}`} className="block group">
                    <div className="relative aspect-square bg-blue-50/50 rounded-xl overflow-hidden border border-blue-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 px-1">
                      <h3 className="text-xs font-medium text-blue-900/80 line-clamp-2 leading-snug">{product.name}</h3>
                      <p className="text-sm font-bold text-blue-700 mt-1">
                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.discountPrice || product.price)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos los productos */}
      <section id="novedades" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-blue-200 pb-3">
          <h2 className="text-2xl font-bold tracking-tight text-blue-800">
            Todos los productos
          </h2>
          <Link href="/libreria" className="hidden sm:flex group items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
            Ver todo <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-blue-400">No hay productos disponibles por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
