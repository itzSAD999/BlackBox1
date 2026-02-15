import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Check, Smartphone, Laptop as LaptopIcon, Watch, Gamepad2, LayoutGrid, Info, RefreshCcw, TrendingUp, Filter, X, ChevronDown, Grid3x3, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Results Count */}
            <div className="text-sm text-white/60">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </div>
            
            {/* Right: View Mode and Sort */}
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[#B38B21] text-black' 
                      : 'bg-transparent text-white/60 hover:text-white'
                  }`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#B38B21] text-black' 
                      : 'bg-transparent text-white/60 hover:text-white'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#B38B21] transition-colors"
                >
                  <option value="Most Popular">Most Popular</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest Arrivals">Newest Arrivals</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar - Filters */}
        <div className="w-80 border-r border-white/10 min-h-[calc(100vh-73px)] hidden lg:block">
          <div className="p-6 space-y-8">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={20} className="text-[#B38B21]" />
                <h2 className="text-lg font-semibold text-white">Filters</h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#B38B21] hover:text-[#D4AF37] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      if (cat.value === 'Trades') {
                        navigateTo('trades');
                      } else {
                        setSelectedCategory(cat.value);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === cat.value
                        ? 'bg-[#B38B21] text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    {cat.count !== undefined && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === cat.value
                          ? 'bg-black/20 text-black'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Price Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B38B21] transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B38B21] transition-colors"
                    placeholder="15000"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-[#B38B21] bg-white/10 border-white/20 rounded focus:ring-[#B38B21] focus:ring-2"
                />
                <span className="text-sm text-white/70">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content - Products */}
        <div className="flex-1 p-6">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No products found matching your criteria.</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm text-[#B38B21] hover:text-[#D4AF37] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  {viewMode === 'grid' ? (
                    <ProductCard
                      product={product}
                      onQuickView={onQuickView}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={onAddToCart}
                      isCompared={compareIds.includes(product.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  ) : (
                    /* List View */
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4 hover:border-[#B38B21]/30 transition-colors">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-medium text-white">{product.name}</h3>
                          <p className="text-sm text-white/60">{product.category}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-[#B38B21]">
                            {formatCurrency(product.price)}
                          </span>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="bg-[#B38B21] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4AF37] transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
