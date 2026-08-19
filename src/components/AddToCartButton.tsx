"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product, ProductAttribute } from "@/types/product";
import { getColorHex } from "@/lib/colors";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);

  const colorAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === "color"
  );

  const selectedVariant = selectedColor && colorAttr
    ? colorAttr.values.find((v) => v.value === selectedColor)
    : null;

  const price = selectedVariant?.price || product.discountPrice || product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const outOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (colorAttr && !selectedColor) return;
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
      stock: stock,
      quantity: quantity,
      selectedColor: selectedColor || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (outOfStock) {
    return (
      <button 
        disabled
        className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm bg-blue-100 text-blue-400 cursor-not-allowed"
      >
        Sin stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Selector de color */}
      {colorAttr && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-blue-700">
            Color: <span className="font-normal text-blue-500">{selectedColor || "Elegir"}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {colorAttr.values.map((v) => {
              const hex = getColorHex(v.value);
              const isSelected = selectedColor === v.value;
              const variantOOS = v.stock <= 0;
              return (
                <button
                  key={v.value}
                  onClick={() => !variantOOS && setSelectedColor(v.value)}
                  disabled={variantOOS}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                      : variantOOS
                        ? "border-blue-100 bg-blue-50/30 text-blue-300 opacity-50 cursor-not-allowed"
                        : "border-blue-100 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-blue-200 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector de cantidad */}
      <div className="flex items-center justify-between border border-blue-200 rounded-xl h-11 px-3 bg-white">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-1 text-blue-400 hover:text-blue-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm w-8 text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          className="p-1 text-blue-400 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón Agregar */}
      <button 
        onClick={handleAddToCart}
        disabled={colorAttr && !selectedColor}
        className={`w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm transition-all ${
          added
            ? 'bg-emerald-400 text-white'
            : colorAttr && !selectedColor
              ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
        {added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
