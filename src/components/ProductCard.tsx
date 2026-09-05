"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps { product: Product; }

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null;
  const outOfStock = product.stock <= 0;
  const formatPrice = (value: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (outOfStock) return;
    addItem({ id: product.id, name: product.name, price, image: product.image, stock: product.stock, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group flex flex-col gap-3">
      <Link href={`/producto/${product.id}`} className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#f5f1ec]">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-[#faf8f6]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#57534e] backdrop-blur-sm">{product.category || "Selección Bia"}</span>
          {hasDiscount && <span className="rounded-full bg-[#ff6b4a] px-2.5 py-1 text-[10px] font-semibold text-white">Oferta</span>}
        </div>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf8f6] px-3 py-2 text-xs font-semibold text-[#1c1917] shadow-lg">Ver detalle <ArrowUpRight className="size-3.5" /></span>
          {!outOfStock && <button onClick={handleAddToCart} className="rounded-full bg-[#ff6b4a] p-2.5 text-white shadow-lg transition-colors hover:bg-[#e8572f]" aria-label={`Agregar ${product.name} al carrito`}>{added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}</button>}
        </div>
        {outOfStock && <span className="absolute bottom-3 left-3 rounded-full bg-[#1c1917]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">Agotado</span>}
      </Link>
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0"><Link href={`/producto/${product.id}`}><h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#1c1917] transition-colors hover:text-[#ff6b4a]">{product.name}</h3></Link><p className="mt-1 text-xs text-[#a8a29d]">{product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}</p></div>
        <div className="shrink-0 text-right"><p className="text-sm font-semibold text-[#1c1917]">{formatPrice(price)}</p>{hasDiscount && <p className="text-xs text-[#a8a29d] line-through">{formatPrice(product.price)}</p>}</div>
      </div>
      {!outOfStock && <button onClick={handleAddToCart} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#d6d3d1] py-2.5 text-xs font-semibold text-[#57534e] transition-all hover:border-[#ff8265] hover:bg-[#fff7f0] hover:text-[#e8572f] sm:hidden">{added ? <><Check className="size-3.5" /> Agregado</> : <><ShoppingCart className="size-3.5" /> Agregar</>}</button>}
    </article>
  );
}
