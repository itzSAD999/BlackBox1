import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowRight, Smartphone, Laptop as LaptopIcon, Gamepad2, Sparkles, Zap 
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
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [introHasPlayed, setIntroHasPlayed] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const featuredProducts = products.filter(p => p.id === 'BB-106' || p.id === 'BB-105' || p.id === 'BB-101' || p.id === 'BB-104');
  
  const handleIntroEnd = () => {
    setShowIntroVideo(false);
    setIntroHasPlayed(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  useEffect(() => {
    if (!showIntroVideo || introHasPlayed) return;

    const timeoutId = setTimeout(() => {
      handleIntroEnd();
    }, 3500); // Shorter duration

    return () => clearTimeout(timeoutId);
  }, [showIntroVideo, introHasPlayed]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 800);  // Show text faster
    const t2 = setTimeout(() => setIntroStep(2), 2000); // Show card faster
    const t3 = setTimeout(() => setIntroStep(3), 2500); // Show navbar faster
    const t4 = setTimeout(() => setIntroComplete(true), 3500); // Complete faster

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!products || products.length === 0) return null;

  const currentHero = featuredProducts[currentHeroIndex];

  const categories = [
    { name: "iPhone" as Category, desc: "LATEST IPHONE MODELS AND PREMIUM HARDWARE", units: "1 UNITS", img: "https://images.unsplash.com/photo-1722710682948-22b556b528ce", icon: Smartphone },
    { name: "Laptop" as Category, desc: "ELITE MACBOOKS AND PRO PERFORMANCE MACHINES", units: "1 UNITS", img: "https://images.unsplash.com/photo-1671777560821-707c83d0305f", icon: LaptopIcon, active: true },
    { name: "Gaming" as Category, desc: "NEXT-GEN CONSOLES AND IMMERSIVE CONTROLLERS", units: "2 UNITS", img: "https://images.unsplash.com/photo-1606813907291-d86ebb9474ad", icon: Gamepad2 },
    { name: "Accessories" as Category, desc: "ESSENTIAL GEAR AND SPECIALIZED TECH TOOLS", units: "2 UNITS", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0", icon: Sparkles }
  ];

  return (
    <div className="view-transition bg-black overflow-hidden">
      {/* Fullscreen Cinematic Hero Overlay */}
      <div
        className={`
          fixed inset-0 z-[120] flex items-center justify-center
          bg-black
          transition-opacity duration-700
          ${introComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        {/* Background video — full viewport coverage */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-start justify-center pt-24">
          <div className="relative w-full h-full max-h-[calc(100vh-6rem)]">
            <video
              src="/videos/intro.mp4"
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Fade-in text overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <h2
                className={`
                  text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif-luxury font-black italic tracking-tight text-white
                  transition-all duration-1000 ease-out
                  ${introStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
              >
                Welcome to <span className="text-[#D4AF37]">BlackBox</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Enhanced cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Navbar */}
        <div
          className={`
            absolute top-0 left-0 right-0 px-8 md:px-12 pt-6 pb-4
            flex items-center justify-between
            text-white
            transition-all duration-700
            ${introStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}
        >
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black italic text-xl shadow-[0_10px_40px_rgba(212,175,55,0.4)]">
              B
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black tracking-tight leading-none">BLACKBOX</p>
              <p className="text-[9px] font-black text-[#D4AF37]/70 tracking-[0.3em] uppercase">
                Premium Tech
              </p>
            </div>
          </div> */}

          {/* <div className="hidden lg:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.25em]">
            <span className="text-white/60 hover:text-white transition-colors cursor-default">Home</span>
            <span className="text-white/40 hover:text-white transition-colors cursor-default">Products</span>
            <span className="text-white/40 hover:text-white transition-colors cursor-default">Repairs</span>
            <span className="text-white/40 hover:text-white transition-colors cursor-default">Bag</span>
            <button className="ml-4 px-6 py-2 rounded-full bg-[#D4AF37] text-black shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all text-[10px]">
              Sign In
            </button>
            <div className="ml-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-[10px] text-white/50 min-w-[180px]">
              Search repository...
            </div>
          </div> */}
        </div>

        {/* Centered hero content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Brand text block */}
            <div
              className={`
                space-y-6 max-w-xl
                transition-all duration-700
                ${introStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}
              `}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 italic">
                {/* Premium Device Inventory */}
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif-luxury font-black italic tracking-tighter leading-[0.9] uppercase">
                  {/* Welcome to */}
                  <br />
                  <span className="text-[#D4AF37] text-xl md:text-2xl lg:text-3xl tracking-[0.3em] not-italic">
                    {/* BlackBox Premium */}
                  </span>
                </h1>
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4">
                <span className="h-px w-10 bg-white/20" />
                {/* High-fidelity hardware */}
              </p>
            </div>

            {/* Product preview card */}
            <div
              className={`
                transition-all duration-700 max-w-md md:max-w-lg
                ${introStep >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
              `}
            >
              <div className="relative rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-black/60 pointer-events-none" />
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <video
                    src="/videos/intro.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative p-8 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/80">
                    Welcome Sequence
                  </p>
                  <p className="text-lg md:text-xl font-semibold tracking-[0.25em] uppercase text-white">
                    BlackBox Premium Tech
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Curated flagship devices, calibrated for precision, reliability, and a cinematic ownership experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Section - REDUCED FONT SIZES */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-8 hero-gradient">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          <div key={currentHeroIndex} className="flex-1 space-y-10 z-10 animate-in fade-in slide-in-from-left-10 duration-1000 text-center lg:text-left">
            <div className="space-y-4">
              {/* REDUCED: from text-7.5rem to text-5xl/6xl/7xl */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif-luxury font-black tracking-tighter leading-[0.9] uppercase italic">
                {currentHero.name.split(' ').slice(0, 2).join('\n')}
                <br/>
                <span className="text-[#D4AF37] text-xl md:text-2xl lg:text-3xl">{currentHero.name.split(' ').slice(2, 4).join(' ')}</span>
              </h1>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.6em] italic flex items-center justify-center lg:justify-start gap-4">
                / HIGH-FIDELITY HARDWARE / <span className="text-[#D4AF37]">BRANCH: KUMASI</span>
              </p>
            </div>
            
            <p className="text-sm md:text-base text-white/40 max-w-md font-light leading-relaxed mx-auto lg:mx-0 italic">
              {currentHero.description}
            </p>

            <Link 
              to="/product/$productId" 
              params={{ productId: currentHero.id } as any}
              className="inline-flex px-14 py-6 bg-[#D4AF37] text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] items-center gap-3 transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
            >
              Log Acquisition <ArrowRight size={14} />
            </Link>
          </div>

          <div key={`img-${currentHeroIndex}`} className="flex-1 relative animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
            
            {/* Intro Hero Video - POSITIONED HIGH */}
            {/* <div
              className={`relative z-20 max-w-[480px] mx-auto rounded-[3rem] overflow-hidden transition-opacity duration-700 ${
                showIntroVideo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <video
                src="/videos/intro.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleIntroEnd}
                className="w-full h-auto aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-center text-white font-serif-luxury text-lg md:text-2xl lg:text-3xl font-semibold tracking-[0.3em] uppercase px-8">
                  Welcome to BlackBox Premium Tech
                </p>
              </div>
            </div> */}

            {/* Default hero product preview */}
            <div
              className={`relative z-10 transition-opacity duration-700 ${
                showIntroVideo ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <img 
                src={currentHero.image} 
                className="w-full max-w-[650px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                alt={currentHero.name}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Explorer */}
      <section className="py-20 px-8 bg-black">
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
              to="/store"
              onClick={() => setSelectedCategory(cat.name)}
              className="group relative h-[600px] bg-black border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-[#D4AF37]/30 hover:shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col"
            >
              {/* Image Overlay */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>

              {/* Top Meta */}
              <div className="relative z-10 p-10 flex justify-between items-start">
                 <div className={`w-16 h-16 ${cat.active ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/40 border border-white/10'} rounded-[1.2rem] flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4AF37] group-hover:text-black shadow-xl`}>
                    <cat.icon size={28} />
                 </div>
                 <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">{cat.units}</span>
              </div>

              {/* Content Bottom */}
              <div className="relative mt-auto z-10 p-10 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors">{cat.name}</h3>
                 <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">{cat.desc}</p>
                 <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-3">
                      ENTER LAB <ArrowRight size={14} />
                    </span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Highlight Section */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16 mb-20">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif-luxury font-black italic tracking-tighter uppercase leading-none">Curated Batch</h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] italic">/ VERIFIED HARDWARE UNITS</p>
          </div>
          <Link to="/store" className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-[#D4AF37]/50 pb-1 hover:text-[#D4AF37] transition-colors flex items-center gap-4">
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
        <div className="max-w-[1440px] mx-auto bg-[#0a0a0a] rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative border border-white/5 group overflow-hidden">
           <div className="flex-1 space-y-10 z-10">
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-6 opacity-60 italic">
                <div className="w-16 h-[1px] bg-[#D4AF37]"></div> LAB SESSION
              </span>
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif-luxury font-black italic tracking-tighter leading-[0.8] uppercase">Technical Bench.</h3>
              <p className="text-lg text-white/40 font-light leading-relaxed max-w-xl italic">
                KNUST facility diagnostic standard. Every circuit mapped with absolute precision by Pulse AI.
              </p>
              <Link 
                to="/repair"
                className="inline-flex px-12 py-6 bg-[#D4AF37] text-black font-black rounded-full uppercase tracking-[0.4em] text-[10px] items-center gap-4 transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.1)]"
              >
                Schedule Diagnostic <ArrowRight size={16} />
              </Link>
           </div>
           <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[120px] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors"></div>
              <img 
                src="https://images.unsplash.com/photo-1517336714467-d13a2323485d" 
                className="rounded-[3rem] w-full object-cover aspect-video grayscale opacity-20 transition-all duration-[2s] group-hover:opacity-40 group-hover:grayscale-0"
                alt="Lab"
              />
              <div className="absolute top-10 right-10 bg-[#D4AF37] text-black px-6 py-3 rounded-full flex items-center gap-4 pulse-ring shadow-2xl">
                <Zap size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Lab</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};