"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function MobileCheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCart()
  const [transferProof, setTransferProof] = useState<File | null>(null)
  const [originBank, setOriginBank] = useState("")
  const [senderName, setSenderName] = useState("")

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const fee = 10000 // Transfer fee
  const total = subtotal + fee

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTransferProof(file)
    }
  }

  const handlePayment = () => {
    // Handle payment logic here
    router.push("/checkout/success")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Pembayaran</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rincian Pembayaran</h2>

          {/* Order Items */}
          <div className="space-y-3 mb-4">
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

          {/* Totals */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-medium">Rp{subtotal.toLocaleString("id-ID")},-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium">Rp{fee.toLocaleString("id-ID")},-</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Sub Total</span>
              <span className="font-semibold">Rp{total.toLocaleString("id-ID")},-</span>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pembayaran transfer</h2>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">BCA</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Bank Central Asia</p>
              <p className="text-sm text-gray-600">12345678 a/n Haven</p>
            </div>
          </div>
        </div>

        {/* Upload Transfer Proof */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Upload Bukti Transfer</h3>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{transferProof ? transferProof.name : "Browse a file ..."}</p>
            </div>
          </div>
        </div>

        {/* Origin Bank */}
        <div className="bg-white rounded-lg p-4">
          <Label htmlFor="originBank" className="text-base font-semibold text-gray-900 mb-3 block">
            Asal Bank
          </Label>
          <Input
            id="originBank"
            placeholder="Please type here ..."
            value={originBank}
            onChange={(e) => setOriginBank(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sender Name */}
        <div className="bg-white rounded-lg p-4">
          <Label htmlFor="senderName" className="text-base font-semibold text-gray-900 mb-3 block">
            Nama Pengirim
          </Label>
          <Input
            id="senderName"
            placeholder="Please type here ..."
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Payment Button */}
        <div className="pb-6">
          <Button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-full"
          >
            Sudah Bayar
          </Button>
        </div>
      </div>
    </div>
  )
}
