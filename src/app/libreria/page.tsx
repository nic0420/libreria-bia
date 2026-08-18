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

  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category || "Otros";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const sortedCategories = Object.keys(productsByCategory).sort();

  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        
        {/* Breadcrumb */}
        <nav className="flex text-[11px] text-zinc-400 mb-6 font-medium">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 mt-0.5" />
          <span className="text-zinc-700">Catálogo</span>
        </nav>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Catálogo de Productos</h1>
          <p className="text-xs text-zinc-400 mt-1">
            {products.length} productos disponibles
          </p>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100">
            <h3 className="text-base font-semibold text-zinc-800">No hay productos disponibles</h3>
            <p className="text-xs text-zinc-400 mt-1">Vuelve más tarde para ver las novedades.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedCategories.map((category) => (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center justify-between mb-5 border-b border-zinc-200 pb-2">
                  <h2 className="text-lg font-bold text-zinc-900 flex items-center">
                    {category}
                    <span className="ml-3 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] rounded-full font-semibold">
                      {productsByCategory[category].length}
                    </span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
