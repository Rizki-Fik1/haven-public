"use client";

import { memo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  TripayPaymentChannel,
  TripayPaymentChannelsResponse,
} from "@/types/tripay";
import {
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
  Wallet,
  BanknoteIcon,
} from "lucide-react";

interface PaymentMethodRadioProps {
  value: string;
  onValueChange: (value: string) => void;
  paymentChannels?: TripayPaymentChannelsResponse;
  isLoading?: boolean;
  disabled?: boolean;
}

const getPaymentIcon = (type: string, code: string) => {
  switch (type) {
    case "virtual_account":
      return <Building2 className="w-5 h-5" />;
    case "ewallet":
      return <Smartphone className="w-5 h-5" />;
    case "qris":
      return <QrCode className="w-5 h-5" />;
    case "credit_card":
      return <CreditCard className="w-5 h-5" />;
    case "retail":
      return <BanknoteIcon className="w-5 h-5" />;
    default:
      return <Wallet className="w-5 h-5" />;
  }
};

const getPaymentTypeColor = (type: string) => {
  switch (type) {
    case "virtual_account":
      return "text-blue-600";
    case "ewallet":
      return "text-green-600";
    case "qris":
      return "text-purple-600";
    case "credit_card":
      return "text-orange-600";
    case "retail":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

const fallbackPaymentMethods: TripayPaymentChannel[] = [
  {
    code: "BCAVA",
    name: "BCA Virtual Account",
    type: "virtual_account",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "BRIVA",
    name: "BRI Virtual Account",
    type: "virtual_account",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "MANDIRIVA",
    name: "Mandiri Virtual Account",
    type: "virtual_account",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "BNIVA",
    name: "BNI Virtual Account",
    type: "virtual_account",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "GOPAY",
    name: "GoPay",
    type: "ewallet",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "OVO",
    name: "OVO",
    type: "ewallet",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
  {
    code: "DANA",
    name: "DANA",
    type: "ewallet",
    fee_customer: { flat: 0, percent: 0 },
    fee_merchant: { flat: 0, percent: 0 },
    total_fee: { flat: 0, percent: 0 },
    icon_url: "",
    active: true,
  },
];

export const PaymentMethodRadio = memo<PaymentMethodRadioProps>(
  ({
    value,
    onValueChange,
    paymentChannels,
    isLoading = false,
    disabled = false,
  }) => {
    const channels =
      paymentChannels?.data?.filter((channel) => channel.active) ||
      fallbackPaymentMethods;

    if (isLoading) {
      return (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Metode Pembayaran
          </Label>
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Metode Pembayaran
        </Label>
        <RadioGroup
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          className="grid gap-3"
        >
          {channels.map((channel) => (
            <div key={channel.code} className="relative">
              <Label
                htmlFor={channel.code}
                className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-green-300 hover:bg-green-50/50 has-[:checked]:border-green-500 has-[:checked]:bg-green-50 has-[:checked]:ring-2 has-[:checked]:ring-green-200"
              >
                {/* Icon */}
                <div
                  className={`${getPaymentTypeColor(
                    channel.type
                  )} flex-shrink-0`}
                >
                  {channel.icon_url ? (
                    <img
                      src={channel.icon_url}
                      alt={channel.name}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={channel.icon_url ? "hidden" : ""}>
                    {getPaymentIcon(channel.type, channel.code)}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">
                      {channel.name}
                    </span>
                    {(channel.fee_customer.flat > 0 ||
                      channel.fee_customer.percent > 0) && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        (+
                        {channel.fee_customer.flat > 0
                          ? `Rp${channel.fee_customer.flat.toLocaleString(
                              "id-ID"
                            )}`
                          : `${channel.fee_customer.percent}%`}
                        )
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {channel.type.replace("_", " ")}
                  </span>
                </div>

                {/* Radio indicator */}
                <div className="flex-shrink-0">
                  <RadioGroupItem
                    value={channel.code}
                    id={channel.code}
                    className="border-green-500 text-green-500"
                  />
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
);

PaymentMethodRadio.displayName = "PaymentMethodRadio";
