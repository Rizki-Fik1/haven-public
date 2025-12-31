"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { Button } from "@/components/ui/button";
import { CheckoutSuccessModal } from "@/components/ui/checkout-success-modal";
import { useTripayPaymentChannels } from "@/lib/services/tripay";
import { PaymentMethodRadio } from "@/components/shop/payment-method-radio";

export function CartSummary() {
  const { items, getTotalPrice, discount } = useCart();
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

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal - discount + shipping;

  const handleCheckoutClick = () => {
    const checkoutItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    handleCheckout(checkoutItems, selectedPaymentMethod);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Total</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            Rp{subtotal.toLocaleString("id-ID")},-
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-green-600">
              -Rp{discount.toLocaleString("id-ID")},-
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b-2 border-gray-200">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-semibold">
            Rp{total.toLocaleString("id-ID")},-
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mt-6">
        <PaymentMethodRadio
          value={selectedPaymentMethod}
          onValueChange={setSelectedPaymentMethod}
          paymentChannels={paymentChannels}
          isLoading={isLoadingChannels}
        />
      </div>

      <Button
        onClick={handleCheckoutClick}
        disabled={isCheckingOut || items.length === 0 || !selectedPaymentMethod}
        className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3 disabled:opacity-50"
      >
        {isCheckingOut ? "Processing..." : "Proceed to checkout"}
      </Button>

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
