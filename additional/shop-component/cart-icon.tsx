"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CartIcon() {
  const { getTotalItems } = useCart()

  return (
    <Button
      asChild
      variant="ghost"
      className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-xs font-medium flex items-center justify-center text-white">
            {getTotalItems()}
          </span>
        )}
      </Link>
    </Button>
  )
}
