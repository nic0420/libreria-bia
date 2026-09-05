"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Link href="/carrito" className="relative flex items-center gap-1.5 group text-[#ff6b4a] hover:text-[#e8572f] transition-colors">
      <ShoppingCart className="w-5 h-5" />
      {mounted && totalItems > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff6b4a] text-[10px] font-bold text-white px-1">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
