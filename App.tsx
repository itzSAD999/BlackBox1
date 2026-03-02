import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  RouterProvider, 
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  createMemoryHistory
} from '@tanstack/react-router';
import { X, CheckCircle2, Activity, Scale, RefreshCcw } from 'lucide-react';
import { Product, User, CartItem, Category, RepairRequest, Order } from './types';
import { getProducts, createOrder } from './lib/api';
import { INITIAL_PRODUCTS } from './constants';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { ProductDetail } from './views/ProductDetail';
import { Repair } from './views/Repair';
import { Store } from './views/Store';
import { Auth } from './views/Auth';
import { Profile } from './views/Profile';
import { Cart } from './views/Cart';
import { Checkout } from './views/Checkout';
import { Trades } from './views/Trades';
import { Admin } from './views/Admin';
import { orders } from './data/orders';
import { QuickViewModal } from './components/QuickViewModal';
import { CompareModal } from './components/CompareModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { generateId } from './lib/utils';

const STORAGE_KEYS = {
  PRODUCTS: 'bb_v4_products',
  USER: 'bb_v4_user',
  CART: 'bb_v4_cart',
  ORDERS: 'bb_v4_orders',
  REPAIRS: 'bb_v4_repairs',
  WISHLIST: 'bb_v4_wishlist',
  COMPARE: 'bb_v4_compare',
  THEME: 'bb_v4_theme',
};

// --- APP CONTEXT ---
export type Theme = 'light' | 'dark';

export interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  compareIds: string[];
  user: User | null;
  orders: Order[];
  repairs: RepairRequest[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (c: Category | 'All') => void;
  setUser: (u: User | null) => void;
  setRepairs: (r: RepairRequest[]) => void;
  addToCart: (p: Product, o?: any, q?: number) => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  onToggleCompare: (id: string) => void;
  updateQuantity: (id: string, o: any, d: number) => void;
  removeFromCart: (uid: string) => void;
  handleCheckout: (t: number) => void;
  notify: (m: string, t?: any) => void;
  navigateTo: (v: string, id?: string) => void;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppContextProvider");
  return context;
};

// --- ROUTES SETUP ---
const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const context = useAppContext();
    return <Home {...context} />;
  },
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: () => {
    const context = useAppContext();
    return <Store {...context} />;
  },
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: () => {
    const { productId } = useParams({ from: productDetailRoute.id } as any);
    const context = useAppContext();
    const product = context.products.find((p: Product) => p.id === productId);
    if (!product) return <div className="p-20 text-center text-white/40 uppercase font-black tracking-widest">Unit Not Found.</div>;
    return (
      <ProductDetail 
        product={product}
        relatedProducts={context.products.filter((p: Product) => p.category === product.category && p.id !== product.id).slice(0, 4)}
        addToCart={context.addToCart}
        isWishlisted={context.wishlist.includes(product.id)}
        onToggleWishlist={context.toggleWishlist}
        navigateTo={context.navigateTo}
      />
    );
  },
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: () => {
    const context = useAppContext();
    return <Cart {...context} />;
  },
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => {
    return <Checkout />;
  },
});

const repairRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/repair',
  component: () => {
    const context = useAppContext();
    return <Repair />;
  },
});

const tradesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trades',
  component: () => {
    const context = useAppContext();
    return <Trades {...context} />;
  },
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => {
    const context = useAppContext();
    return <Profile {...context} />;
  },
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => {
    const context = useAppContext();
    return <Auth setUser={context.setUser} navigateTo={context.navigateTo} />;
  },
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => {
    const context = useAppContext();
    // Check if user is admin
    if (context.user?.email === 'BlackBox@gmail.com' && context.user?.role === 'admin') {
      return <Admin setUser={context.setUser} navigateTo={context.navigateTo} />;
    }
    // Redirect non-admin users to home
    context.navigateTo('home');
    return null;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  repairRoute,
  tradesRoute,
  profileRoute,
  authRoute,
  adminRoute,
]);

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({ 
  routeTree,
  history: memoryHistory,
  defaultPreload: 'intent',
} as any);

function RootComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const localUser = localStorage.getItem(STORAGE_KEYS.USER);
      const localCart = localStorage.getItem(STORAGE_KEYS.CART);
      const localOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const localRepairs = localStorage.getItem(STORAGE_KEYS.REPAIRS);
      const localWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      const localCompare = localStorage.getItem(STORAGE_KEYS.COMPARE);
      const localTheme = localStorage.getItem(STORAGE_KEYS.THEME);

      if (localUser) setUser(JSON.parse(localUser));
      if (localCart) setCart(JSON.parse(localCart));
      if (localOrders) setOrders(JSON.parse(localOrders));
      if (localRepairs) setRepairs(JSON.parse(localRepairs));
      if (localWishlist) setWishlist(JSON.parse(localWishlist));
      if (localCompare) setCompareIds(JSON.parse(localCompare));
      if (localTheme === 'light' || localTheme === 'dark') setTheme(localTheme);
    } catch (e) { console.error(e); }

    // Fetch products from Supabase
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        // Use Supabase data if available, otherwise fallback to local data
        setProducts(productsData.length > 0 ? productsData : INITIAL_PRODUCTS);
      } catch (error) {
        console.error('Failed to fetch products from Supabase, using local data:', error);
        // Fallback to local products if Supabase fails
        setProducts(INITIAL_PRODUCTS);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs));
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(compareIds));
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [user, cart, orders, repairs, wishlist, compareIds, theme]);

  // Apply theme globally (CSS reads html[data-theme]).
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const navigateTo = (to: string, id?: string) => {
    if (id) {
      navigate({ to: `/product/${id}` as any });
    } else {
      navigate({ to: (to === 'home' ? '/' : `/${to}`) as any });
    }
    setIsMobileMenuOpen(false);
  };

  const addToCart = (product: Product, options: Record<string, string> = {}, qty: number = 1) => {
    setCart(prev => {
      const existingId = `${product.id}-${JSON.stringify(options)}`;
      const existingIndex = prev.findIndex(p => `${p.id}-${JSON.stringify(p.selectedOptions)}` === existingId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { ...product, quantity: qty, selectedOptions: options }];
    });
    notify(`${product.name} logged to repository.`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      notify(exists ? 'Unit removed from wishlist' : 'Unit logged to wishlist');
      return exists ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  };

  const toggleCompare = (productId: string) => {
    setCompareIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 4) { notify('Comparison limit reached (4)', 'error'); return prev; }
      return [...prev, productId];
    });
  };

  const updateQuantity = (id: string, options: Record<string, string> | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(options)) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(prev => prev.filter(p => `${p.id}-${JSON.stringify(p.selectedOptions)}` !== uniqueId));
  };

  const handleCheckout = async (total: number) => {
    if (!user) { notify('Auth required.', 'error'); return; }
    
    try {
      // Create order in Supabase
      const order = await createOrder(cart, user.id);
      
      // Create local order for UI compatibility
      const newOrder: Order = {
        id: order.id,
        userId: user.id,
        userName: user.name,
        items: [...cart],
        total,
        status: 'Pending',
        date: order.created_at,
        paymentMethod: 'Credit Card'
      };
      
      setOrders([newOrder, ...orders]);
      setCart([]);
      notify('Transaction Authorized.');
    } catch (error: any) {
      notify('Checkout failed: ' + error.message, 'error');
    }
  };

  const contextValues: AppContextType = {
    products, cart, wishlist, compareIds, user, orders, repairs,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    setUser, setRepairs, addToCart, toggleWishlist, toggleCompare,
    onToggleCompare: toggleCompare,
    updateQuantity, removeFromCart, handleCheckout, notify, navigateTo,
    onQuickView: (p: Product) => { setQuickViewProduct(p); setIsQuickViewOpen(true); },
    onAddToCart: (p: Product) => addToCart(p),
    theme,
    setTheme,
  };

  const isLight = theme === 'light';

  return (
    <AppContext.Provider value={contextValues}>
      {/* Welcome Screen */}
      {showWelcomeScreen && (
        <WelcomeScreen onComplete={() => setShowWelcomeScreen(false)} />
      )}
      
      <div className={`flex flex-col min-h-screen selection:bg-[#B38B21] selection:text-black ${showWelcomeScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isLight ? 'bg-[#F0F0F0] text-black' : 'bg-black text-white'}`}>
        <Navbar 
          user={user} 
          cart={cart} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="flex-1">
          <Outlet />
        </main>

        {compareIds.length > 0 && (
          <button 
            onClick={() => setIsCompareOpen(true)}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-[#B38B21] text-black font-black rounded-full text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 shadow-[0_10px_40px_rgba(179,139,33,0.4)] transition-transform hover:scale-105"
          >
            <Scale size={18} /> Matrix ({compareIds.length})
          </button>
        )}

        <QuickViewModal 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
          product={quickViewProduct} 
          onAddToCart={addToCart} 
        />

        <CompareModal 
          isOpen={isCompareOpen} 
          onClose={() => setIsCompareOpen(false)} 
          products={products.filter(p => compareIds.includes(p.id))} 
          onRemove={toggleCompare} 
          onAddToCart={(p) => addToCart(p)} 
        />

        {notification && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[130] px-8 py-5 rounded-full shadow-2xl animate-in slide-in-from-bottom-10 flex items-center gap-5 bg-[#B38B21] text-black border-none">
            {notification.type === 'success' ? <CheckCircle2 size={18}/> : <Activity size={18}/>}
            <p className="font-bold text-[10px] uppercase tracking-[0.3em]">{notification.msg}</p>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-in fade-in duration-500 overflow-auto">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 p-4 bg-white/5 rounded-full">
              <X size={32}/>
            </button>
            <div className="flex flex-col gap-6 sm:gap-8 text-2xl sm:text-3xl font-black italic uppercase tracking-widest w-full max-w-md">
              {['home', 'store', 'cart', 'repair', 'trades', 'profile'].map((v) => (
                <button key={v} onClick={() => navigateTo(v === 'profile' ? 'profile' : v)} className="hover:text-[#B38B21] transition-colors">
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        <Footer theme={theme} />
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
