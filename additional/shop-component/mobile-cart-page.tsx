"use client";

import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileBottomNavigation } from "@/components/mobile/bottom-navigation";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { Button } from "@/components/ui/button";
import { CheckoutSuccessModal } from "@/components/ui/checkout-success-modal";
import { useTripayPaymentChannels } from "@/lib/services/tripay";
import { PaymentMethodRadio } from "@/components/shop/payment-method-radio";
import Link from "next/link";

export function MobileCartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const {
    handleCheckout,
    isCheckingOut,
    isSuccessModalOpen,
    orderCount,
    tripayPaymentUrl,
    handleModalClose,
    handleProceedToPayment,
    handleGoHome,
  } = useCheckout();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("BCAVA");
  const { data: paymentChannels, isLoading: isLoadingChannels } =
    useTripayPaymentChannels();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckoutClick = () => {
    const checkoutItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    handleCheckout(checkoutItems, selectedPaymentMethod);
  };

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center mr-10">
              Cart
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Add some products to get started
          </p>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>

        <MobileBottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center mr-10">
            Cart
          </h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 relative"
          >
            <div className="flex items-start gap-4">
              {/* Product Image with Delete Button */}
              <div>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="text-lg font-semibold text-green-600 mb-3">
                  Rp{item.price.toLocaleString("id-ID")},-
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Payment Method and Checkout */}
      <div className="bg-white border-t border-gray-200 p-4 pb-20 space-y-4">
        {/* Payment Method Selection */}
        <div>
          <PaymentMethodRadio
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            paymentChannels={paymentChannels}
            isLoading={isLoadingChannels}
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">
            Total: Rp{total.toLocaleString("id-ID")},-
          </span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckoutClick}
          disabled={isCheckingOut || !selectedPaymentMethod}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-medium disabled:opacity-50"
        >
          {isCheckingOut ? "Processing..." : "Checkout"}
        </Button>
      </div>

      <MobileBottomNavigation />

      {/* Success Modal */}
      <CheckoutSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleModalClose}
        onProceedToPayment={handleProceedToPayment}
        onGoHome={handleGoHome}
        orderCount={orderCount}
        hasPaymentUrl={!!tripayPaymentUrl}
      />
    </div>
  );
}
