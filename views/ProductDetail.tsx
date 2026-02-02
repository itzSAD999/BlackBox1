import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, ShoppingBag, ShieldCheck, ShoppingCart, Download, FileText } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';

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
  relatedProducts, 
  navigateTo, 
  addToCart, 
  isWishlisted, 
  onToggleWishlist 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const downloadTechnicalSheet = () => {
    // For a real PDF without complex external libraries, 
    // we use window.print() combined with the hidden print-only div.
    window.print();
  };

  return (
    <div className="view-transition min-h-screen bg-black text-white">
      {/* Print View Only */}
      <div className="print-only text-black">
        <div className="print-header flex justify-between items-center">
          <div className="print-logo">BLACK BOX</div>
          <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">EST. KUMASI // UNIT LOG: {product.id}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="print-section">
              <div className="print-label">Hardware Unit</div>
              <div className="text-3xl font-black uppercase italic tracking-tighter">{product.name}</div>
            </div>
            
            <div className="print-section">
              <div className="print-label">Diagnostics & Bench Description</div>
              <div className="text-sm italic leading-relaxed text-gray-600">{product.description}</div>
            </div>

            <div className="print-section">
              <div className="print-label">Technical Matrix</div>
              <ul className="space-y-2 mt-4">
                {product.specs?.map((s, i) => (
                  <li key={i} className="text-sm flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B38B21]" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="print-section">
              <div className="print-label">Bench Valuation</div>
              <div className="text-4xl font-black italic tracking-tighter text-[#B38B21]">{formatCurrency(product.price)}</div>
            </div>
            
            <div className="print-section border border-gray-100 p-8 rounded-3xl bg-gray-50">
              <div className="print-label">Authorization Badge</div>
              <div className="mt-4 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
                 <ShieldCheck size={48} className="text-gray-200" />
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 mt-4">GENUINE UNIT LOG</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
           Document generated via Black Box Precision Core // No manual signature required.
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center border-b border-white/5 no-print">
        <button onClick={() => navigateTo('store')} className="flex items-center gap-3 text-white/40 hover:text-[#B38B21] transition-colors text-[11px] font-black uppercase tracking-[0.4em] italic">
          <ArrowLeft size={18}/> BACK TO CATALOG
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">BLACK BOX // TECHNICAL REPOSITORY</div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          <div className="lg:col-span-6 space-y-12 animate-in slide-in-from-left-10 duration-1000">
            <div className="space-y-6">
              <div className="flex items-center justify-between no-print">
                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#B38B21] italic opacity-60">/ {product.category}</span>
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isWishlisted ? 'text-[#B38B21]' : 'text-white/20 hover:text-white'}`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-[#B38B21]' : ''} />
                  {isWishlisted ? 'IN WISHLIST' : 'LOG TO WISHLIST'}
                </button>
              </div>
              <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] italic uppercase text-white">{product.name}</h1>
            </div>
            
            <div className="max-w-xl space-y-10">
              <p className="text-lg text-white/40 leading-relaxed font-light italic">
                {product.description}
              </p>

              {product.variants && product.variants.map(variant => (
                <div key={variant.name} className="space-y-4 no-print">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{variant.name}</label>
                  <div className="flex flex-wrap gap-3">
                    {variant.options.map(option => (
                      <button 
                        key={option}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [variant.name]: option }))}
                        className={`px-8 py-4 rounded-xl border-2 text-[11px] font-black transition-all ${selectedOptions[variant.name] === option ? 'border-[#B38B21] bg-[#B38B21] text-black shadow-lg' : 'border-white/5 hover:border-white/20'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-8">
                   <span className="text-5xl font-black italic tracking-tighter text-[#B38B21]">{formatCurrency(product.price)}</span>
                   <div className="flex items-center gap-10 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 no-print">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-[#B38B21]"><Minus size={18}/></button>
                    <span className="text-2xl font-black w-8 text-center italic text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-[#B38B21]"><Plus size={18}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 no-print">
                  <button 
                    onClick={() => addToCart(product, selectedOptions, quantity)}
                    className="py-6 border-2 border-[#B38B21] text-[#B38B21] font-black text-[11px] rounded-2xl transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#B38B21] hover:text-black"
                  >
                    <ShoppingCart size={20} /> ADD TO CART
                  </button>
                  <button 
                    onClick={() => { addToCart(product, selectedOptions, quantity); navigateTo('cart'); }}
                    className="py-6 bg-[#B38B21] text-black font-black text-[11px] rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(179,139,33,0.3)]"
                  >
                    <ShoppingBag size={20} /> BUY NOW
                  </button>
                </div>
                
                <button 
                    onClick={downloadTechnicalSheet}
                    className="w-full py-5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 rounded-2xl group no-print"
                >
                  <FileText size={18} className="group-hover:text-[#B38B21] transition-colors" /> Save Technical Sheet (PDF)
                </button>
              </div>

              <div className="pt-10 flex items-center gap-6 border-t border-white/5 opacity-20 no-print">
                <ShieldCheck size={28} className="text-white" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] italic text-white">Precision Certified // 24 Month Bench Coverage</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative animate-in zoom-in-95 duration-1000 hidden lg:block">
            <div className="absolute inset-0 bg-[#B38B21]/10 blur-[120px] rounded-full"></div>
            <div className="aspect-[4/5] overflow-hidden rounded-[4rem] shadow-2xl border border-white/5 group bg-[#0a0a0a] flex items-center justify-center p-16 relative z-10">
              <img 
                src={product.image} 
                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 drop-shadow-[0_20px_60px_rgba(0,0,0,0.85)]" 
                alt={product.name} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] py-32 px-6 border-t border-white/5 no-print">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">HARDWARE PAIRINGS</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#B38B21] italic opacity-60">/ COMPLETE YOUR KIT</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map(rp => (
              <ProductCard 
                key={rp.id} 
                product={rp} 
                onQuickView={() => {}} 
                isWishlisted={false}
                onToggleWishlist={() => {}}
                onAddToCart={(p) => addToCart(p, {}, 1)}
                isCompared={false}
                onToggleCompare={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};