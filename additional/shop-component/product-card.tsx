"use client";
import { memo } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const { addToCart, items } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id_produk,
      name: product.judul_produk,
      price: parseFloat(product.harga),
      image: product.gambar[0]?.url_gambar || "/placeholder.svg",
      inStock: true,
    };
    addToCart(cartItem);
    toast.success("Berhasil menambahkan produk ke keranjang");
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString("id-ID");
  };

  const getImageUrl = (url: string) => {
    // If the URL starts with 'assets/', prepend the base URL
    if (url.startsWith("assets/")) {
      return `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8000"
      }/${url}`;
    }
    return url;
  };

  const isProductInCart = (productId: number) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        {product.gambar && product.gambar.length > 1 ? (
          <Splide
            options={{
              type: "loop",
              perPage: 1,
              perMove: 1,
              gap: "0",
              pagination: false,
              autoplay: false,
              pauseOnHover: true,
              resetProgress: false,
            }}
            className="h-full"
          >
            {product.gambar.map((image) => (
              <SplideSlide key={image.id_gambar} className="w-full">
                <div className="relative aspect-square">
                  <Image
                    src={getImageUrl(image.url_gambar) || "/placeholder.svg"}
                    alt={product.judul_produk}
                    fill
                    className="object-cover"
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <Image
            src={
              Boolean(product.gambar[0]?.url_gambar)
                ? getImageUrl(product.gambar[0]?.url_gambar)
                : "/placeholder.svg"
            }
            alt={product.judul_produk}
            fill
            className="object-cover"
          />
        )}
        {/* <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
          <Heart className="w-4 h-4 text-gray-600" />
        </button> */}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[1.25rem] max-h-[2.5rem] overflow-hidden">
          {product.judul_produk}
        </h3>
        {product.deskripsi && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2rem] max-h-[2rem] overflow-hidden">
            {product.deskripsi}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-gray-900">
            Rp{formatPrice(product.harga)},-
          </span>
        </div>
        <Button
          onClick={handleAddToCart}
          variant={isProductInCart(product.id_produk) ? "outline" : "default"}
          className={`w-full py-2 rounded-md text-sm font-medium ${
            isProductInCart(product.id_produk)
              ? "border-green-600 text-green-600 hover:bg-green-50"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          {isProductInCart(product.id_produk) ? "Added to cart" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
export { ProductCard };