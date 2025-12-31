"use client";

import type React from "react";
import { memo, useMemo } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileBottomNavigation } from "@/components/mobile/bottom-navigation";
import { useCart } from "@/hooks/use-cart";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const MobileCatalogPage = memo(() => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, items } = useCart();

  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = productsResponse?.data || [];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((product: Product) =>
      product.judul_produk.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleProductClick = (productId: number) => {
    router.push(`/shop/product/${productId}`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItem = {
      id: product.id_produk,
      name: product.judul_produk,
      price: parseFloat(product.harga),
      image: product.gambar[0]?.url_gambar || "/placeholder.svg",
      inStock: true,
    };
    addToCart(cartItem);

    toast.success("Berhail menambahkan produk ke keranjang");
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("assets/")) {
      return `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8000"
      }/${url}`;
    }
    return url;
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString("id-ID");
  };

  const isProductInCart = (productId: number) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center mr-10">
            Katalog Produk
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Failed to load products. Please try again.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery
                ? "No products found matching your search."
                : "No products available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product: Product) => (
              <div
                key={product.id_produk}
                // onClick={() => handleProductClick(product.id_produk)}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
              >
                <div className="aspect-square relative">
                  <img
                    src={
                      Boolean(product.gambar[0]?.url_gambar)
                        ? getImageUrl(product.gambar[0]?.url_gambar)
                        : "/placeholder.svg"
                    }
                    alt={product.judul_produk}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.judul_produk}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-green-600">
                      Rp{formatPrice(product.harga)},-
                    </p>
                    <Button
                      onClick={(e) => handleAddToCart(product, e)}
                      size="sm"
                      variant={
                        isProductInCart(product.id_produk)
                          ? "outline"
                          : "default"
                      }
                      className={`px-3 py-1 h-8 text-xs font-medium ${
                        isProductInCart(product.id_produk)
                          ? "border-green-600 text-green-600 hover:bg-green-50"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {isProductInCart(product.id_produk) ? "Add" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileBottomNavigation />
    </div>
  );
});

MobileCatalogPage.displayName = "MobileCatalogPage";

export { MobileCatalogPage };
