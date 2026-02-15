import React, { useState, useMemo } from 'react';
import { RefreshCcw, Smartphone, ArrowRight, Zap, ShieldCheck, Check, Sparkles, Scale, Info, Search, TrendingUp, Award, Clock, CheckCircle2 } from 'lucide-react';
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

  const conditionLabels: Record<string, { label: string; desc: string; color: string }> = {
    'excellent': { label: 'Excellent', desc: 'Zero Faults • Pristine Condition', color: 'text-green-400' },
    'good': { label: 'Good', desc: 'Light Wear • Fully Functional', color: 'text-blue-400' },
    'fair': { label: 'Fair', desc: 'Scratched/Dents • Works Fine', color: 'text-yellow-400' },
    'poor': { label: 'Poor', desc: 'Cracked Display • Needs Repair', color: 'text-red-400' },
  };

  const tradeInValue = useMemo(() => {
    if (!currentPhone) return 0;
    const base = valuations[currentPhone] || 1000;
    return base * conditionMultiplier[condition];
  }, [currentPhone, condition]);

  const targetPhone = useMemo(() => targetPhones.find(p => p.id === targetPhoneId), [targetPhoneId, targetPhones]);
  const difference = targetPhone ? Math.max(0, targetPhone.price - tradeInValue) : 0;
  const savings = targetPhone ? tradeInValue : 0;
  const savingsPercent = targetPhone ? Math.round((tradeInValue / targetPhone.price) * 100) : 0;

  return (
    <div className="view-transition bg-black min-h-screen py-16 px-6 md:px-12 no-print relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#B38B21]/[0.03] blur-[150px] rounded-full -mr-[400px] -mt-[400px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#B38B21]/[0.02] blur-[120px] rounded-full -ml-[300px] -mb-[300px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-24 relative z-10">
        
        {/* Enhanced Header */}
        <div className="space-y-8">
           <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#B38B21]/20 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] rounded-3xl flex items-center justify-center text-black shadow-2xl transform group-hover:scale-110 transition-transform">
                    <RefreshCcw size={48} className="animate-spin-slow" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h6 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                    Trade IN <br/>
                    <span className="bg-gradient-to-r from-[#B38B21] to-[#D4AF37] bg-clip-text text-transparent"></span>
                  </h6>

                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-4">
                <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 min-w-[140px] group hover:border-[#B38B21]/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={16} className="text-[#B38B21]" />
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">VALUE</p>
                  </div>
                  <p className="text-2xl font-black italic text-white">{formatCurrency(tradeInValue)}</p>
                </div>
                <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 min-w-[140px] group hover:border-[#B38B21]/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-[#B38B21]" />
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">INSTANT</p>
                  </div>
                  <p className="text-2xl font-black italic text-white">QUOTE</p>
                </div>
              </div>
           </div>

           {/* Trust Badges */}
           <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Data Wiped Securely</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                <Award size={14} className="text-[#B38B21]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Same Day Processing</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* Main Calculation Flow */}
          <div className="xl:col-span-8 space-y-10">
            
            {/* Step 1: Legacy Unit Selection - Enhanced */}
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[3.5rem] p-10 md:p-16 space-y-12 shadow-2xl relative overflow-hidden group">
               {/* Animated glow */}
               <div className="absolute top-0 right-0 w-72 h-72 bg-[#B38B21]/[0.05] blur-[140px] rounded-full group-hover:bg-[#B38B21]/[0.08] transition-all duration-1000"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B38B21]/[0.03] blur-[100px] rounded-full"></div>
               
               <div className="space-y-10 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-6">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B38B21] to-[#D4AF37] flex items-center justify-center text-sm not-italic text-black font-black shadow-lg">01</span>
                      Device Condition 
                    </h3>
                    <div className="hidden md:flex items-center gap-3 px-5 py-2 bg-[#B38B21]/10 rounded-full border border-[#B38B21]/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#B38B21]"></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Model Selection */}
                    <div className="space-y-5 group/input">
                       <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                         <Smartphone size={12} className="text-[#B38B21]" />
                         MODEL IDENTITY
                       </label>
                       <div className="relative">
                         <select 
                          value={currentPhone}
                          onChange={(e) => setCurrentPhone(e.target.value)}
                          className="w-full bg-black/50 border-2 border-white/10 rounded-2xl px-8 py-6 text-sm font-black uppercase tracking-widest outline-none text-white focus:border-[#B38B21]/50 hover:border-white/20 transition-all appearance-none cursor-pointer italic backdrop-blur-sm"
                         >
                           <option value="">Select Current Model</option>
                           {Object.keys(valuations).map(v => <option key={v} value={v}>{v}</option>)}
                           <option value="Other">Other Apple Device</option>
                         </select>
                         <ArrowRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none rotate-90" />
                       </div>
                    </div>

                    {/* Condition Selection */}
                    <div className="space-y-5">
                       <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                         <Scale size={12} className="text-[#B38B21]" />
                         CHASSIS CONDITION
                       </label>
                       <div className="space-y-3">
                         {Object.entries(conditionLabels).map(([key, { label, desc, color }]) => (
                           <button
                             key={key}
                             onClick={() => setCondition(key)}
                             className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                               condition === key 
                                 ? 'bg-[#B38B21]/10 border-[#B38B21] shadow-lg' 
                                 : 'bg-black/30 border-white/5 hover:border-white/20'
                             }`}
                           >
                             <div className="flex items-center justify-between">
                               <div className="space-y-1">
                                 <p className={`text-xs font-black uppercase tracking-widest ${condition === key ? color : 'text-white/60'}`}>
                                   {label}
                                 </p>
                                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{desc}</p>
                               </div>
                               {condition === key && (
                                 <div className="w-6 h-6 bg-[#B38B21] rounded-full flex items-center justify-center">
                                   <Check size={14} className="text-black" strokeWidth={3} />
                                 </div>
                               )}
                             </div>
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
               </div>

               {/* Valuation Display - Enhanced */}
               <div className="pt-12 border-t border-white/10 flex items-center justify-between gap-8 relative">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic flex items-center gap-2">
                      <TrendingUp size={12} className="text-[#B38B21]" />
                      DEVICE VALUATION
                    </p>
                    <div className="flex items-baseline gap-4">
                      <p className="text-6xl md:text-7xl font-black italic tracking-tighter bg-gradient-to-r from-[#B38B21] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(179,139,33,0.3)] animate-in fade-in zoom-in-95 duration-700">
                        {formatCurrency(tradeInValue)}
                      </p>
                      {currentPhone && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-[#B38B21] uppercase tracking-widest">
                            {Math.round(conditionMultiplier[condition] * 100)}% Value
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="hidden lg:block opacity-10">
                    <Smartphone size={120} strokeWidth={1} />
                  </div>
               </div>
            </div>

            {/* Step 2: Target Hardware - Enhanced */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#080808] border border-white/5 rounded-3xl p-8">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-6">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B38B21] to-[#D4AF37] flex items-center justify-center text-sm not-italic text-black font-black shadow-lg">02</span>
                  Select Target Hardware
                </h3>
                <div className="relative w-full md:w-96 group">
                   <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#B38B21] transition-colors" />
                   <input 
                    placeholder="SEARCH ITEMS..."
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-2xl pl-14 pr-6 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#B38B21]/50 transition-all backdrop-blur-sm"
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {targetPhones.length > 0 ? targetPhones.map((p, i) => (
                  <div 
                    key={p.id}
                    onClick={() => setTargetPhoneId(p.id)}
                    className={`group relative bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-2 rounded-3xl p-8 cursor-pointer transition-all duration-500 flex flex-col items-center text-center gap-6 hover:shadow-2xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${
                      targetPhoneId === p.id 
                        ? 'border-[#B38B21] ring-2 ring-[#B38B21]/30 shadow-[0_20px_60px_rgba(179,139,33,0.3)]' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                     {/* Selection Badge */}
                     {targetPhoneId === p.id && (
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-xl animate-in zoom-in-95 duration-300">
                           <Check size={20} strokeWidth={3} />
                        </div>
                     )}
                     
                     {/* Glow effect */}
                     <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
                       targetPhoneId === p.id ? 'opacity-100' : 'opacity-0'
                     }`}>
                       <div className="absolute inset-0 bg-[#B38B21]/10 blur-2xl"></div>
                     </div>

                     {/* Product Image */}
                     <div className="relative w-40 h-40 bg-black rounded-2xl flex items-center justify-center p-6 border border-white/5 group-hover:border-white/10 transition-all overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#B38B21]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-contain transition-transform group-hover:scale-110 relative z-10" 
                        />
                     </div>

                     {/* Product Info */}
                     <div className="space-y-3 w-full">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">/ {p.id}</p>
                        <h4 className="text-sm font-black italic uppercase tracking-wider group-hover:text-[#B38B21] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-2xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent italic tracking-tighter">
                          {formatCurrency(p.price)}
                        </p>
                     </div>

                     {/* Specs */}
                     <div className="w-full h-px bg-white/5 my-2"></div>
                     <div className="flex flex-wrap justify-center gap-2 w-full">
                        {p.specs?.slice(0, 3).map((s, idx) => (
                           <span 
                             key={idx} 
                             className="px-3 py-1.5 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40 italic border border-white/5"
                           >
                             {s}
                           </span>
                        ))}
                     </div>
                  </div>
                )) : (
                  <div className="col-span-full py-32 bg-gradient-to-br from-[#080808] to-black rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center">
                    <Info size={56} className="mb-6 text-white/10" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] italic text-white/20">No Hardware Units Match Filter</p>
                    <button 
                      onClick={() => setTargetSearch('')}
                      className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Analysis Sidebar */}
          <aside className="xl:col-span-4 sticky top-24 space-y-6">
             {/* Main Analysis Card */}
             <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-2 border-white/10 rounded-[3.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B38B21]/[0.08] blur-[120px] rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
                
                <h2 className="text-3xl font-black italic uppercase tracking-tighter border-b-2 border-white/10 pb-6 flex items-center gap-4 relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] rounded-xl flex items-center justify-center">
                    <Scale size={20} className="text-black" />
                  </div>
                  ANALYSIS
                </h2>
                
                <div className="space-y-8 relative">
                  {/* Visual Comparison - Enhanced */}
                  <div className="bg-black/50 rounded-3xl p-6 border-2 border-white/5">
                     <div className="grid grid-cols-2 gap-6">
                        {/* Legacy Unit */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Legacy</p>
                          </div>
                          <div className="h-32 flex items-center justify-center bg-white/5 rounded-2xl border-2 border-dashed border-white/5">
                             {currentPhone ? (
                               <p className="text-xs font-black text-white/60 italic text-center px-2">{currentPhone}</p>
                             ) : (
                               <p className="text-[9px] font-black text-white/10 italic uppercase tracking-widest">Awaiting</p>
                             )}
                          </div>
                          <p className="text-xl font-black text-white/50 italic text-center">{formatCurrency(tradeInValue)}</p>
                        </div>

                        {/* Target Unit */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-[9px] font-black text-[#B38B21] uppercase tracking-[0.3em]">Target</p>
                          </div>
                          <div className="h-32 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center rounded-2xl border-2 border-white/10 overflow-hidden">
                             {targetPhone ? (
                               <img src={targetPhone.image} alt="" className="w-20 h-20 object-contain" />
                             ) : (
                               <p className="text-[9px] font-black text-white/10 italic uppercase tracking-widest">Awaiting</p>
                             )}
                          </div>
                          <p className="text-xl font-black text-white italic text-center">
                            {targetPhone ? formatCurrency(targetPhone.price) : '---'}
                          </p>
                        </div>
                     </div>

                     {/* Exchange Arrow */}
                     <div className="flex justify-center -my-2">
                       <div className="w-12 h-12 bg-[#B38B21] rounded-full flex items-center justify-center shadow-lg">
                         <RefreshCcw size={20} className="text-black" />
                       </div>
                     </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-4 bg-black/30 rounded-2xl p-6 border border-white/5">
                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                       <span className="text-white/30">Your Device Value</span>
                       <span className="text-green-400 italic">{formatCurrency(tradeInValue)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                       <span className="text-white/30">Target Price</span>
                       <span className="text-white/60 italic">{targetPhone ? formatCurrency(targetPhone.price) : '---'}</span>
                    </div>
                    <div className="h-px bg-white/10 my-3"></div>
                    <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                       <span className="text-white/50">Balance Due</span>
                       <span className="text-[#B38B21] text-xl italic">{formatCurrency(difference)}</span>
                    </div>
                    {targetPhone && (
                      <div className="pt-3 flex items-center gap-2 justify-center">
                        <Sparkles size={14} className="text-green-400" />
                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">
                          Save {savingsPercent}% with Trade-In
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  {/* Total Display */}
                  <div className="text-center space-y-3 py-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/30 italic block">
                      Final Payment
                    </span>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#B38B21]/20 blur-3xl"></div>
                      <p className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-[#B38B21] to-[#D4AF37] bg-clip-text text-transparent relative">
                        {formatCurrency(difference)}
                      </p>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 italic">
                      Inc. VAT (12.5%)
                    </p>
                  </div>
                </div>

                {/* CTA Button - Enhanced */}
                <div className="space-y-6 pt-6 border-t-2 border-white/5">
                  <button 
                    disabled={!targetPhoneId || !currentPhone}
                    onClick={() => {
                      notify('Trade-in reservation initiated. Diagnostic appointment scheduled.');
                    }}
                    className="w-full py-7 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black rounded-full text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:shadow-[0_20px_60px_rgba(179,139,33,0.5)] active:scale-[0.98] transition-all shadow-[0_15px_50px_rgba(179,139,33,0.3)] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      TRADE 
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                  
                  <div className="flex items-center justify-center gap-3 text-white/30">
                    <ShieldCheck size={14} className="text-[#B38B21]" />
                    <p className="text-[9px] font-bold uppercase tracking-widest italic">Precision Exchange Program</p>
                  </div>
                </div>
             </div>

             {/* Trust Badge Card */}
             <div className="bg-gradient-to-br from-[#B38B21]/10 to-transparent border border-[#B38B21]/20 rounded-3xl p-8 space-y-4">
               <div className="flex items-center gap-3">
                 <Award size={24} className="text-[#B38B21]" />
                 <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Best Value Guarantee</h3>
               </div>
               <p className="text-[10px] font-bold text-white/40 leading-relaxed">
                 We guarantee the highest trade-in value. Find a better offer within 48 hours and we'll match it plus 10%.
               </p>
             </div>
          </aside>
        </div>

        {/* Related Hardware - Enhanced */}
        <div className="pt-32 space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-white/10 pb-10 gap-8">
              <div className="space-y-4">
                 <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                   UPGRADE ESSENTIALS
                 </h2>
                 <p className="text-[11px] font-black text-[#B38B21]/50 uppercase tracking-[0.6em] italic flex items-center gap-2">
                   <Sparkles size={12} />
                   COMPLETE YOUR NEW KIT
                 </p>
              </div>
              <Link 
                to="/store" 
                className="group text-[11px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-[#B38B21] transition-all flex items-center gap-4 px-6 py-3 border-2 border-white/10 hover:border-[#B38B21]/30 rounded-full"
              >
                 Search?
                 <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedHardware.map((p, i) => (
                <div 
                  key={p.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${i * 150}ms` }}
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
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};