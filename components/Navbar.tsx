
import React from 'react';
import { Search, Menu, User as UserIcon, Wrench, X, ShoppingCart, Home, ShoppingBag, RefreshCcw } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { User, CartItem } from '../types';

interface NavbarProps {
  user: User | null;
  cart: CartItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const ViewfinderLogo = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M25 40V28C25 26.3431 26.3431 25 28 25H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M60 25H72C73.6569 25 75 26.3431 75 28V40" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M75 60V72C75 73.6569 73.6569 75 72 75H60" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M40 75H28C26.3431 75 25 73.6569 25 72V60" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <rect x="38" y="44" width="24" height="12" rx="6" fill="currentColor"/>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ 
  user, cart, searchQuery, setSearchQuery, setIsMobileMenuOpen 
}) => {
  const location = useLocation();
  const cartCount = cart.reduce((a, c) => a + c.quantity, 0);

  const navItemClass = (path: string) => `
    flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest
    ${location.pathname === path ? 'bg-[#CDA032] text-black shadow-[0_0_20px_rgba(205,160,50,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}
  `;

  return (
    <nav className="sticky top-0 z-[60] h-24 flex items-center bg-black/95 border-b border-white/5 backdrop-blur-3xl no-print">
      <div className="max-w-[1440px] mx-auto px-8 w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-opacity">
          <div className="w-11 h-11 bg-[white] rounded-lg flex items-center justify-center text-black">
            <ViewfinderLogo />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tighter leading-none">BLACKBOX</h1>
            <p className="text-[9px] font-black text-[#white]/50 tracking-[0.3em] uppercase"></p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <Link to="/" className={navItemClass('/')}><Home size={16} /> Home</Link>
          <Link to="/store" className={navItemClass('/store')}><ShoppingBag size={16} /> Products</Link>
          <Link to="/trades" className={navItemClass('/trades')}><RefreshCcw size={16} /> Trades</Link>
          <Link to="/repair" className={navItemClass('/repair')}><Wrench size={16} /> Repairs</Link>
          <Link to="/cart" className={navItemClass('/cart')}>
            <ShoppingCart size={16} /> Cart
            {cartCount > 0 && <span className="ml-2 px-2 py-0.5 bg-[#CDA032] text-black text-[9px] rounded-full">{cartCount}</span>}
          </Link>
          
          <Link 
            to={user ? '/profile' : '/auth'} 
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest ml-4
              ${user ? 'bg-white/5 text-white border border-white/10 hover:border-[#CDA032]/50' : 'bg-[#CDA032] text-black shadow-lg hover:brightness-110'}
            `}
          >
            <UserIcon size={16} /> {user ? 'Account' : 'Sign In'}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              placeholder="SEARCH..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#CDA032]/40 transition-all w-40 focus:w-56"
            />
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 text-white/40 hover:text-[#CDA032] hover:bg-white/5 rounded-full transition-colors">
            <Menu size={24}/>
          </button>
        </div>
      </div>
    </nav>
  );
};
