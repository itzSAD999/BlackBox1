import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Minus, Heart, Share2, Star, Check, Truck, Shield, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-white/60">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button></li>
            <li>/</li>
            <li><button onClick={() => navigateTo('store')} className="hover:text-white transition-colors">Store</button></li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.discount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black mb-2">{product.name}</h1>
              <p className="text-white/60">{product.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#B38B21]">
                ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}
              </span>
              {product.discount && (
                <span className="text-xl text-white/40 line-through">${product.price}</span>
              )}
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="text-white/40">({product.reviewCount})</span>
                </div>
              )}
            </div>

            <p className="text-white/80 leading-relaxed">{product.description}</p>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <h3 className="text-sm font-medium text-white/60 mb-2">{variant.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionChange(variant.name, option)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            selectedOptions[variant.name] === option
                              ? 'border-[#B38B21] bg-[#B38B21]/10 text-[#B38B21]'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/60">Quantity:</span>
                <div className="flex items-center border border-white/20 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-white/10 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-white/60">
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#B38B21] text-black font-black py-4 rounded-lg hover:bg-[#B38B21]/90 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-4 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'border-[#B38B21] bg-[#B38B21]/10 text-[#B38B21]'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
                <button className="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#B38B21]" />
                <span className="text-xs text-white/60">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#B38B21]" />
                <span className="text-xs text-white/60">1 Year Warranty</span>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-[#B38B21]" />
                <span className="text-xs text-white/60">30 Day Returns</span>
              </div>
            </div>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="py-6 border-t border-white/10">
                <h3 className="text-lg font-bold mb-4">Specifications</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-[#B38B21] flex-shrink-0" />
                      <span className="text-sm text-white/80">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  onClick={() => navigateTo('product', relatedProduct.id)}
                >
                  <div className="aspect-square bg-white/5 rounded-xl overflow-hidden mb-4 group-hover:bg-white/10 transition-colors">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium mb-1">{relatedProduct.name}</h3>
                  <p className="text-[#B38B21] font-bold">${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
