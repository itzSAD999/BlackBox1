
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, options: Record<string, string>, qty: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedOptions, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-3 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all border border-white/5"
        >
          <X size={20} />
        </button>

        {/* Image Column */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 sm:p-10 md:p-12">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain max-h-[260px] sm:max-h-[340px] md:max-h-[400px]"
          />
        </div>

        {/* Info Column */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 overflow-y-auto no-scrollbar space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">{product.category}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-white">{formatCurrency(product.price)}</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-white text-white" />
                <span className="text-xs font-bold text-white/50">{product.rating || '4.5'} ({product.reviewCount || '0'})</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/40 leading-relaxed font-light italic">
            {product.description}
          </p>

          <div className="space-y-6 sm:space-y-8">
            {product.variants && product.variants.map(variant => (
              <div key={variant.name} className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{variant.name}</label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(option => (
                    <button 
                      key={option}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-4 sm:px-5 py-2.5 rounded-xl border text-[10px] font-black transition-all ${selectedOptions[variant.name] === option ? 'border-white bg-white text-black' : 'border-white/10 hover:border-white/30'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full sm:w-auto justify-between sm:justify-center">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white"><Minus size={18}/></button>
                <span className="text-lg font-black w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white"><Plus size={18}/></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 w-full py-4 sm:py-5 bg-white text-black font-black text-[10px] rounded-2xl shadow-xl hover:bg-white/90 active:scale-[0.98] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3"
              >
                <ShoppingCart size={16} /> Add to Bag
              </button>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4 border-t border-white/5">
            <ShieldCheck size={20} className="text-white/40" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Black Box Elite Warranty // Verified Hardware</p>
          </div>
        </div>
      </div>
    </div>
  );
};
