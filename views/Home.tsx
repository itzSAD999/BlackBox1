
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowRight, Smartphone, Laptop as LaptopIcon, Gamepad2, Sparkles, Zap, RefreshCcw
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  setSelectedCategory: (cat: Category | 'All') => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  onAddToCart: (p: Product) => void;
  compareIds: string[];
  onToggleCompare: (productId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ 
  products, setSelectedCategory, onQuickView, wishlist, toggleWishlist, onAddToCart, compareIds, onToggleCompare
}) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const featuredProducts = products.filter(p => p.id === 'BB-106' || p.id === 'BB-105' || p.id === 'BB-101' || p.id === 'BB-104');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (!products || products.length === 0) return null;

  const currentHero = featuredProducts[currentHeroIndex];

  const categories = [
    { name: "iPhone" as Category, desc: "LATEST IPHONE MODELS AND PREMIUM HARDWARE", units: "1 UNITS", img: "https://images.unsplash.com/photo-1722710682948-22b556b528ce", icon: Smartphone },
    { name: "Trades" as Category, desc: "EXCHANGE OLD HARDWARE FOR NEXT-GEN UPGRADES", units: "SERVICE", img: "https://images.unsplash.com/photo-1556656793-062ff987b50d", icon: RefreshCcw, active: true },
    { name: "Laptop" as Category, desc: "ELITE MACBOOKS AND PRO PERFORMANCE MACHINES", units: "1 UNITS", img: "https://images.unsplash.com/photo-1671777560821-707c83d0305f", icon: LaptopIcon },
    { name: "Gaming" as Category, desc: "NEXT-GEN CONSOLES AND IMMERSIVE CONTROLLERS", units: "2 UNITS", img: "https://images.unsplash.com/photo-1606813907291-d86ebb9474ad", icon: Gamepad2 }
  ];

  return (
    <div className="view-transition bg-black overflow-hidden no-print">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-8 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 video-overlay">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-70"
          >
            <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=7402687c9f43f1e913075c754d9241517409247f&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div key={currentHeroIndex} className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif-luxury font-black tracking-tighter leading-[0.9] uppercase italic text-white drop-shadow-2xl">
                {currentHero.name.split(' ').slice(0, 2).join('\n')}
                <br/>
                <span className="text-[#B38B21]">{currentHero.name.split(' ').slice(2, 4).join(' ')}</span>
              </h1>
              <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.6em] italic flex items-center justify-center lg:justify-start gap-4">
                / HIGH-FIDELITY HARDWARE / <span className="text-[#B38B21]">BRANCH: KUMASI</span>
              </p>
            </div>
            
            <p className="text-sm md:text-base text-white/70 max-w-md font-light leading-relaxed mx-auto lg:mx-0 italic drop-shadow-xl">
              {currentHero.description}
            </p>

            <Link 
              to="/product/$productId" 
              params={{ productId: currentHero.id } as any}
              className="inline-flex px-14 py-6 bg-[#B38B21] text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] items-center gap-3 transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(179,139,33,0.4)]"
            >
              Log Acquisition <ArrowRight size={14} />
            </Link>
          </div>

          <div key={`img-${currentHeroIndex}`} className="flex-1 relative animate-in fade-in zoom-in-95 duration-1000 hidden lg:block">
            <div className="absolute inset-0 bg-[#B38B21]/10 blur-[120px] rounded-full"></div>
            <img 
              src={currentHero.image} 
              className="w-full max-w-[650px] h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              alt={currentHero.name}
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-8 bg-black">
        <div className="max-w-[1440px] mx-auto text-center mb-16">
           <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-[1px] w-24 bg-white/10"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">EXPLORE OUR SPECIALIZED HARDWARE REPOSITORIES</span>
              <div className="h-[1px] w-24 bg-white/10"></div>
           </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Link 
              key={i}
              to={cat.name === 'Trades' ? '/trades' : '/store'}
              onClick={() => cat.name !== 'Trades' && setSelectedCategory(cat.name)}
              className="group relative h-[600px] bg-[#0f0f0f] border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-[#B38B21]/30 flex flex-col"
            >
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 p-10 flex justify-between items-start">
                 <div className={`w-16 h-16 ${cat.active ? 'bg-[#B38B21] text-black' : 'bg-white/5 text-white/40 border border-white/10'} rounded-[1.2rem] flex items-center justify-center transition-all duration-500 group-hover:bg-[#B38B21] group-hover:text-black shadow-xl`}>
                    <cat.icon size={28} />
                 </div>
                 <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">{cat.units}</span>
              </div>

              <div className="relative mt-auto z-10 p-10 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-[#B38B21] transition-colors">{cat.name}</h3>
                 <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">{cat.desc}</p>
                 <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B38B21] flex items-center gap-3">
                      ENTER LAB <ArrowRight size={14} />
                    </span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16 mb-20">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif-luxury font-black italic tracking-tighter uppercase leading-none text-white">Curated Batch</h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] italic">/ VERIFIED HARDWARE UNITS</p>
          </div>
          <Link to="/store" className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-[#B38B21]/50 pb-1 hover:text-[#B38B21] transition-colors flex items-center gap-4">
            Explore Repository <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.slice(0, 3).map(p => (
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

      {/* Lab Banner */}
      <section className="px-8 pb-40">
        <div className="max-w-[1440px] mx-auto bg-[#0a0a0a] rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative border border-white/5 group overflow-hidden shadow-2xl">
           <div className="flex-1 space-y-10 z-10">
              <span className="text-[#B38B21] text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-6 opacity-60 italic">
                <div className="w-16 h-[1px] bg-[#B38B21]"></div> LAB SESSION
              </span>
              <h3 className="text-5xl md:text-8xl font-serif-luxury font-black italic tracking-tighter leading-[0.8] uppercase text-white">Technical Bench.</h3>
              <p className="text-lg text-white/40 font-light leading-relaxed max-w-xl italic">
                KNUST facility diagnostic standard. Every circuit mapped with absolute precision.
              </p>
              <Link 
                to="/repair"
                className="inline-flex px-12 py-6 bg-[#B38B21] text-black font-black rounded-full uppercase tracking-[0.4em] text-[10px] items-center gap-4 transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(179,139,33,0.1)]"
              >
                Schedule Diagnostic <ArrowRight size={16} />
              </Link>
           </div>
           <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-[#B38B21]/5 blur-[120px] rounded-full group-hover:bg-[#B38B21]/10 transition-colors"></div>
              <img 
                src="https://images.unsplash.com/photo-1517336714467-d13a2323485d" 
                className="rounded-[3rem] w-full object-cover aspect-video grayscale opacity-20 transition-all duration-[2s] group-hover:opacity-40 group-hover:grayscale-0"
                alt="Lab"
              />
              <div className="absolute top-10 right-10 bg-[#B38B21] text-black px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
                <Zap size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Lab</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
