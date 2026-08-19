"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-blue-50/40 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-blue-800 mb-6">Mi Carrito</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-blue-100">
            <ShoppingBag className="w-12 h-12 text-blue-200 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-blue-800 mb-1">Tu carrito está vacío</h2>
            <p className="text-xs text-blue-400 mb-6">Agregá productos desde el catálogo</p>
            <Link 
              href="/libreria"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Lista de productos */}
            <div className="flex-1 space-y-3">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedColor || ''}`} className="bg-white rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-blue-50/50 shrink-0 border border-blue-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/producto/${item.id}`} className="text-sm font-semibold text-blue-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    {item.selectedColor && (
                      <span className="text-[10px] text-blue-500 font-medium">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    <p className="text-sm font-bold text-blue-700 mt-0.5">{formatPrice(item.price)}</p>
                  </div>
                  
                    <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-blue-200 rounded-lg h-8 px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor)}
                        disabled={item.quantity <= 1}
                        className="p-1 text-blue-400 hover:text-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-semibold text-xs w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor)}
                        className="p-1 text-blue-400 hover:text-blue-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id, item.selectedColor)}
                      className="text-blue-300 hover:text-red-500 transition-colors p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-xl p-5 border border-blue-100 sticky top-24">
                <h3 className="text-sm font-bold text-blue-800 mb-4">Resumen</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-blue-500">
                    <span>Subtotal ({items.length} productos)</span>
                    <span className="font-medium text-blue-700">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-xs text-blue-500">
                    <span>Envío</span>
                    <span className="text-blue-400">A coordinar</span>
                  </div>
                  <div className="pt-3 border-t border-blue-100 flex justify-between">
                    <span className="text-sm font-bold text-blue-800">Total</span>
                    <span className="text-lg font-bold text-blue-700">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full flex items-center justify-center py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Continuar compra
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
                
                <Link 
                  href="/libreria"
                  className="w-full flex items-center justify-center mt-3 text-xs text-blue-500 hover:text-blue-700 transition-colors font-medium"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
