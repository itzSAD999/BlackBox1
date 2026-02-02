import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, ShoppingCart, Package, Truck, Tag, Gift } from 'lucide-react';
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
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + tax + shipping;
  const recommendations = products.filter(p => !cart.find(c => c.id === p.id)).slice(0, 4);

  return (
    <div className="view-transition bg-black min-h-screen py-16 px-6 md:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CDA032]/[0.03] blur-[150px] rounded-full -mr-[300px] -mt-[300px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CDA032]/[0.02] blur-[120px] rounded-full -ml-[250px] -mb-[250px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CDA032] to-[#F1E08A] rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase leading-none text-white">Shopping Cart</h1>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/30 italic mt-1">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} • {formatCurrency(subtotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Items List */}
          <div className="xl:col-span-8 space-y-6">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, i) => {
                  const uniqueId = `${item.id}-${JSON.stringify(item.selectedOptions)}`;
                  return (
                    <div 
                      key={uniqueId} 
                      className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#CDA032]/30 transition-all duration-300 shadow-lg animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {/* Product Image */}
                      <div className="w-28 h-28 bg-black/50 rounded-xl p-4 flex items-center justify-center overflow-hidden border border-white/5 shrink-0 group-hover:border-white/10 transition-all">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-base font-black italic uppercase tracking-tight leading-tight text-white group-hover:text-[#CDA032] transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">
                              {item.category}
                            </p>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span 
                                    key={key}
                                    className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-wider text-white/40"
                                  >
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                             <span className="text-xl font-black text-white tracking-tight">{formatCurrency(item.price)}</span>
                             <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider">Per Unit</p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          {/* Quantity Controller */}
                          <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl px-4 py-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedOptions, -1)} 
                              className="text-white/30 hover:text-[#CDA032] transition-colors p-1 hover:bg-white/5 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-black w-8 text-center text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedOptions, 1)} 
                              className="text-white/30 hover:text-[#CDA032] transition-colors p-1 hover:bg-white/5 rounded"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Total & Remove */}
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[8px] font-bold text-white/30 uppercase tracking-wider mb-1">Subtotal</p>
                              <span className="text-lg font-black text-white tracking-tight">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            <button 
                              onClick={() => removeFromCart(uniqueId)} 
                              className="text-red-500/30 hover:text-red-500 p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all group/btn"
                            >
                              <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 text-center bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl space-y-8">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <ShoppingCart size={32} className="text-white/20" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-white/40">Your Cart is Empty</h2>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/20">Start adding items to get started</p>
                </div>
                <button 
                  onClick={() => navigateTo('store')} 
                  className="px-10 py-4 bg-gradient-to-r from-[#CDA032] to-[#F1E08A] text-black font-black uppercase text-[10px] tracking-wider rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_rgba(205,160,50,0.3)]"
                >
                  Browse Store
                </button>
              </div>
            )}

            {/* Recommendations Section */}
            {cart.length > 0 && recommendations.length > 0 && (
              <div className="pt-12 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white">You Might Also Like</h3>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/30 mt-1">Complete your setup</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {recommendations.map((p, i) => (
                    <div 
                      key={p.id}
                      className="animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <ProductCard 
                        product={p} 
                        onQuickView={onQuickView}
                        isWishlisted={wishlist.includes(p.id)}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={onAddToCart}
                        isCompared={compareIds.includes(p.id)}
                        onToggleCompare={onToggleCompare}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar Summary */}
          <aside className="xl:col-span-4 sticky top-24">
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
              <h2 className="text-xl font-black italic uppercase tracking-tight border-b border-white/10 pb-5 text-white flex items-center gap-3">
                <Package size={20} className="text-[#CDA032]" />
                Order Summary
              </h2>
              
              {/* Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                   <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                   <span className="text-white font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                   <span>Tax (12.5% VAT)</span>
                   <span className="text-white font-black">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                   <div className="flex items-center gap-2">
                     <Truck size={12} />
                     <span>Shipping</span>
                   </div>
                   <span className={`font-black ${shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                     {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                   </span>
                </div>
                
                {/* Free shipping progress */}
                {shipping > 0 && subtotal < 5000 && (
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-white/30">
                      <span>Add {formatCurrency(5000 - subtotal)} for free shipping</span>
                      <span>{Math.round((subtotal / 5000) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#CDA032] to-[#F1E08A] transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>
                
                {/* Total */}
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/40">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-[#CDA032] to-[#F1E08A] bg-clip-text text-transparent block">
                      {formatCurrency(total)}
                    </span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-wider">Inc. all taxes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleCheckout(total)}
                  disabled={cart.length === 0}
                  className="w-full py-5 bg-gradient-to-r from-[#CDA032] to-[#F1E08A] text-black rounded-full text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_15px_50px_rgba(205,160,50,0.3)] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Proceed to Checkout
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                
                <button 
                  onClick={() => navigateTo('store')} 
                  className="w-full py-5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/20 transition-all text-white/50 hover:text-white"
                >
                  <ArrowLeft size={16} /> 
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 space-y-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-white/30">
                  <ShieldCheck size={16} className="text-green-400" />
                  <p className="text-[9px] font-bold uppercase tracking-wider">Secure Checkout</p>
                </div>
                <div className="flex items-center gap-3 text-white/30">
                  <Truck size={16} className="text-blue-400" />
                  <p className="text-[9px] font-bold uppercase tracking-wider">Free Shipping Over GHS 5,000</p>
                </div>
                <div className="flex items-center gap-3 text-white/30">
                  <Gift size={16} className="text-[#CDA032]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider">Gift Wrapping Available</p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} className="text-[#CDA032]" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Have a Promo Code?</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code"
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#CDA032]/30 transition-all"
                  />
                  <button className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};