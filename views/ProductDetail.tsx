import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Heart, ShoppingBag, ShieldCheck, ShoppingCart, Download, FileText, Star, Truck, Package, RotateCcw, Check, Info } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState(0);

  const downloadTechnicalSheet = () => {
    window.print();
  };

  // Mock additional images (in real app, these would come from product data)
  const images = [product.image, product.image, product.image];

  return (
    <div className="view-transition min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B38B21]/[0.03] blur-[150px] rounded-full -mr-[300px] -mt-[300px]"></div>
      </div>

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

      {/* Enhanced Header */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-6 flex justify-between items-center border-b border-white/5 no-print relative z-10">
        <button 
          onClick={() => navigateTo('store')} 
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B38B21]/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider text-white/50 hover:text-white group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-wider text-white/30">In Stock</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-12 lg:py-16 no-print relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Product Images */}
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-left-6 duration-700">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 group relative">
              <div className="absolute inset-0 bg-[#B38B21]/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative h-full flex items-center justify-center p-12">
                <img 
                  src={images[selectedImage]} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_20px_60px_rgba(0,0,0,0.85)]" 
                  alt={product.name} 
                />
              </div>
              
              {/* Wishlist Badge */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-6 right-6 w-12 h-12 rounded-xl backdrop-blur-xl border transition-all ${
                  isWishlisted 
                    ? 'bg-[#B38B21]/20 border-[#B38B21] text-[#B38B21]' 
                    : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                }`}
              >
                <Heart size={20} className={`mx-auto ${isWishlisted ? 'fill-[#B38B21]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i 
                      ? 'border-[#B38B21] shadow-lg' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="h-full bg-gradient-to-br from-[#0a0a0a] to-[#050505] flex items-center justify-center p-4">
                    <img src={img} className="w-full h-full object-contain" alt="" />
                  </div>
                </button>
              ))}
            </div>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-8 space-y-6">
                <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Info size={18} className="text-[#B38B21]" />
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Check size={14} className="text-[#B38B21] shrink-0" />
                      <span className="text-white/60">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-wider uppercase text-[#B38B21]/60 flex items-center gap-2">
                  <Package size={12} />
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#B38B21] fill-[#B38B21]" />
                  ))}
                  <span className="text-[9px] font-bold text-white/30 ml-2">(4.8)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight italic uppercase text-white">
                {product.name}
              </h1>
              
              <p className="text-sm text-white/50 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.map((variant, idx) => (
              <div key={variant.name} className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button 
                      key={option}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [variant.name]: option }))}
                      className={`px-5 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                        selectedOptions[variant.name] === option 
                          ? 'border-[#B38B21] bg-[#B38B21] text-black shadow-lg' 
                          : 'border-white/10 hover:border-white/30 text-white/60'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Price & Quantity */}
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-6 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-2">Price</p>
                  <span className="text-4xl font-black italic tracking-tight bg-gradient-to-r from-[#B38B21] to-[#D4AF37] bg-clip-text text-transparent">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mb-2">Total</p>
                  <span className="text-2xl font-black text-white">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl px-5 py-3 flex-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="text-white/40 hover:text-[#B38B21] transition-colors p-1 hover:bg-white/5 rounded"
                  >
                    <Minus size={16}/>
                  </button>
                  <span className="text-lg font-black w-12 text-center text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="text-white/40 hover:text-[#B38B21] transition-colors p-1 hover:bg-white/5 rounded"
                  >
                    <Plus size={16}/>
                  </button>
                </div>
                <div className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
                  Qty
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => { addToCart(product, selectedOptions, quantity); navigateTo('cart'); }}
                className="w-full py-5 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black font-black text-[11px] rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_15px_50px_rgba(179,139,33,0.3)] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <ShoppingBag size={18} /> Buy Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <button 
                onClick={() => addToCart(product, selectedOptions, quantity)}
                className="w-full py-5 border-2 border-[#B38B21]/30 text-[#B38B21] font-black text-[11px] rounded-2xl transition-all uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#B38B21]/10 hover:border-[#B38B21]"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: ShieldCheck, label: 'Warranty', desc: '24 months' },
                { icon: Truck, label: 'Shipping', desc: 'Free delivery' },
                { icon: RotateCcw, label: 'Returns', desc: '30 days' }
              ].map((badge, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                  <badge.icon size={20} className="text-[#B38B21] mx-auto mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-white/60">{badge.label}</p>
                  <p className="text-[8px] text-white/30 uppercase tracking-wider mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button 
              onClick={downloadTechnicalSheet}
              className="w-full py-4 border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-3 rounded-xl group"
            >
              <FileText size={16} className="group-hover:text-[#B38B21] transition-colors" /> 
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gradient-to-br from-[#050505] to-black py-24 px-6 md:px-8 border-t border-white/5 no-print relative z-10">
        <div className="max-w-[1600px] mx-auto space-y-12">
          <div className="flex items-end justify-between border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase leading-tight text-white">
                You Might Also Like
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/30 flex items-center gap-2">
                <Package size={12} className="text-[#B38B21]" />
                Complete Your Setup
              </p>
            </div>
            <button 
              onClick={() => navigateTo('store')}
              className="text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-[#B38B21] transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp, i) => (
              <div 
                key={rp.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <ProductCard 
                  product={rp} 
                  onQuickView={() => {}} 
                  isWishlisted={false}
                  onToggleWishlist={() => {}}
                  onAddToCart={(p) => addToCart(p, {}, 1)}
                  isCompared={false}
                  onToggleCompare={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};