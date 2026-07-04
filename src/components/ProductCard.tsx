"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Función para formatear precio en ARS
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/producto/${product.id}`} className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-primary-300">
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Etiqueta de categoría opcional */}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur-sm">
          {product.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Color variants bubbles simulation */}
        <div className="mt-2 flex gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
          <div className="h-3 w-3 rounded-full bg-secondary-400 ring-1 ring-zinc-200"></div>
          <div className="h-3 w-3 rounded-full bg-primary-400 ring-1 ring-zinc-200"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-300 ring-1 ring-zinc-200"></div>
          <span className="text-[10px] text-zinc-400 ml-1">+3</span>
        </div>

        <p className="mt-3 text-sm text-zinc-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="text-2xl font-black text-primary-600">
            {formatPrice(product.price)}
          </span>
          <button 
            onClick={(e) => { e.preventDefault(); /* Prevent link click */ alert('Añadido al carrito'); }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-all hover:scale-110 hover:bg-secondary-400 hover:text-white shadow-sm"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Agregar al carrito</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
