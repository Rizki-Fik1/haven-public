"use client";

import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/types/product";

const ProductGrid = memo(() => {
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  const products = productsResponse?.data || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id_produk} product={product} />
      ))}
    </div>
  );
});

ProductGrid.displayName = "ProductGrid";

export { ProductGrid };
