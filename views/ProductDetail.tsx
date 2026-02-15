import React, { useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  Heart,
} from "lucide-react";
import { Product } from "../types";
import { formatCurrency } from "../lib/utils";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  navigateTo: (view: string, id?: string) => void;
  addToCart: (product: Product, options: Record<string, string>, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  navigateTo,
  addToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="border-b bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigateTo("store")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back to Store
          </button>

          <div className="text-sm text-yellow-600 font-medium">
            ● In Stock
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT — PRODUCT IMAGES */}
          <div className="space-y-6">
            
            <div className="bg-black rounded-2xl p-12">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full object-contain"
              />
            </div>

            <div className="flex gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-1 bg-black rounded-xl p-4 border-2 transition ${
                    selectedImage === i
                      ? "border-yellow-600"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — PRODUCT DETAILS */}
          <div className="space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-white">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-600 fill-yellow-600"
                  />
                ))}
                <span className="text-gray-400 text-sm">(4.8)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold text-white">
                {formatCurrency(product.price)}
              </span>

              {product.discount && (
                <span className="text-gray-400 line-through">
                  {formatCurrency(
                    product.price * (1 + product.discount / 100)
                  )}
                </span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {product.variants?.map((variant) => (
              <div key={variant.name}>
                <p className="font-medium mb-3 text-white">
                  Choose {variant.name}
                </p>

                <div className="flex gap-3 flex-wrap">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [variant.name]: option,
                        }))
                      }
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedOptions[variant.name] === option
                          ? "bg-yellow-600 text-white border-yellow-600"
                          : "border-white/30 text-white hover:border-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="font-medium mb-3 text-white">Quantity</p>

              <div className="flex items-center border border-white/30 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-white/10"
                >
                  <Minus size={16} />
                </button>

                <span className="px-6 font-medium text-white">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-white/10"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  addToCart(product, selectedOptions, quantity)
                }
                className="bg-[#B38B21] hover:bg-[#D4AF37] text-white px-8 py-3 rounded-full transition font-medium"
              >
                Buy Now
              </button>

              <button
                onClick={() =>
                  addToCart(product, selectedOptions, quantity)
                }
                className="border border-white/30 px-8 py-3 rounded-full hover:bg-white/10 transition font-medium"
              >
                Add to Cart
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className="border border-white/30 w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"}
                />
              </button>
            </div>

            <div className="border border-white/20 rounded-xl p-6 space-y-4 bg-black">
              <div className="flex items-center gap-3 text-gray-400">
                <Truck size={18} />
                Free Delivery Available
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <RotateCcw size={18} />
                30 Days Return Policy
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
