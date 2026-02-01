
import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Check, Smartphone, Laptop as LaptopIcon, Watch, Gamepad2, LayoutGrid, Info, RefreshCcw } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency } from '../lib/utils';

interface StoreProps {
  products: Product[];
  searchQuery: string;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  navigateTo: (view: string, id?: string) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
  onAddToCart: (p: Product) => void;
}

export const Store: React.FC<StoreProps> = ({ 
  products, 
  searchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  navigateTo,
  onQuickView,
  wishlist,
  toggleWishlist,
  compareIds,
  onToggleCompare,
  onAddToCart
}) => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Most Popular');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      p.price >= minPrice && p.price <= maxPrice &&
      (!inStockOnly || p.stock > 0)
    );
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly]);

  const categoryOptions: { label: string, value: Category | 'All', icon: React.ReactNode }[] = [
    { label: 'ALL PRODUCTS', value: 'All', icon: <LayoutGrid size={16} /> },
    { label: 'IPHONE', value: 'iPhone', icon: <Smartphone size={16} /> },
    { label: 'TRADES', value: 'Trades', icon: <RefreshCcw size={16} /> },
    { label: 'LAPTOP', value: 'Laptop', icon: <LaptopIcon size={16} /> },
    { label: 'ACCESSORIES', value: 'Accessories', icon: <Watch size={16} /> },
    { label: 'GAMING', value: 'Gaming', icon: <Gamepad2 size={16} /> },
  ];

  return (
    <div className="view-transition bg-black min-h-screen py-16 px-6 md:px-12 no-print">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sidebar Filter - Matching Screenshot */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32 space-y-12">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SlidersHorizontal size={22} className="text-white" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">FILTERS</h2>
              </div>
              <span className="text-[12px] font-black text-white/10 tracking-widest">11</span>
            </div>

            <div className="h-[1px] bg-white/[0.03]"></div>

            {/* Category Selector */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">CATEGORIES</h3>
              <div className="flex flex-wrap gap-3">
                {categoryOptions.map(cat => (
                  <button 
                    key={cat.value}
                    onClick={() => {
                        if (cat.value === 'Trades') {
                            navigateTo('trades');
                        } else {
                            setSelectedCategory(cat.value);
                        }
                    }}
                    className={`flex items-center gap-3 px-8 py-5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                      selectedCategory === cat.value 
                        ? 'bg-[#FDDC5C] text-black italic shadow-[0_0_20px_rgba(253,220,92,0.2)]' 
                        : 'bg-white/[0.02] text-white/40 border border-white/[0.03] hover:border-white/10'
                    }`}
                  >
                     {cat.icon}
                     {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">PRICE RANGE</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-4">
                   <p className="text-[9px] font-black text-white/10 uppercase tracking-widest ml-2">MIN</p>
                   <div className="bg-[#030303] border border-white/[0.03] rounded-2xl px-6 py-5 focus-within:border-[#FDDC5C]/20 transition-all">
                      <input 
                        type="number" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="bg-transparent text-lg font-black w-full outline-none text-white italic" 
                      />
                   </div>
                </div>
                <div className="pt-8">
                  <div className="w-4 h-[2px] bg-white/5"></div>
                </div>
                <div className="flex-1 space-y-4">
                   <p className="text-[9px] font-black text-white/10 uppercase tracking-widest ml-2">MAX</p>
                   <div className="bg-[#030303] border border-white/[0.03] rounded-2xl px-6 py-5 focus-within:border-[#FDDC5C]/20 transition-all">
                      <input 
                        type="number" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="bg-transparent text-lg font-black w-full outline-none text-white italic" 
                      />
                   </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">AVAILABILITY</h3>
              <label className="flex items-center gap-4 cursor-pointer group" onClick={() => setInStockOnly(!inStockOnly)}>
                <div 
                  className={`w-7 h-7 rounded-xl border-2 transition-all flex items-center justify-center ${inStockOnly ? 'bg-[#FDDC5C] border-[#FDDC5C]' : 'border-white/5 bg-black/40'}`}
                >
                  {inStockOnly && <Check size={18} className="text-black stroke-[4]" />}
                </div>
                <span className="text-[12px] font-black text-white/20 group-hover:text-white transition-colors italic">In Stock Only</span>
              </label>
            </div>

            {/* Sort By at Bottom */}
            <div className="space-y-8 pt-10 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">SORT BY</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#030303] border border-white/[0.03] rounded-2xl px-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none text-white focus:border-[#FDDC5C]/30 transition-all appearance-none cursor-pointer italic"
              >
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>

          </div>
        </aside>

        {/* Grid Area */}
        <div className="lg:col-span-9 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/[0.03] pb-10">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />
              <input 
                placeholder="SEARCH REPOSITORY..." 
                value={searchQuery}
                onChange={(e) => navigateTo('store', e.target.value)}
                className="w-full bg-[#030303] border border-white/[0.03] rounded-full pl-16 pr-8 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#FDDC5C]/20 transition-all"
              />
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10 italic">
              Showing {filteredProducts.length} hardware units
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onQuickView={onQuickView}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={toggleWishlist}
                isCompared={compareIds.includes(p.id)}
                onToggleCompare={onToggleCompare}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-40 text-center space-y-6 opacity-10">
              <Info size={64} className="mx-auto text-white" />
              <p className="text-sm font-black uppercase tracking-[0.5em] italic text-white">NO HARDWARE UNITS MATCH YOUR SIGNAL.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
