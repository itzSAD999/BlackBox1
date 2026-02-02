import React, { useState, useEffect, useRef } from 'react';
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
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const featuredProducts = products.filter(p => p.id === 'BB-106' || p.id === 'BB-105' || p.id === 'BB-101' || p.id === 'BB-104');

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => {
      setShowIntroVideo(false);
    }, 800);
  };

  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoEnded(true);
    setTimeout(() => {
      setShowIntroVideo(false);
    }, 300);
  };

  useEffect(() => {
    if (!showIntroVideo) {
      const timer = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % featuredProducts.length);
        setHeroImageLoaded(false);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts.length, showIntroVideo]);

  // Preload next hero image
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const nextIndex = (currentHeroIndex + 1) % featuredProducts.length;
      const img = new Image();
      img.src = featuredProducts[nextIndex].image;
    }
  }, [currentHeroIndex, featuredProducts]);

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
      {/* Intro Video Section - Enhanced */}
      {showIntroVideo && (
        <section 
          className={`fixed inset-0 z-50 bg-black flex items-start justify-center pt-16 transition-all duration-700 ${
            videoEnded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Video loading indicator */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#B38B21]/20 border-t-[#B38B21] rounded-full animate-spin"></div>
            </div>
          )}
          
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            onEnded={handleVideoEnd}
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`max-w-2xl w-full h-auto object-contain transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src="/videos/intro3.mp4" type="video/mp4" />
          </video>
          
          {/* Enhanced Skip button with progress indicator */}
          <button 
            onClick={handleSkipVideo}
            className="absolute bottom-10 right-10 px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-[#B38B21]/20 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 border border-white/20 hover:border-[#B38B21]/50 hover:scale-105 active:scale-95 group"
          >
            <span className="relative z-10">Skip Intro</span>
            <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" size={14} />
          </button>
        </section>
      )}

      {/* Hero Section - Enhanced */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-8 overflow-hidden">
        {/* Enhanced Background Video with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10"></div>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=7402687c9f43f1e913075c754d9241517409247f&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#B38B21]/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div 
            key={`text-${currentHeroIndex}`} 
            className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000 text-center lg:text-left"
          >
            <div className="space-y-4">
              {/* Enhanced heading with gradient text */}
              <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif-luxury font-black tracking-tighter leading-[0.9] uppercase italic text-white drop-shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                {currentHero.name.split(' ').slice(0, 2).join('\n')}
                <br/>
                <span className="text-[#B38B21] bg-gradient-to-r from-[#B38B21] to-[#D4AF37] bg-clip-text text-transparent animate-shimmer">
                  {currentHero.name.split(' ').slice(2, 4).join(' ')}
                </span>
              </h1>
              <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.6em] italic flex items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-100">
                / HIGH-FIDELITY HARDWARE / <span className="text-[#B38B21] animate-pulse">BRANCH: KUMASI</span>
              </p>
            </div>
            
            <p className="text-sm md:text-base text-white/70 max-w-md font-light leading-relaxed mx-auto lg:mx-0 italic drop-shadow-xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              {currentHero.description}
            </p>

            <Link 
              to="/product/$productId" 
              params={{ productId: currentHero.id } as any}
              className="inline-flex px-14 py-6 bg-[#B38B21] text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(179,139,33,0.6)] active:scale-95 shadow-[0_10px_40px_rgba(179,139,33,0.4)] animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 group"
            >
              Buy Now 
              <ArrowRight className="transition-transform group-hover:translate-x-2" size={14} />
            </Link>
          </div>

          <div 
            key={`img-${currentHeroIndex}`} 
            className="flex-1 relative animate-in fade-in zoom-in-95 duration-1000"
          >
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-[#B38B21]/20 blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-radial from-[#B38B21]/10 via-transparent to-transparent blur-2xl"></div>
            
            {/* Image loading skeleton */}
            {!heroImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-[650px] aspect-square bg-white/5 rounded-lg animate-pulse"></div>
              </div>
            )}
            
            <img 
              src={currentHero.image} 
              onLoad={() => setHeroImageLoaded(true)}
              className={`w-full max-w-[650px] h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-700 ${
                heroImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              alt={currentHero.name}
            />
          </div>
        </div>
      </section>

      {/* Grid Explorer - Enhanced */}
      <section className="py-20 px-8 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #B38B21 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="max-w-[1440px] mx-auto text-center mb-16 relative z-10">
           <div className="flex items-center justify-center gap-6 mb-4">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white/10"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">EXPLORE OUR SPECIALIZED HARDWARE REPOSITORIES</span>
              <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white/10"></div>
           </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {categories.map((cat, i) => (
            <Link 
              key={i}
              to={cat.name === 'Trades' ? '/trades' : '/store'}
              onClick={() => cat.name !== 'Trades' && setSelectedCategory(cat.name)}
              className="group relative h-[600px] bg-[#0f0f0f] border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-[#B38B21]/50 flex flex-col hover:shadow-[0_20px_60px_rgba(179,139,33,0.2)] hover:-translate-y-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Enhanced image effects */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-70 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>

              <div className="relative z-10 p-10 flex justify-between items-start">
                 <div className={`w-16 h-16 ${cat.active ? 'bg-[#B38B21] text-black' : 'bg-white/5 text-white/40 border border-white/10'} rounded-[1.2rem] flex items-center justify-center transition-all duration-500 group-hover:bg-[#B38B21] group-hover:text-black group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                    <cat.icon size={28} className="transition-transform group-hover:scale-110" />
                 </div>
                 <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:bg-[#B38B21]/20 transition-colors">{cat.units}</span>
              </div>

              <div className="relative mt-auto z-10 p-10 space-y-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-32">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none group-hover:text-[#B38B21] transition-all duration-300 transform group-hover:translate-x-2">{cat.name}</h3>
                 <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px] group-hover:text-white/60 transition-colors">{cat.desc}</p>
                 <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B38B21] flex items-center gap-3">
                      ENTER LAB <ArrowRight className="transition-transform group-hover:translate-x-2" size={14} />
                    </span>
                 </div>
              </div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware - Enhanced */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16 mb-20">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif-luxury font-black italic tracking-tighter uppercase leading-none text-white">
              Items Available
            </h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] italic flex items-center gap-2">
              <Sparkles size={12} className="text-[#B38B21]" />
              / Items Available
            </p>
          </div>
          <Link 
            to="/store" 
            className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-[#B38B21]/50 pb-1 hover:text-[#B38B21] hover:border-[#B38B21] transition-all duration-300 flex items-center gap-4 group"
          >
            Explore Repository 
            <ChevronRight className="transition-transform group-hover:translate-x-1" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.slice(0, 3).map((p, i) => (
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
      </section>

      {/* Lab Banner - Enhanced */}
      <section className="px-8 pb-40">
        <div className="max-w-[1440px] mx-auto bg-[#0a0a0a] rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative border border-white/5 hover:border-[#B38B21]/20 group overflow-hidden shadow-2xl transition-all duration-700">
           {/* Animated background gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#B38B21]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           
           <div className="flex-1 space-y-10 z-10">
              <span className="text-[#B38B21] text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-6 opacity-60 italic group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-[1px] bg-[#B38B21] group-hover:w-24 transition-all duration-500"></div> LAB SESSION
              </span>
              <h3 className="text-5xl md:text-8xl font-serif-luxury font-black italic tracking-tighter leading-[0.8] uppercase text-white group-hover:text-[#B38B21] transition-colors duration-500">
                Technical Bench.
              </h3>
              <p className="text-lg text-white/40 font-light leading-relaxed max-w-xl italic group-hover:text-white/60 transition-colors">
                KNUST facility diagnostic standard. Every circuit mapped with absolute precision.
              </p>
              <Link 
                to="/repair"
                className="inline-flex px-12 py-6 bg-[#B38B21] text-black font-black rounded-full uppercase tracking-[0.4em] text-[10px] items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(179,139,33,0.3)] active:scale-95 shadow-[0_10px_40px_rgba(179,139,33,0.1)] group/btn"
              >
                Schedule Diagnostic 
                <ArrowRight className="transition-transform group-hover/btn:translate-x-2" size={16} />
              </Link>
           </div>
           
           <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-[#B38B21]/5 blur-[120px] rounded-full group-hover:bg-[#B38B21]/15 transition-all duration-1000"></div>
              <img 
                src="https://images.unsplash.com/photo-1517336714467-d13a2323485d" 
                className="rounded-[3rem] w-full object-cover aspect-video grayscale opacity-20 transition-all duration-[2s] group-hover:opacity-50 group-hover:grayscale-0 group-hover:scale-105"
                alt="Lab"
              />
              <div className="absolute top-10 right-10 bg-[#B38B21] text-black px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap size={18} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Lab</span>
              </div>
           </div>
        </div>
      </section>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};