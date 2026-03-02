
import React from 'react';
import { X, ShoppingCart, Trash2, CheckCircle2, Scale, Info } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface CompareModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onAddToCart: (p: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ 
  products, isOpen, onClose, onRemove, onAddToCart 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative w-full max-w-[1440px] bg-black border border-white/10 rounded-[3rem] md:rounded-[4rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between bg-black">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black">
              <Scale size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-serif-luxury font-black italic uppercase tracking-tighter">Hardware Matrix</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">/ BENCHMARK ANALYSIS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all border border-white/10">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 md:p-12 no-scrollbar">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
              <Info size={64} className="mb-8" />
              <p className="text-xs font-black uppercase tracking-[0.5em] italic">No active units selected.</p>
            </div>
          ) : (
            <>
              {/* Mobile-first comparison cards */}
              <div className="lg:hidden space-y-4">
                {products.map((p) => (
                  <div key={p.id} className="rounded-3xl border border-white/10 bg-[#050505] overflow-hidden">
                    <div className="p-4 flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-black uppercase tracking-widest italic truncate">{p.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic mt-1">{p.category}</p>
                          </div>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60"
                            aria-label="Remove from compare"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Price</p>
                            <p className="text-base font-black italic tracking-tighter mt-1">{formatCurrency(p.price)}</p>
                          </div>
                          <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Status</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 italic mt-1">
                              {p.stock > 0 ? 'READY' : 'LOGGING'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Core specs</p>
                          <div className="mt-2 space-y-1">
                            {p.specs?.slice(0, 3).map((spec, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-white/40 mt-1.5 shrink-0" />
                                <p className="text-[10px] font-bold text-white/60 leading-snug">{spec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <button
                        onClick={() => onAddToCart(p)}
                        className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.35em] rounded-2xl active:scale-[0.98] transition-transform"
                      >
                        Authorize
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop matrix (keeps existing layout) */}
              <div className="hidden lg:block overflow-x-auto no-scrollbar">
                <div className="min-w-[1200px] grid grid-cols-[250px_repeat(auto-fit,minmax(250px,1fr))] gap-px bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="flex flex-col bg-black sticky left-0 z-10 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                    <div className="h-72 p-10 flex items-end">
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Technical Axis</span>
                    </div>
                    {['Model Identity', 'Batch Class', 'Pricing (GHS)', 'Precision Index', 'Availability', 'Core Specs'].map(label => (
                      <div key={label} className="p-10 border-t border-white/5 flex items-center h-24 bg-black">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">{label}</span>
                      </div>
                    ))}
                  </div>

                  {products.map((p) => (
                    <div key={p.id} className="flex flex-col bg-[#050505] relative border-l border-white/5">
                      <button onClick={() => onRemove(p.id)} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-white hover:text-black rounded-full transition-all border border-white/10">
                        <Trash2 size={14} />
                      </button>
                      <div className="h-72 p-12 flex items-center justify-center">
                        <img src={p.image} className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(255,255,255,0.05)]" alt={p.name} />
                      </div>
                      <div className="p-10 border-t border-white/5 h-24 flex items-center"><h3 className="text-[11px] font-black uppercase tracking-widest italic leading-tight">{p.name}</h3></div>
                      <div className="p-10 border-t border-white/5 h-24 flex items-center"><span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">{p.category}</span></div>
                      <div className="p-10 border-t border-white/5 h-24 flex items-center"><p className="text-xl font-black italic tracking-tighter">{formatCurrency(p.price)}</p></div>
                      <div className="p-10 border-t border-white/5 h-24 flex items-center gap-3"><CheckCircle2 size={16} className="text-white/20" /><p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">{p.rating || '4.5'} Precision</p></div>
                      <div className="p-10 border-t border-white/5 h-24 flex items-center"><p className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">/ {p.stock > 0 ? 'READY' : 'LOGGING'}</p></div>
                      <div className="p-10 border-t border-white/5 min-h-48 space-y-2">
                        {p.specs?.slice(0, 3).map((spec, i) => (
                          <div key={i} className="flex items-start gap-2 opacity-30"><div className="w-1 h-1 rounded-full bg-white mt-1.5 shrink-0" /><p className="text-[9px] font-black uppercase italic tracking-widest">{spec}</p></div>
                        ))}
                      </div>
                      <div className="p-8 border-t border-white/5 bg-white/5 flex flex-col justify-end">
                        <button onClick={() => onAddToCart(p)} className="w-full py-5 bg-white text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-full active:scale-95 transition-transform">
                          Authorize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
