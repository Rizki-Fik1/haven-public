"use client"

import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

export function OrderSummary() {
  const { items, getTotalPrice, discount } = useCart()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal - discount + shipping

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-medium">Rp{(item.price * item.quantity).toLocaleString("id-ID")},-</div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">Rp{subtotal.toLocaleString("id-ID")},-</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-green-600">-Rp{discount.toLocaleString("id-ID")},-</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-semibold">Rp{total.toLocaleString("id-ID")},-</span>
        </div>
      </div>
    </div>
  )
}
