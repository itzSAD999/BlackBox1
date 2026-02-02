import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, ShoppingCart } from 'lucide-react';
import { CartItem, Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';

interface CartProps {
  cart: CartItem[];
  products: Product[];
  updateQuantity: (id: string, options: Record<string, string> | undefined, delta: number) => void;
  removeFromCart: (uniqueId: string) => void;
  handleCheckout: (total: number) => void;
  navigateTo: (view: string, id?: string) => void;
  onQuickView: (p: Product) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  compareIds: string[];
  onAddToCart: (p: Product) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, products, updateQuantity, removeFromCart, handleCheckout, navigateTo, onQuickView, wishlist, toggleWishlist, onToggleCompare, compareIds, onAddToCart
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.125;
  const total = subtotal + tax;
  const recommendations = products.filter(p => !cart.find(c => c.id === p.id)).slice(0, 4);

  return (
    <div className="view-transition bg-black min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto space-y-20">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">SHOPPING CART</h1>
          <p className="text-white/10 text-[12px] font-black uppercase tracking-[0.5em] italic">{cart.length} ITEMS IN YOUR CART</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-8 space-y-8">
            {cart.length > 0 ? (
              <div className="space-y-6">
                {cart.map((item) => {
                  const uniqueId = `${item.id}-${JSON.stringify(item.selectedOptions)}`;
                  return (
                    <div key={uniqueId} className="bg-[#080808] border border-white/[0.02] rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-10 group hover:border-[#F1E5AC]/10 transition-all duration-500 shadow-xl">
                      <div className="w-40 h-40 bg-[#030303] rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-white/[0.02]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[1s]" />
                      </div>
                      <div className="flex-1 w-full space-y-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-1">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight text-white">{item.name}</h3>
                            <p className="text-[10px] font-black text-[#F1E5AC]/60 uppercase tracking-[0.3em] italic">/ {item.category}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-2xl font-black text-white tracking-tighter">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                          <div className="flex items-center gap-8 bg-[#030303] border border-white/5 rounded-xl px-6 py-3">
                            <button onClick={() => updateQuantity(item.id, item.selectedOptions, -1)} className="text-white/10 hover:text-[#F1E5AC] transition-colors"><Minus size={16} /></button>
                            <span className="text-lg font-black w-8 text-center text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedOptions, 1)} className="text-white/10 hover:text-[#F1E5AC] transition-colors"><Plus size={16} /></button>
                          </div>
                          <div className="flex items-center gap-8">
                            <span className="text-xl font-black text-white/10 tracking-tighter">{formatCurrency(item.price * item.quantity)}</span>
                            <button onClick={() => removeFromCart(uniqueId)} className="text-red-500/20 hover:text-red-500 p-3 bg-red-500/5 rounded-full transition-all"><Trash2 size={20} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-40 text-center bg-[#080808] border-2 border-white/[0.02] border-dashed rounded-[4rem] space-y-8">
                <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-10">
                  <ShoppingCart size={40} className="text-white/5" />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white/10">YOUR BAG IS CURRENTLY EMPTY.</h2>
                <button onClick={() => navigateTo('store')} className="px-16 py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-xl hover:scale-105 transition-all shadow-2xl">START SHOPPING</button>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-[#080808] border border-white/[0.03] rounded-[3rem] p-10 space-y-10 shadow-2xl">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter border-b border-white/[0.03] pb-6 text-white">ORDER SUMMARY</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/20">
                   <span>SUBTOTAL ({cart.length} ITEMS)</span>
                   <span className="text-white italic">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/20">
                   <span>ESTIMATED TAX (12.5% VAT)</span>
                   <span className="text-white italic">{formatCurrency(tax)}</span>
                </div>
                <div className="h-[1px] bg-white/[0.03] my-8"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/10 italic">TOTAL</span>
                  <span className="text-5xl font-black italic tracking-tighter text-[#F1E5AC] shadow-[0_0_30px_rgba(241,229,172,0.05)]">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleCheckout(total)}
                  disabled={cart.length === 0}
                  className="w-full py-6 bg-white/[0.03] text-white/30 border border-white/[0.05] rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-[#F1E5AC] hover:text-black hover:border-[#F1E5AC] transition-all shadow-xl disabled:opacity-20"
                >
                  PROCEED TO CHECKOUT <ArrowRight size={18} />
                </button>
                <button onClick={() => navigateTo('store')} className="w-full py-6 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-white/[0.05] transition-all text-white/40">
                  <ArrowLeft size={16} /> CONTINUE SHOPPING
                </button>
              </div>

              <div className="pt-8 flex items-center gap-4 border-t border-white/[0.03] opacity-10">
                <ShieldCheck size={24} className="text-white" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-white">Secured Terminal // 256-Bit Identity Encryption</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};