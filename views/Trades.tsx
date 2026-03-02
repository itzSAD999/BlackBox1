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
  const [currentPhone, setCurrentPhone] = useState('');
  const [condition, setCondition] = useState('excellent');
  const [targetPhoneId, setTargetPhoneId] = useState('');
  const [targetSearch, setTargetSearch] = useState('');

  const targetPhones = useMemo(() =>
    products.filter(p =>
      p.category === 'iPhone' &&
      (targetSearch === '' || p.name.toLowerCase().includes(targetSearch.toLowerCase()))
    ), [products, targetSearch]);

  const relatedHardware = useMemo(() =>
    products.filter(p => p.category === 'Accessories' || p.category === 'Audio').slice(0, 4),
    [products]);

  const valuations: Record<string, number> = {
    'iPhone 11': 1500, 'iPhone 12': 2500, 'iPhone 13': 3500,
    'iPhone 14': 5000, 'iPhone 15': 6500,
  };

  const conditionMultiplier: Record<string, number> = {
    excellent: 1.0, good: 0.85, fair: 0.6, poor: 0.3,
  };

  const conditionLabels: Record<string, { label: string; desc: string; dot: string }> = {
    excellent: { label: 'Excellent', desc: 'Zero faults · Pristine', dot: 'bg-emerald-400' },
    good: { label: 'Good', desc: 'Light wear · Functional', dot: 'bg-blue-400' },
    fair: { label: 'Fair', desc: 'Scratched · Works fine', dot: 'bg-amber-400' },
    poor: { label: 'Poor', desc: 'Cracked · Needs repair', dot: 'bg-red-400' },
  };

  const tradeInValue = useMemo(() => {
    if (!currentPhone) return 0;
    return (valuations[currentPhone] || 1000) * conditionMultiplier[condition];
  }, [currentPhone, condition]);

  const targetPhone = useMemo(() => targetPhones.find(p => p.id === targetPhoneId), [targetPhoneId, targetPhones]);
  const difference = targetPhone ? Math.max(0, targetPhone.price - tradeInValue) : 0;
  const savingsPct = targetPhone ? Math.round((tradeInValue / targetPhone.price) * 100) : 0;

  return (
    <div className="min-h-screen no-print relative" style={{ backgroundColor: 'var(--bb-bg)', color: 'var(--bb-text)' }}>

      {/* Subtle bg glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #B38B21 0%, transparent 70%)', filter: 'blur(120px)', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #B38B21 0%, transparent 70%)', filter: 'blur(100px)', transform: 'translate(-40%, 40%)' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 relative z-10 space-y-10 sm:space-y-12">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#B38B21' }}>
                <RefreshCcw size={16} className="text-black" style={{ animation: 'spin 8s linear infinite' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30">Exchange Program</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-white">Trade In</h1>
            <p className="text-xs text-white/30 font-medium mt-1">Get the best value for your current device</p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <CheckCircle2 size={12} className="text-emerald-400" />, label: 'Data Wiped Securely' },
              { icon: <Award size={12} style={{ color: '#B38B21' }} />, label: 'Best Price Guarantee' },
              { icon: <Zap size={12} className="text-amber-400" />, label: 'Same Day Processing' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {b.icon}
                <span className="text-[10px] font-semibold tracking-wide text-white/40">{b.label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Left: Steps */}
          <div className="xl:col-span-8 space-y-8">

            {/* Step 1 */}
            <section className="rounded-2xl p-6 md:p-8 space-y-6" style={{ backgroundColor: 'var(--bb-surface)' }}>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg text-[10px] font-black text-black flex items-center justify-center" style={{ backgroundColor: '#B38B21' }}>01</span>
                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Your Device</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Model select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                    <Smartphone size={11} style={{ color: '#B38B21' }} /> Model
                  </label>
                  <div className="relative">
                    <select
                      value={currentPhone}
                      onChange={e => setCurrentPhone(e.target.value)}
                      className="w-full border border-white/8 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none appearance-none cursor-pointer transition-all focus:border-white/20"
                      style={{ backgroundColor: 'var(--bb-bg)' }}
                    >
                      <option value="">Select model</option>
                      {Object.keys(valuations).map(v => <option key={v} value={v}>{v}</option>)}
                      <option value="Other">Other Apple Device</option>
                    </select>
                    <ArrowRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none rotate-90" />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                    <Scale size={11} style={{ color: '#B38B21' }} /> Condition
                  </label>
                  <div className="space-y-1.5">
                    {Object.entries(conditionLabels).map(([key, { label, desc, dot }]) => (
                      <button
                        key={key}
                        onClick={() => setCondition(key)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between
                          ${condition === key
                            ? 'border-white/20 bg-white/5'
                            : 'border-white/5 hover:border-white/10'
                          }`}
                        style={{ backgroundColor: condition === key ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                          <span className="text-xs font-semibold text-white/70">{label}</span>
                          <span className="text-[10px] text-white/25 hidden sm:block">— {desc}</span>
                        </div>
                        {condition === key && (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B38B21' }}>
                            <Check size={10} className="text-black" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Valuation row */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Estimated Value</p>
                  <p className="text-2xl font-black tracking-tight" style={{ color: '#B38B21' }}>
                    {formatCurrency(tradeInValue)}
                  </p>
                </div>
                {currentPhone && (
                  <span className="text-xs font-semibold text-white/30 px-3 py-1.5 rounded-lg border border-white/8">
                    {Math.round(conditionMultiplier[condition] * 100)}% of base value
                  </span>
                )}
              </div>
            </section>

            {/* Step 2 */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg text-[10px] font-black text-black flex items-center justify-center" style={{ backgroundColor: '#B38B21' }}>02</span>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Select New Device</h2>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    placeholder="Search..."
                    value={targetSearch}
                    onChange={e => setTargetSearch(e.target.value)}
                    className="w-full border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-white outline-none transition-all focus:border-white/20"
                    style={{ backgroundColor: 'var(--bb-surface)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {targetPhones.length > 0 ? targetPhones.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setTargetPhoneId(p.id)}
                    className="relative rounded-2xl border cursor-pointer transition-all duration-300 p-4 flex flex-col items-center gap-3 text-center group"
                    style={{
                      backgroundColor: targetPhoneId === p.id ? 'rgba(179,139,33,0.06)' : '#0d0d0b',
                      borderColor: targetPhoneId === p.id ? 'rgba(179,139,33,0.5)' : 'rgba(255,255,255,0.06)',
                      boxShadow: targetPhoneId === p.id ? '0 0 20px rgba(179,139,33,0.12)' : 'none',
                    }}
                  >
                    {targetPhoneId === p.id && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#B38B21' }}>
                        <Check size={10} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--bb-bg)' }}>
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{p.category}</p>
                      <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-sm font-black text-white">{formatCurrency(p.price)}</p>
                    </div>
                    {p.specs && p.specs.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {p.specs.slice(0, 2).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[9px] font-semibold text-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="col-span-full py-16 rounded-2xl border border-dashed border-white/8 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--bb-surface)' }}>
                    <Info size={32} className="text-white/10" />
                    <p className="text-xs font-semibold text-white/20">No devices match your search</p>
                    <button onClick={() => setTargetSearch('')} className="text-[10px] text-white/30 hover:text-white transition-colors underline">Clear search</button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="xl:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-2xl p-6 space-y-6" style={{ backgroundColor: 'var(--bb-surface)' }}>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Scale size={13} style={{ color: '#B38B21' }} /> Trade Summary
              </h3>

              {/* Visual comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 space-y-2 text-center" style={{ backgroundColor: 'var(--bb-bg)' }}>
                  <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">Your Device</p>
                  <div className="h-14 flex items-center justify-center">
                    {currentPhone
                      ? <p className="text-xs font-bold text-white/60">{currentPhone}</p>
                      : <p className="text-[9px] text-white/15">—</p>
                    }
                  </div>
                  <p className="text-sm font-black" style={{ color: '#B38B21' }}>{formatCurrency(tradeInValue)}</p>
                </div>

                <div className="rounded-xl p-3 space-y-2 text-center" style={{ backgroundColor: 'var(--bb-bg)' }}>
                  <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">New Device</p>
                  <div className="h-14 flex items-center justify-center overflow-hidden">
                    {targetPhone
                      ? <img src={targetPhone.image} alt="" className="h-12 w-12 object-contain" />
                      : <p className="text-[9px] text-white/15">—</p>
                    }
                  </div>
                  <p className="text-sm font-black text-white">{targetPhone ? formatCurrency(targetPhone.price) : '—'}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-white/6">
                {[
                  { label: 'Trade-in credit', value: formatCurrency(tradeInValue), color: 'text-emerald-400' },
                  { label: 'Device price', value: targetPhone ? formatCurrency(targetPhone.price) : '—', color: 'text-white/50' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-white/30">{row.label}</span>
                    <span className={`text-xs font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
                <div className="h-px bg-white/6 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/50">Balance Due</span>
                  <span className="text-lg font-black" style={{ color: '#B38B21' }}>{formatCurrency(difference)}</span>
                </div>
                {targetPhone && savingsPct > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Sparkles size={11} className="text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-400">Save {savingsPct}% with trade-in</span>
                  </div>
                )}
              </div>

              {/* Final amount */}
              <div className="text-center py-4 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Final Payment</p>
                <p className="text-4xl font-black tracking-tight" style={{ color: '#B38B21' }}>{formatCurrency(difference)}</p>
                <p className="text-[10px] text-white/20 mt-1">Inc. VAT (12.5%)</p>
              </div>

              {/* CTA */}
              <button
                disabled={!targetPhoneId || !currentPhone}
                onClick={() => notify('Trade-in reservation initiated. Diagnostic appointment scheduled.')}
                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-black flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed group"
                style={{ backgroundColor: '#B38B21' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >
                Confirm Trade
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-white/20">
                <ShieldCheck size={12} style={{ color: '#B38B21' }} />
                <span className="text-[10px] font-medium">Precision Exchange Program</span>
              </div>
            </div>

            {/* Guarantee card */}
            <div className="rounded-2xl p-5 space-y-2" style={{ backgroundColor: 'rgba(179,139,33,0.04)', borderLeft: '2px solid rgba(179,139,33,0.15)' }}>
              <div className="flex items-center gap-2">
                <Award size={15} style={{ color: '#B38B21' }} />
                <h4 className="text-xs font-black uppercase tracking-wider text-white/70">Best Value Guarantee</h4>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">
                Find a better offer within 48 hours and we'll match it plus 10%.
              </p>
            </div>
          </aside>
        </div>

        {/* ── Related Products ── */}
        <section className="pt-8 space-y-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Upgrade Essentials</h2>
              <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">Complete your new kit</p>
            </div>
            <Link to="/store" className="text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white transition-colors flex items-center gap-2 group">
              View All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
        </section>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};