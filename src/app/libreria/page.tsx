import { getProducts as getSheetProducts } from "@/lib/google-sheets";
import { getProducts as getDbProducts, createTable, Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function LibreriaPage() {
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

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category || "Otros";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Sort categories alphabetically
  const sortedCategories = Object.keys(productsByCategory).sort();

  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen pb-20">
      
      {/* Header Banner */}
      <div className="bg-primary-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Catálogo de Librería</h1>
          <p className="mt-2 text-primary-100 max-w-2xl text-lg">
            Explora todos nuestros productos ordenados por categoría. Encuentra exactamente lo que necesitas para tu oficina, colegio o creatividad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-zinc-500 mb-8 font-medium">
          <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-zinc-400 mt-0.5" />
          <span className="text-zinc-900">Librería</span>
        </nav>

        {sortedCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-800">No hay productos disponibles</h3>
            <p className="text-zinc-500 mt-2">Vuelve más tarde para descubrir nuestras novedades.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sortedCategories.map((category) => (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center justify-between mb-6 border-b border-zinc-200 pb-3">
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center">
                    {category}
                    <span className="ml-4 px-3 py-1 bg-zinc-100 text-zinc-600 text-sm rounded-full font-semibold">
                      {productsByCategory[category].length}
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productsByCategory[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
