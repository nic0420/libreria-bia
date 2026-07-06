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

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-primary-600" /> Mi Carrito
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-zinc-100">
            <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-zinc-500 mb-8">¡Descubre todos los productos que tenemos para ti!</p>
            <Link 
              href="/libreria"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-colors shadow-md"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de productos */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-zinc-100 flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col w-full text-center sm:text-left">
                    <Link href={`/producto/${item.id}`} className="text-lg font-bold text-zinc-900 hover:text-primary-600 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center justify-between sm:justify-start gap-4 mt-4">
                      <div className="flex items-center border-2 border-zinc-200 rounded-full h-10 px-2 bg-zinc-50">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-primary-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-zinc-500 mb-1">Subtotal</p>
                    <p className="text-xl font-black text-zinc-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 sticky top-24">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Resumen de Compra</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Envío</span>
                    <span className="text-sm text-zinc-400 italic">A calcular en checkout</span>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 flex justify-between">
                    <span className="text-lg font-bold text-zinc-900">Total</span>
                    <span className="text-2xl font-black text-primary-600">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full flex items-center justify-center h-14 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-md group"
                >
                  Continuar compra
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/libreria"
                  className="w-full flex items-center justify-center mt-4 text-primary-600 font-medium hover:underline"
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
