"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
      stock: product.stock,
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100">
      
      {/* Imagen del producto */}
      <Link href={`/producto/${product.id}`} className="relative aspect-square overflow-hidden bg-blue-50/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge SIN STOCK */}
        {outOfStock && (
          <div className="absolute top-2 left-2 bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Sin Stock
          </div>
        )}

        {/* Badge de descuento */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-rose-400 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            Oferta
          </div>
        )}

        {/* Overlay de acciones al hacer hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-900/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Link
              href={`/producto/${product.id}`}
              className="bg-white hover:bg-blue-50 text-blue-700 p-2.5 rounded-lg shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5" /> Ver detalle
            </Link>
            {!outOfStock && (
              <button
                onClick={handleAddToCart}
                className={`p-2.5 rounded-lg shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${added ? 'bg-emerald-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                {added ? '¡Agregado!' : 'Comprar'}
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Info del producto */}
      <div className="p-3 flex flex-col gap-1.5">
        <Link href={`/producto/${product.id}`}>
          <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug hover:text-zinc-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            {product.category}
          </span>
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-zinc-900">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Botón Comprar siempre visible en mobile */}
        {!outOfStock && (
          <button
            onClick={handleAddToCart}
            className={`w-full mt-2 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 lg:hidden ${added ? 'bg-emerald-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? '¡Agregado!' : 'Comprar'}
          </button>
        )}
      </div>
    </div>
  );
}
