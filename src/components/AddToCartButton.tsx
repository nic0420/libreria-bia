"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const price = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
      stock: product.stock,
      quantity: quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock <= 0) {
    return (
      <button 
        disabled
        className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
      >
        Sin stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Selector de cantidad */}
      <div className="flex items-center justify-between border border-zinc-200 rounded-xl h-11 px-3 bg-white">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm w-8 text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón Agregar */}
      <button 
        onClick={handleAddToCart}
        className={`w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm transition-all ${added ? 'bg-emerald-500 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}
      >
        {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
        {added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
