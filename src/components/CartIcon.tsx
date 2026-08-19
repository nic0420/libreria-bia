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
    <Link href="/carrito" className="relative flex items-center gap-1.5 group text-blue-600 hover:text-blue-800 transition-colors">
      <ShoppingCart className="w-5 h-5" />
      {mounted && totalItems > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white px-1">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
