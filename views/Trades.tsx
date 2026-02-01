
import React, { useState, useMemo } from 'react';
import { RefreshCcw, Smartphone, ArrowRight, Zap, ShieldCheck, Check, Sparkles, Scale, Info, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';

interface TradesProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  notify: (msg: string) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
}

export const Trades: React.FC<TradesProps> = ({ 
  products, onAddToCart, notify, onQuickView, wishlist, toggleWishlist, compareIds, onToggleCompare 
}) => {
  const [currentPhone, setCurrentPhone] = useState<string>('');
  const [condition, setCondition] = useState<string>('excellent');
  const [targetPhoneId, setTargetPhoneId] = useState<string>('');
  const [targetSearch, setTargetSearch] = useState<string>('');

  const targetPhones = useMemo(() => {
    return products.filter(p => 
      p.category === 'iPhone' && 
      (targetSearch === '' || p.name.toLowerCase().includes(targetSearch.toLowerCase()))
    );
  }, [products, targetSearch]);

  const relatedHardware = useMemo(() => products.filter(p => p.category === 'Accessories' || p.category === 'Audio').slice(0, 4), [products]);

  const valuations: Record<string, number> = {
    'iPhone 11': 1500,
    'iPhone 12': 2500,
    'iPhone 13': 3500,
    'iPhone 14': 5000,
    'iPhone 15': 6500,
  };

  const conditionMultiplier: Record<string, number> = {
    'excellent': 1.0,
    'good': 0.85,
    'fair': 0.6,
    'poor': 0.3,
  };

  const tradeInValue = useMemo(() => {
    if (!currentPhone) return 0;
    const base = valuations[currentPhone] || 1000;
    return base * conditionMultiplier[condition];
  }, [currentPhone, condition]);

  const targetPhone = useMemo(() => targetPhones.find(p => p.id === targetPhoneId), [targetPhoneId, targetPhones]);
  const difference = targetPhone ? Math.max(0, targetPhone.price - tradeInValue) : 0;

  return (
    <div className="view-transition bg-black min-h-screen py-16 px-6 md:px-12 no-print">
      <div className="max-w-[1440px] mx-auto space-y-20">
        
        {/* Header */}
        <div className="space-y-6 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="w-20 h-20 bg-[#B38B21] rounded-3xl flex items-center justify-center text-black shadow-[0_10px_40px_rgba(179,139,33,0.3)]">
                 <RefreshCcw size={40} className="animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">HARDWARE <br/><span className="text-[#B38B21]">TRADES.</span></h1>
                <p className="text-[11px] font-black text-[#B38B21]/40 uppercase tracking-[0.6em] italic">/ UPGRADE YOUR BASELINE FROM REPOSITORY INVENTORY</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Main Calculation Flow */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Step 1: Legacy Unit Selection */}
            <div className="bg-[#080808] border border-white/[0.03] rounded-[3.5rem] p-10 md:p-16 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#B38B21]/[0.02] blur-[120px] rounded-full"></div>
               
               <div className="space-y-10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-6">
                    <span className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-sm not-italic text-white/40">01</span>
                    Legacy Unit Diagnostics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">MODEL IDENTITY</label>
                       <select 
                        value={currentPhone}
                        onChange={(e) => setCurrentPhone(e.target.value)}
                        className="w-full bg-[#030303] border border-white/[0.03] rounded-2xl px-8 py-6 text-sm font-black uppercase tracking-widest outline-none text-white focus:border-[#B38B21]/30 transition-all appearance-none cursor-pointer italic"
                       >
                         <option value="">Select current model</option>
                         {Object.keys(valuations).map(v => <option key={v} value={v}>{v}</option>)}
                         <option value="Other">Other Apple Device</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">CHASSIS CONDITION</label>
                       <select 
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full bg-[#030303] border border-white/[0.03] rounded-2xl px-8 py-6 text-sm font-black uppercase tracking-widest outline-none text-white focus:border-[#B38B21]/30 transition-all appearance-none cursor-pointer italic"
                       >
                         <option value="excellent">Excellent (Zero Faults)</option>
                         <option value="good">Good (Light Wear)</option>
                         <option value="fair">Fair (Scratched/Dents)</option>
                         <option value="poor">Poor (Cracked Display)</option>
                       </select>
                    </div>
                  </div>
               </div>

               <div className="pt-12 border-t border-white/[0.03] flex items-center justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">LEGACY UNIT VALUATION</p>
                    <p className="text-5xl font-black italic tracking-tighter text-[#B38B21] drop-shadow-[0_0_20px_rgba(179,139,33,0.2)]">{formatCurrency(tradeInValue)}</p>
                  </div>
                  <div className="hidden md:block opacity-5">
                    <Smartphone size={100} />
                  </div>
               </div>
            </div>

            {/* Step 2: Target Hardware from Repository */}
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-6">
                  <span className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-sm not-italic text-white/40">02</span>
                  Select Target Hardware
                </h3>
                <div className="relative w-full md:w-80">
                   <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                   <input 
                    placeholder="FILTER REPOSITORY..."
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    className="w-full bg-[#080808] border border-white/[0.03] rounded-full pl-14 pr-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#B38B21]/30 transition-all"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {targetPhones.length > 0 ? targetPhones.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setTargetPhoneId(p.id)}
                    className={`group relative bg-[#080808] border rounded-[3rem] p-10 cursor-pointer transition-all duration-500 flex flex-col items-center text-center gap-6 ${targetPhoneId === p.id ? 'border-[#B38B21] ring-1 ring-[#B38B21]/50 shadow-2xl' : 'border-white/[0.03] hover:border-white/10 shadow-xl'}`}
                  >
                     {targetPhoneId === p.id && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-[#B38B21] text-black rounded-full flex items-center justify-center shadow-lg">
                           <Check size={18} strokeWidth={3} />
                        </div>
                     )}
                     <div className="w-32 h-32 bg-black rounded-2xl flex items-center justify-center p-4">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">/ {p.id}</p>
                        <h4 className="text-[13px] font-black italic uppercase tracking-widest group-hover:text-[#B38B21] transition-colors">{p.name}</h4>
                        <p className="text-xl font-black text-white italic tracking-tighter">{formatCurrency(p.price)}</p>
                     </div>
                     <div className="w-full h-px bg-white/[0.03] mt-2"></div>
                     <div className="flex flex-wrap justify-center gap-2">
                        {p.specs?.slice(0, 2).map((s, i) => (
                           <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/30 italic">
                             {s}
                           </span>
                        ))}
                     </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-32 bg-[#080808] rounded-[3rem] border-2 border-dashed border-white/[0.03] flex flex-col items-center justify-center opacity-10">
                    <Info size={48} className="mb-6" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] italic">No hardware units match filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Matrix Analysis Sidebar */}
          <aside className="lg:col-span-4 sticky top-32">
             <div className="bg-[#080808] border border-white/[0.03] rounded-[3.5rem] p-12 space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#B38B21]/[0.05] blur-[100px] rounded-full -mr-24 -mt-24"></div>
                
                <h2 className="text-3xl font-black italic uppercase tracking-tighter border-b border-white/[0.03] pb-8 flex items-center gap-4">
                  <Scale size={24} className="text-[#B38B21]" />
                  ANALYSIS.
                </h2>
                
                <div className="space-y-10">
                  {/* Visual Comparison Matrix */}
                  <div className="grid grid-cols-2 gap-px bg-white/[0.03] rounded-3xl overflow-hidden border border-white/[0.05]">
                     <div className="bg-black p-6 space-y-4">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">LEGACY UNIT</p>
                        <div className="h-24 flex items-center justify-center text-white/10 italic text-[10px] font-black border-2 border-dashed border-white/[0.02] rounded-xl">
                           {currentPhone || 'NO INPUT'}
                        </div>
                        <p className="text-lg font-black text-white/40 italic">{formatCurrency(tradeInValue)}</p>
                     </div>
                     <div className="bg-black p-6 space-y-4 border-l border-white/[0.03]">
                        <p className="text-[9px] font-black text-[#B38B21] uppercase tracking-[0.3em]">TARGET UNIT</p>
                        <div className="h-24 bg-white/[0.01] flex items-center justify-center rounded-xl overflow-hidden">
                           {targetPhone ? (
                             <img src={targetPhone.image} alt="" className="w-16 h-16 object-contain" />
                           ) : (
                             <div className="italic text-[10px] font-black text-white/5 uppercase tracking-widest">AWAITING</div>
                           )}
                        </div>
                        <p className="text-lg font-black text-white italic">{targetPhone ? formatCurrency(targetPhone.price) : '---'}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/20">
                       <span>VALUATION GAP</span>
                       <span className="text-[#B38B21] italic">{formatCurrency(difference)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/10">
                       <span>VAT (12.5% EST.)</span>
                       <span className="italic">INCLUDED</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/[0.03] my-12"></div>
                  
                  <div className="flex justify-between items-end gap-10">
                    <div className="space-y-2">
                      <span className="text-[13px] font-black uppercase tracking-[0.6em] text-white/20 italic leading-none">DIFFERENCE</span>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/10 italic">AUTHORIZATION REQUIRED</p>
                    </div>
                    <span className="text-6xl font-black italic tracking-tighter text-[#B38B21] drop-shadow-[0_0_40px_rgba(179,139,33,0.1)]">{formatCurrency(difference)}</span>
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <button 
                    disabled={!targetPhoneId || !currentPhone}
                    onClick={() => {
                      notify('Trade-in reservation initiated. Diagnostic appointment scheduled.');
                    }}
                    className="w-full py-7 bg-[#B38B21] text-black rounded-full text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_50px_rgba(179,139,33,0.2)] disabled:opacity-20 disabled:grayscale"
                  >
                    AUTHORIZE EXCHANGE <ArrowRight size={20} />
                  </button>
                  <div className="flex items-center justify-center gap-3 text-white/20">
                    <ShieldCheck size={14} className="text-[#B38B21]" />
                    <p className="text-[9px] font-bold uppercase tracking-widest italic leading-none">Precision Exchange Program</p>
                  </div>
                </div>
             </div>
          </aside>
        </div>

        {/* Related Hardware - Bottom Section */}
        <div className="pt-32 space-y-16">
           <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/[0.03] pb-10 gap-8">
              <div className="space-y-3">
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">UPGRADE ESSENTIALS.</h2>
                 <p className="text-[11px] font-black text-[#B38B21]/40 uppercase tracking-[0.6em] italic">/ COMPLETE YOUR NEW KIT</p>
              </div>
              <Link to="/store" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#B38B21] transition-colors flex items-center gap-4">
                 EXPLORE REPOSITORY <ArrowRight size={14} />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedHardware.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onQuickView={onQuickView}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={onAddToCart}
                  isCompared={compareIds.includes(p.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
