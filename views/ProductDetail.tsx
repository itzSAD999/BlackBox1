import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Minus, Heart, Share2, Star, Check, Truck, Shield, RefreshCw, ArrowLeft } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  addToCart: (product: Product, options?: Record<string, string>, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  navigateTo: (view: string, id?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  relatedProducts,
  addToCart,
  isWishlisted,
  onToggleWishlist,
  navigateTo
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionChange = (variantName: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedOptions, quantity);
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-[#060605] text-white pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-white/60">
            <li>
              <button 
                onClick={() => navigateTo('home')} 
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            </li>
            <li>/</li>
            <li><button onClick={() => navigateTo('store')} className="hover:text-white transition-colors">Store</button></li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Image Section */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>

            {product.discount && (
              <div className="absolute top-6 left-6 bg-[#B38B21] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-8">

            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                {product.name}
              </h1>
              <p className="text-white/60 mt-2">{product.category}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-5 flex-wrap">
              <span className="text-3xl font-bold text-[#B38B21]">
                ${product.discount
                  ? (product.price * (1 - product.discount / 100)).toFixed(2)
                  : product.price}
              </span>

              {product.discount && (
                <span className="text-lg text-white/40 line-through">
                  ${product.price}
                </span>
              )}

              {product.rating && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span className="text-white">{product.rating}</span>
                  <span className="text-white/40 text-sm">
                    ({product.reviewCount})
                  </span>
                </div>
              )}
            </div>

            <p className="text-white/80 leading-relaxed max-w-xl">
              {product.description}
            </p>

            {product.variants?.length > 0 && (
              <div className="space-y-6">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
                      {variant.name}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionChange(variant.name, option)}
                          className={`relative group transition-all duration-300 ${
                            selectedOptions[variant.name] === option
                              ? 'scale-110'
                              : 'hover:scale-105'
                          }`}
                        >
                          {variant.name === 'Color' ? (
                            <div className="flex flex-col items-center gap-3">
                              <div 
                                className={`w-12 h-12 rounded-full border-4 shadow-lg transition-all ${
                                  selectedOptions[variant.name] === option 
                                    ? 'border-white ring-4 ring-[#B38B21]/30' 
                                    : 'border-gray-300 hover:border-gray-200'
                                }`}
                                style={{ 
                                  backgroundColor: option.toLowerCase() === 'black' ? '#000' :
                                                   option.toLowerCase() === 'white' ? '#fff' :
                                                   option.toLowerCase() === 'red' ? '#ef4444' :
                                                   option.toLowerCase() === 'blue' ? '#3b82f6' :
                                                   option.toLowerCase() === 'green' ? '#10b981' :
                                                   option.toLowerCase() === 'yellow' ? '#eab308' :
                                                   option.toLowerCase() === 'purple' ? '#a855f7' :
                                                   option.toLowerCase() === 'pink' ? '#ec4899' :
                                                   option.toLowerCase() === 'gray' || option.toLowerCase() === 'grey' ? '#6b7280' :
                                                   option.toLowerCase() === 'silver' ? '#9ca3af' :
                                                   option.toLowerCase() === 'gold' || option.toLowerCase() === 'golden' ? '#f59e0b' :
                                                   '#6b7280'
                                }}
                              />
                              <span className={`text-sm font-medium transition-colors ${
                                selectedOptions[variant.name] === option 
                                  ? 'text-[#B38B21]' 
                                  : 'text-white/60 group-hover:text-white/80'
                              }`}>
                                {option}
                              </span>
                              {selectedOptions[variant.name] === option && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#B38B21] rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                              selectedOptions[variant.name] === option
                                ? 'border-[#B38B21] bg-[#B38B21]/20 text-[#B38B21] shadow-lg shadow-[#B38B21]/20'
                                : 'border-white/20 hover:border-white/40 hover:bg-white/5 text-white/80'
                            }`}>
                              {option}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center border border-white/20 rounded-full overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 hover:bg-white/10 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 hover:bg-white/10 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-white/50 text-sm">
                {product.stock} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 sm:min-w-[200px] bg-[#B38B21] text-black font-bold py-4 rounded-full hover:opacity-90 transition shadow-lg"
              >
                Add to Cart
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-4 rounded-full border transition ${isWishlisted
                  ? 'border-[#B38B21] text-[#B38B21] bg-[#B38B21]/10'
                  : 'border-white/20 hover:border-white/40'
                  }`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </button>

              <button className="p-4 rounded-full border border-white/20 hover:border-white/40 transition">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10 text-center">
              <div>
                <Truck className="mx-auto mb-2 text-[#B38B21]" />
                <p className="text-xs text-white/60">Free Shipping</p>
              </div>
              <div>
                <Shield className="mx-auto mb-2 text-[#B38B21]" />
                <p className="text-xs text-white/60">1 Year Warranty</p>
              </div>
              <div>
                <RefreshCw className="mx-auto mb-2 text-[#B38B21]" />
                <p className="text-xs text-white/60">30 Day Returns</p>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-14">
            <h2 className="text-3xl font-bold mb-10">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('product', item.id)}
                  className="cursor-pointer group"
                >
                  <div className="rounded-2xl overflow-hidden bg-black/30 border border-white/10 group-hover:border-[#B38B21]/50 transition shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <h3 className="mt-4 font-medium">{item.name}</h3>
                  <p className="text-[#B38B21] font-bold">
                    ${item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};