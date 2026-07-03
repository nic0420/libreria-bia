import { getProducts as getSheetProducts } from "@/lib/google-sheets";
import { getProducts as getDbProducts, createTable, Product } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronRight, Truck, ShieldCheck, Heart } from "lucide-react";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
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

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-zinc-500 mb-8 font-medium">
          <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-zinc-400 mt-0.5" />
          <Link href="/libreria" className="hover:text-primary-600 transition-colors">Librería</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-zinc-400 mt-0.5" />
          <span className="text-zinc-900 truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            
            {/* Imagen del Producto */}
            <div className="relative aspect-square bg-zinc-100 rounded-2xl overflow-hidden group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <button className="absolute top-4 right-4 h-12 w-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors shadow-sm">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Detalles del Producto */}
            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="px-3 py-1 bg-secondary-100 text-secondary-800 text-xs font-bold rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-4">
                {product.name}
              </h1>
              
              <p className="mt-4 text-4xl font-black text-primary-600">
                {formatPrice(product.price)}
              </p>

              <div className="mt-6 prose prose-zinc text-zinc-600">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-zinc-700">Disponibilidad:</span>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center h-14 rounded-full font-bold text-lg transition-all shadow-md ${product.stock > 0 ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <Truck className="w-8 h-8 text-secondary-500" />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Envío Rápido</h4>
                    <p className="text-xs text-zinc-500">A todo el país</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <ShieldCheck className="w-8 h-8 text-secondary-500" />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Compra Segura</h4>
                    <p className="text-xs text-zinc-500">Garantía total</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
