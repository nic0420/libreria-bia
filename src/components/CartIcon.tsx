"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/carrito" className="relative flex flex-col items-center justify-center gap-1 group text-zinc-500 hover:text-primary-600 transition-colors cursor-pointer">
      <div className="relative">
        <ShoppingCart className="h-6 w-6 group-hover:-translate-y-1 transition-transform text-primary-600" />
        {mounted && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-secondary-500 text-[10px] font-bold text-white shadow-sm">
            {totalItems}
          </span>
        )}
      </div>
      <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-primary-600 mt-1">Mi Carrito</span>
    </Link>
  );
}
