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
        className="flex-1 flex items-center justify-center h-14 rounded-full font-bold text-lg shadow-md bg-zinc-200 text-zinc-400 cursor-not-allowed"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Sin stock
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex items-center justify-between border-2 border-zinc-200 rounded-full h-14 px-4 bg-white sm:w-1/3">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 text-zinc-400 hover:text-primary-600 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="p-2 text-zinc-400 hover:text-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <button 
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center h-14 rounded-full font-bold text-lg transition-all shadow-md ${added ? 'bg-green-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg'}`}
      >
        {added ? <Check className="w-5 h-5 mr-2" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
        {added ? 'Agregado' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
