
import React, { useState } from 'react';
import type { User } from "../interface/interface"
import { signIn, signUp, getUserProfile } from '../lib/api';
import { Mail, Lock, User as UserIcon, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  setUser: (user: User) => void;
  navigateTo: (view: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ setUser, navigateTo }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials (no account creation)
    if (formData.email === 'BlackBox@gmail.com' && formData.password === 'BlackBox') {
      // Create admin user object for session only
      const adminUser: User = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'BlackBox@gmail.com',
        password: 'BlackBox',
        role: 'admin'
      };
      setUser(adminUser);
      navigateTo('admin');
      return;
    }
    
    try {
      if (mode === "login") {
        if (!formData.email || !formData.password){
          alert("All Fields are Required!!");
          return;
        }

        const { user } = await signIn(formData.email, formData.password);
        
        if (user) {
          const profile = await getUserProfile(user.id);
          const userObj: User = {
            id: user.id,
            name: profile?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            password: formData.password,
            role: profile?.role || 'user'
          };
          setUser(userObj);
          navigateTo('home');
        }
      }
      else if (mode === "signup") {
        if (!formData.name || !formData.email || !formData.password){
          alert("All Fields are Required!!");
          return;
        }

        const { user } = await signUp(formData.email, formData.password);
        
        if (user) {
          const profile = await getUserProfile(user.id);
          const userObj: User = {
            id: user.id,
            name: formData.name,
            email: user.email || '',
            password: formData.password,
            role: profile?.role || 'user'
          };
          alert("Account created successfully");
          setUser(userObj);
          navigateTo("home");
        }
      }
    } catch (error: any) {
      alert(error.message || "Authentication failed");
    }
  };

  

  return (
    <div className="view-transition min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      
      {/* LEFT SECTION: Visual Brand (Dark) */}
      <div className="w-full lg:w-[45%] bg-black p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Gradient Overlay */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CDA032]/8 blur-[140px] rounded-full -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CDA032]/8 blur-[140px] rounded-full -ml-64 -mb-64"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#000000] rounded flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M25 40V28C25 26.3431 26.3431 25 28 25H40" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M60 25H72C73.6569 25 75 26.3431 75 28V40" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M75 60V72C75 73.6569 73.6569 75 72 75H60" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <path d="M40 75H28C26.3431 75 25 73.6569 25 72V60" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                <rect x="38" y="44" width="24" height="12" rx="6" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-sm font-black tracking-widest text-white uppercase italic">BLACK BOX.</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8 py-20 lg:py-0">
          <h1 className="text-6xl lg:text-[7rem] font-black italic tracking-tighter leading-[0.85] text-white uppercase">
            Login <br />
            <span className="text-[#CDA032]">Page</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/40 font-light italic leading-relaxed max-w-sm">
            Start your journey now with us and access the elite hardware repository.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
            AUTHORIZED TERMINAL // EST. KUMASI
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: Interaction (Light) */}
      <div className="w-full lg:w-[55%] bg-[#F9F9F9] flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-black">
              {mode === 'login' ? 'Login to your account' : 'Create an account'}
            </h2>
            <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mt-2 italic">
              {mode === 'login' ? 'Welcome back to the repository' : 'Establish your new tech identity'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/10" size={18} />
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#F5F5F5] border border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-black outline-none focus:border-[#CDA032]/50 focus:bg-white transition-all placeholder:text-black/10"
                  placeholder="identity@blackbox.gh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/10" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#F5F5F5] border border-transparent rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-black outline-none focus:border-[#CDA032]/50 focus:bg-white transition-all placeholder:text-black/10"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-[#CDA032] text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {mode === 'login' ? 'Login now' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-all italic"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="text-[#CDA032] ml-1">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-[#CDA032] ml-1">Log in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
