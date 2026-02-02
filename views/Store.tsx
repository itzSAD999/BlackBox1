import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Check, Smartphone, Laptop as LaptopIcon, Watch, Gamepad2, LayoutGrid, Info, RefreshCcw, TrendingUp, Filter, X, ChevronDown } from 'lucide-react';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let results = products.filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      p.price >= minPrice && p.price <= maxPrice &&
      (!inStockOnly || p.stock > 0)
    );

    // Apply sorting
    switch(sortBy) {
      case 'Price: Low to High':
        results = results.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        results = results.sort((a, b) => b.price - a.price);
        break;
      case 'Newest Arrivals':
        results = results.reverse();
        break;
      default:
        break;
    }

    return results;
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, sortBy]);

  const categoryOptions: { label: string, value: Category | 'All', icon: React.ReactNode, count?: number }[] = [
    { label: 'ALL PRODUCTS', value: 'All', icon: <LayoutGrid size={16} />, count: products.length },
    { label: 'IPHONE', value: 'iPhone', icon: <Smartphone size={16} />, count: products.filter(p => p.category === 'iPhone').length },
    { label: 'TRADES', value: 'Trades', icon: <RefreshCcw size={16} /> },
    { label: 'LAPTOP', value: 'Laptop', icon: <LaptopIcon size={16} />, count: products.filter(p => p.category === 'Laptop').length },
    { label: 'ACCESSORIES', value: 'Accessories', icon: <Watch size={16} />, count: products.filter(p => p.category === 'Accessories').length },
    { label: 'GAMING', value: 'Gaming', icon: <Gamepad2 size={16} />, count: products.filter(p => p.category === 'Gaming').length },
  ];

  const activeFiltersCount = [
    selectedCategory !== 'All',
    minPrice > 0,
    maxPrice < 15000,
    inStockOnly
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(15000);
    setInStockOnly(false);
  };

  const FiltersPanel = () => (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
            <SlidersHorizontal size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">FILTERS</h2>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Refine Your Search</p>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[9px] font-black text-[#B38B21] uppercase tracking-widest hover:text-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <X size={12} />
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Category Selector - Enhanced */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5"></div>
          CATEGORIES
          <div className="h-px flex-1 bg-white/5"></div>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {categoryOptions.map((cat, i) => (
            <button 
              key={cat.value}
              onClick={() => {
                  if (cat.value === 'Trades') {
                      navigateTo('trades');
                  } else {
                      setSelectedCategory(cat.value);
                  }
              }}
              className={`group relative flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden ${
                selectedCategory === cat.value 
                  ? 'bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black shadow-[0_8px_30px_rgba(179,139,33,0.3)]' 
                  : 'bg-white/[0.02] text-white/50 border border-white/5 hover:border-[#B38B21]/30 hover:bg-white/[0.05]'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 relative z-10">
                {cat.icon}
                <span className={selectedCategory === cat.value ? 'text-black' : ''}>{cat.label}</span>
              </div>
              {cat.count !== undefined && (
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${
                  selectedCategory === cat.value 
                    ? 'bg-black/20 text-black' 
                    : 'bg-white/5 text-white/30'
                }`}>
                  {cat.count}
                </span>
              )}
              {selectedCategory === cat.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range - Enhanced */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5"></div>
          PRICE RANGE
          <div className="h-px flex-1 bg-white/5"></div>
        </h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">MIN</p>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#B38B21]/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#0a0a0a] border-2 border-white/5 rounded-2xl px-6 py-4 focus-within:border-[#B38B21]/30 transition-all">
                  <span className="text-[10px] font-black text-white/20 absolute left-6 top-1/2 -translate-y-1/2">GHS</span>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="bg-transparent text-base font-black w-full outline-none text-white italic pl-10" 
                  />
                </div>
              </div>
            </div>
            <div className="pt-10 text-white/10">—</div>
            <div className="flex-1 space-y-3">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">MAX</p>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#B38B21]/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#0a0a0a] border-2 border-white/5 rounded-2xl px-6 py-4 focus-within:border-[#B38B21]/30 transition-all">
                  <span className="text-[10px] font-black text-white/20 absolute left-6 top-1/2 -translate-y-1/2">GHS</span>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="bg-transparent text-base font-black w-full outline-none text-white italic pl-10" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Price range indicator */}
          <div className="bg-white/5 rounded-full h-2 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#B38B21] to-[#D4AF37]"
              style={{ 
                width: `${((maxPrice - minPrice) / 15000) * 100}%`,
                marginLeft: `${(minPrice / 15000) * 100}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
            <span>{formatCurrency(minPrice)}</span>
            <span>{formatCurrency(maxPrice)}</span>
          </div>
        </div>
      </div>

      {/* Availability - Enhanced */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5"></div>
          AVAILABILITY
          <div className="h-px flex-1 bg-white/5"></div>
        </h3>
        <label className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer group hover:border-[#B38B21]/30 transition-all" onClick={() => setInStockOnly(!inStockOnly)}>
          <div className="flex items-center gap-4">
            <div 
              className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center shadow-lg ${
                inStockOnly 
                  ? 'bg-gradient-to-br from-[#B38B21] to-[#D4AF37] border-[#B38B21]' 
                  : 'border-white/10 bg-black/40'
              }`}
            >
              {inStockOnly && <Check size={18} className="text-black stroke-[3]" />}
            </div>
            <div>
              <span className="text-[12px] font-black text-white group-hover:text-[#B38B21] transition-colors italic block">In Stock Only</span>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">Hide Unavailable Items</span>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-green-400' : 'bg-white/10'} animate-pulse`}></div>
        </label>
      </div>

      {/* Sort By - Enhanced */}
      <div className="space-y-6 pt-8 border-t-2 border-white/5">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
          <TrendingUp size={14} className="text-[#B38B21]" />
          SORT BY
        </h3>
        <div className="relative group">
          <div className="absolute inset-0 bg-[#B38B21]/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="relative w-full bg-[#0a0a0a] border-2 border-white/5 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-widest outline-none text-white focus:border-[#B38B21]/30 transition-all appearance-none cursor-pointer italic"
          >
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
          <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="view-transition bg-black min-h-screen py-16 px-6 md:px-12 no-print relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#B38B21]/[0.03] blur-[150px] rounded-full -ml-[300px] -mt-[300px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#B38B21]/[0.02] blur-[120px] rounded-full -mr-[250px] -mb-[250px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[3rem] p-8 shadow-2xl">
            <FiltersPanel />
          </div>
        </aside>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black rounded-full shadow-[0_10px_40px_rgba(179,139,33,0.4)] font-black text-sm uppercase tracking-widest"
          >
            <Filter size={18} />
            FILTERS
            {activeFiltersCount > 0 && (
              <span className="w-6 h-6 bg-black text-[#B38B21] rounded-full flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl">
            <div className="h-full overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              <FiltersPanel />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-8 py-5 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black rounded-full font-black text-sm uppercase tracking-widest"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Grid Area - Enhanced */}
        <div className="lg:col-span-9 space-y-10">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:flex-1 group">
                <div className="absolute inset-0 bg-[#B38B21]/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#B38B21] transition-colors" />
                <input 
                  placeholder="Search for products..." 
                  value={searchQuery}
                  onChange={(e) => navigateTo('store', e.target.value)}
                  className="relative w-full bg-black/50 border-2 border-white/10 rounded-full pl-16 pr-8 py-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#B38B21]/30 transition-all backdrop-blur-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic whitespace-nowrap">
                  {filteredProducts.length} Items
                </div>
                <div className="hidden md:flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Live Stock</span>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Active:</span>
                {selectedCategory !== 'All' && (
                  <span className="px-4 py-2 bg-[#B38B21]/20 border border-[#B38B21]/30 rounded-full text-[9px] font-black uppercase tracking-widest text-[#B38B21] flex items-center gap-2">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:scale-110 transition-transform">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                    In Stock
                    <button onClick={() => setInStockOnly(false)} className="hover:scale-110 transition-transform">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Grid - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((p, i) => (
              <div
                key={p.id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard 
                  product={p} 
                  onQuickView={onQuickView}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={toggleWishlist}
                  isCompared={compareIds.includes(p.id)}
                  onToggleCompare={onToggleCompare}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>

          {/* Empty State - Enhanced */}
          {filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#B38B21]/10 blur-3xl"></div>
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-white/5 to-transparent rounded-full flex items-center justify-center border border-white/10">
                  <Info size={48} className="text-white/20" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xl font-black uppercase tracking-[0.3em] italic text-white/40">No Items Found</p>
                <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Try adjusting your filters or search query</p>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-white/5 hover:bg-[#B38B21]/20 border border-white/10 hover:border-[#B38B21]/30 rounded-full text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-[#B38B21] transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};