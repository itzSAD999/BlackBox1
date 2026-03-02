
import React from 'react';
import { Heart, Star, ShoppingCart, Eye, Scale } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isCompared: boolean;
  onToggleCompare: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, onQuickView, isWishlisted, onToggleWishlist, onAddToCart, isCompared, onToggleCompare
}) => {
  return (
    <div 
      className={`glow-border group bg-[#080808] overflow-hidden transition-all duration-700 flex flex-col h-full cursor-pointer relative ${isCompared ? 'border-[#CDA032]' : 'shadow-2xl'}`}
    >
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col gap-2 sm:gap-3">
        {product.new && (
          <span className="bg-white text-black text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg">NEW</span>
        )}
        {product.discount && (
          <span className="bg-[#CDA032] text-black text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg italic">-{product.discount}%</span>
        )}
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col gap-2 sm:gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-x-4 md:group-hover:translate-x-0">
        <button 
          className={`transition-all p-3 backdrop-blur-xl rounded-full border border-white/5 hover:bg-[#CDA032] hover:text-black ${isWishlisted ? 'text-[#CDA032]' : 'text-white/40'}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(product.id); }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={isWishlisted ? 'fill-[#CDA032]' : ''} />
        </button>
        <button 
          className={`transition-all p-3 backdrop-blur-xl rounded-full border border-white/5 hover:bg-[#CDA032] hover:text-black ${isCompared ? 'text-[#CDA032]' : 'text-white/40'}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(product.id); }}
          aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
        >
          <Scale size={16} />
        </button>
      </div>

      <Link to="/product/$productId" params={{ productId: product.id } as any} className="flex-1 flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-[#030303] flex items-center justify-center p-6 sm:p-10 md:p-12">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-[1s] group-hover:scale-105"
          />
          {/* On touch (mobile) we show Quick View without hover dependency */}
          <div className="absolute inset-0 bg-black/70 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 sm:p-10 md:p-12">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
              className="w-full py-3 sm:py-4 md:py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-xl transform translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
            >
              <Eye size={16} /> QUICK VIEW
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">{product.category}</p>
            <h3 className="text-[13px] font-black text-white leading-tight uppercase italic line-clamp-2 tracking-wide group-hover:text-[#CDA032] transition-colors">{product.name}</h3>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={i < Math.floor(product.rating || 4) ? 'fill-[#CDA032] text-[#CDA032]' : 'text-white/5'} />
                ))}
              </div>
              <span className="text-[9px] text-white/10 font-black italic">({product.reviewCount || 0})</span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-black text-white tracking-tighter">{formatCurrency(product.price)}</span>
              {product.discount && (
                <span className="text-[10px] text-white/10 line-through font-bold">
                  {formatCurrency(product.price * (1 + product.discount/100))}
                </span>
              )}
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
              className="w-full py-3.5 sm:py-4 md:py-5 border-2 border-white/[0.02] hover:border-[#CDA032] group-hover:bg-[#CDA032]/5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={16} /> ADD TO CART
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
