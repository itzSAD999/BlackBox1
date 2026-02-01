
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
      className={`group bg-[#080808] border rounded-[2.5rem] overflow-hidden transition-all duration-700 flex flex-col h-full cursor-pointer relative ${isCompared ? 'border-[#F1E5AC]' : 'border-white/[0.03] hover:border-[#F1E5AC]/20 shadow-2xl'}`}
    >
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
        {product.new && (
          <span className="bg-white text-black text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg">NEW</span>
        )}
        {product.discount && (
          <span className="bg-[#F1E5AC] text-black text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-lg italic">-{product.discount}%</span>
        )}
      </div>

      <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
        <button 
          className={`transition-all p-3 backdrop-blur-xl rounded-full border border-white/5 hover:bg-[#F1E5AC] hover:text-black ${isWishlisted ? 'text-[#F1E5AC]' : 'text-white/40'}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(product.id); }}
        >
          <Heart size={16} className={isWishlisted ? 'fill-[#F1E5AC]' : ''} />
        </button>
        <button 
          className={`transition-all p-3 backdrop-blur-xl rounded-full border border-white/5 hover:bg-[#F1E5AC] hover:text-black ${isCompared ? 'text-[#F1E5AC]' : 'text-white/40'}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(product.id); }}
        >
          <Scale size={16} />
        </button>
      </div>

      <Link to="/product/$productId" params={{ productId: product.id } as any} className="flex-1 flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-[#030303] flex items-center justify-center p-12">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-[1s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-12">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
              className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl flex items-center justify-center gap-3"
            >
              <Eye size={16} /> QUICK VIEW
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">{product.category}</p>
            <h3 className="text-[13px] font-black text-white leading-tight uppercase italic line-clamp-2 tracking-wide group-hover:text-[#F1E5AC] transition-colors">{product.name}</h3>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className={i < Math.floor(product.rating || 4) ? 'fill-[#F1E5AC] text-[#F1E5AC]' : 'text-white/5'} />
                ))}
              </div>
              <span className="text-[9px] text-white/10 font-black italic">({product.reviewCount || 0})</span>
            </div>
          </div>

          <div className="space-y-5">
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
              className="w-full py-5 border-2 border-white/[0.02] hover:border-[#F1E5AC] group-hover:bg-[#F1E5AC]/5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={16} /> ADD TO CART
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
