"use client";

import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus } from "lucide-react";

export function CartTable() {
  const { items, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-700">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-center">Subtotal</div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 p-4 items-center"
          >
            {/* Product */}
            <div className="col-span-6 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFromCart(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-center">
              <span className="font-medium">
                Rp{item.price.toLocaleString("id-ID")},-
              </span>
            </div>

            {/* Quantity */}
            <div className="col-span-2">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      Number.parseInt(e.target.value) || 1
                    )
                  }
                  className="w-16 text-center h-8 [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="col-span-2 text-center">
              <span className="font-medium">
                Rp{(item.price * item.quantity).toLocaleString("id-ID")},-
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
