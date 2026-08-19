import { getProductById as getDbProductById, createTable } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  let product = null;
  try {
    await createTable();
    product = await getDbProductById(id);
  } catch (e) {
    console.log("No DB configured");
  }

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

  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null;
  const outOfStock = product.stock <= 0;

  const WHATSAPP_NUMBER = "5493794012485";
  const whatsappMessage = encodeURIComponent(`Hola! Me interesa el producto: ${product.name} - ${formatPrice(price)}. ¿Está disponible?`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-blue-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <nav className="flex text-[11px] text-blue-400 mb-6 font-medium">
          <Link href="/" className="hover:text-blue-700 transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 mt-0.5" />
          <Link href="/libreria" className="hover:text-blue-700 transition-colors">Catálogo</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 mt-0.5" />
          <span className="text-blue-700 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Imagen del Producto - Grande y centrada */}
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-blue-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              priority
            />
            {outOfStock && (
              <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                Sin Stock
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-rose-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Oferta
              </div>
            )}
          </div>

          {/* Detalles del Producto */}
          <div className="flex flex-col">
            {/* Categoría */}
            {product.category && (
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">
                {product.category}
              </span>
            )}
            
            {/* Nombre */}
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 leading-tight">
              {product.name}
            </h1>

            {/* Precio */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-700">
                {formatPrice(price)}
              </span>
              {hasDiscount && (
                <span className="text-base text-blue-300 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mt-4">
              {outOfStock ? (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                  Sin stock disponible
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  Stock disponible: {product.stock} unidades
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="mt-6 pt-6 border-t border-blue-100">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Descripción</h3>
                <p className="text-sm text-blue-900/70 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Código */}
            <div className="mt-4 pt-4 border-t border-blue-100">
              <span className="text-[11px] text-blue-400">
                Código: <span className="text-blue-700 font-medium">{product.id}</span>
              </span>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-col gap-3">
              {!outOfStock && <AddToCartButton product={product} />}
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar por WhatsApp
              </a>
            </div>

            {/* Info de entrega */}
            <div className="mt-6 pt-6 border-t border-blue-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm">🚚</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-900">Envío a coordinar</p>
                  <p className="text-[11px] text-blue-400">Se coordina por WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm">🏪</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-900">Retiro en local</p>
                  <p className="text-[11px] text-blue-400">Barrio San Roque Este</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm">💳</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-900">Transferencia / Efectivo</p>
                  <p className="text-[11px] text-blue-400">Aceptamos todos los medios de pago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
