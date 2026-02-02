import React, { useState } from 'react';
import { 
  Send, Activity, Camera, Cpu, Smartphone, Laptop, Tablet, Gamepad2, Watch, Check, 
  ArrowLeft, ArrowRight, Calendar, AlertCircle, Clock, MapPin, Phone, Mail, User,
  Wrench, Package, FileText, CheckCircle2, Image as ImageIcon, Upload
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { RepairRequest } from '../types';
import { generateId, formatCurrency } from '../lib/utils';
import { useAppContext } from '../App';

export const Repair: React.FC = () => {
  const { user, repairs, setRepairs, notify } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: '',
    description: '',
    date: '',
    timeSlot: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    photos: [] as string[],
    urgency: 'standard'
  });

  const submitRepairRequest = () => {
    if (!user) { navigate({ to: '/auth' }); return; }
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      notify('Please complete all contact details', 'error');
      return;
    }

    const newRepair: RepairRequest = {
       id: generateId(), 
       userId: user.id, 
       userName: user.name,
       device: `${formData.brand} ${formData.model}`, 
       issue: formData.description,
       status: 'Received', 
       date: new Date().toISOString()
    };
    setRepairs([newRepair, ...repairs]);
    notify('Repair request submitted successfully!');
    navigate({ to: '/profile' });
  };

  const deviceTypes = [
    { id: 'smartphone', label: 'Smartphone', desc: 'iPhone, Android Phones', icon: Smartphone, color: 'from-blue-500/20 to-blue-600/10' },
    { id: 'laptop', label: 'Laptop', desc: 'MacBook, Windows Laptops', icon: Laptop, color: 'from-purple-500/20 to-purple-600/10' },
    { id: 'tablet', label: 'Tablet', desc: 'iPad, Android Tablets', icon: Tablet, color: 'from-green-500/20 to-green-600/10' },
    { id: 'gaming', label: 'Gaming', desc: 'PlayStation, Xbox, Switch', icon: Gamepad2, color: 'from-red-500/20 to-red-600/10' },
    { id: 'smartwatch', label: 'Smartwatch', desc: 'Apple Watch, Galaxy Watch', icon: Watch, color: 'from-orange-500/20 to-orange-600/10' },
    { id: 'other', label: 'Other', desc: 'Other Electronics', icon: Cpu, color: 'from-gray-500/20 to-gray-600/10' }
  ];

  const conditions = [
    { id: 'excellent', label: 'Excellent', desc: 'Minor cosmetic wear only', icon: '⭐', color: 'text-green-400' },
    { id: 'good', label: 'Good', desc: 'Slight signs of use', icon: '✓', color: 'text-blue-400' },
    { id: 'fair', label: 'Fair', desc: 'Noticeable wear and tear', icon: '~', color: 'text-yellow-400' },
    { id: 'poor', label: 'Poor', desc: 'Significant damage', icon: '!', color: 'text-red-400' }
  ];

  const timeSlots = [
    { id: 'morning-1', time: '9:00 AM', label: 'Early Morning', available: true },
    { id: 'morning-2', time: '10:30 AM', label: 'Mid Morning', available: true },
    { id: 'afternoon-1', time: '12:00 PM', label: 'Noon', available: false },
    { id: 'afternoon-2', time: '2:00 PM', label: 'Early Afternoon', available: true },
    { id: 'afternoon-3', time: '3:30 PM', label: 'Mid Afternoon', available: true },
    { id: 'evening-1', time: '5:00 PM', label: 'Evening', available: true },
  ];

  const urgencyLevels = [
    { id: 'standard', label: 'Standard', desc: '2-3 business days', price: 0, icon: Package },
    { id: 'express', label: 'Express', desc: '24 hours', price: 50, icon: Wrench },
    { id: 'emergency', label: 'Emergency', desc: 'Same day', price: 150, icon: Activity }
  ];

  const brands = ['Apple', 'Samsung', 'Sony', 'Microsoft', 'Nintendo', 'HP', 'Dell', 'Lenovo', 'Asus', 'Other'];

  const canProceed = () => {
    switch(step) {
      case 1: return formData.deviceType && formData.brand && formData.model && formData.condition;
      case 2: return formData.description.length >= 10;
      case 3: return formData.date && formData.timeSlot;
      case 4: return formData.name && formData.email && formData.phone;
      default: return true;
    }
  };

  return (
    <div className="view-transition bg-black min-h-screen text-white py-12 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#B38B21]/[0.03] blur-[150px] rounded-full -ml-[300px] -mt-[300px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#B38B21]/[0.02] blur-[120px] rounded-full -mr-[250px] -mb-[250px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Enhanced Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
              <Wrench size={28} className="text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase leading-tight text-white">
                Repair Service
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/30 mt-1">
                Professional diagnostics & repairs
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stepper */}
        <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
          <div className="absolute top-[20px] left-0 w-full h-[2px] bg-white/5"></div>
          <div 
            className="absolute top-[20px] left-0 h-[2px] bg-gradient-to-r from-[#B38B21] to-[#D4AF37] transition-all duration-700" 
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>
          
          {[
            { id: 1, label: 'Device', icon: Smartphone },
            { id: 2, label: 'Issue', icon: AlertCircle },
            { id: 3, label: 'Schedule', icon: Calendar },
            { id: 4, label: 'Contact', icon: User },
            { id: 5, label: 'Confirm', icon: CheckCircle2 }
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-black px-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 shadow-lg ${
                step >= s.id 
                  ? 'bg-gradient-to-br from-[#B38B21] to-[#D4AF37] text-black border-[#B38B21]' 
                  : step === s.id - 1
                  ? 'bg-black text-white border-[#B38B21]/30'
                  : 'bg-black text-white/20 border-white/5'
              }`}>
                {step > s.id ? <Check size={18} strokeWidth={3} /> : <s.icon size={18} />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-wider hidden md:block ${
                step >= s.id ? 'text-[#B38B21]' : 'text-white/20'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Area */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0a0a0a] to-[#050505] rounded-3xl p-8 md:p-12 border border-white/5 space-y-10 shadow-2xl">
          
          {/* Step 1: Device Selection */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="space-y-6">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Smartphone size={20} className="text-[#B38B21]" />
                  Select Device Type
                  <span className="text-[#B38B21] text-sm">*</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {deviceTypes.map((type, i) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, deviceType: type.id })}
                      className={`group relative p-5 rounded-2xl border text-center transition-all animate-in fade-in slide-in-from-bottom-4 ${
                        formData.deviceType === type.id 
                          ? 'bg-gradient-to-br from-[#B38B21]/20 to-[#D4AF37]/10 border-[#B38B21] shadow-lg' 
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.color} border transition-all ${
                        formData.deviceType === type.id 
                          ? 'border-[#B38B21]/50 scale-110' 
                          : 'border-white/10 group-hover:scale-105'
                      }`}>
                        <type.icon size={20} className={formData.deviceType === type.id ? 'text-[#B38B21]' : 'text-white/40'} />
                      </div>
                      <div className="space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${
                          formData.deviceType === type.id ? 'text-white' : 'text-white/50'
                        }`}>
                          {type.label}
                        </p>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider">{type.desc}</p>
                      </div>
                      {formData.deviceType === type.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#B38B21] to-[#D4AF37] rounded-full flex items-center justify-center">
                          <Check size={12} className="text-black" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Package size={12} />
                    Brand <span className="text-[#B38B21]">*</span>
                  </label>
                  <select 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold uppercase tracking-wider outline-none focus:border-[#B38B21]/30 transition-all appearance-none text-white"
                  >
                    <option value="">Select brand</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <FileText size={12} />
                    Model <span className="text-[#B38B21]">*</span>
                  </label>
                  <input 
                    placeholder="e.g., iPhone 15 Pro, MacBook Air M2"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold tracking-wide outline-none focus:border-[#B38B21]/30 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Activity size={20} className="text-[#B38B21]" />
                  Device Condition
                  <span className="text-[#B38B21] text-sm">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conditions.map((cond, i) => (
                    <button
                      key={cond.id}
                      onClick={() => setFormData({ ...formData, condition: cond.id })}
                      className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all animate-in fade-in slide-in-from-bottom-4 ${
                        formData.condition === cond.id 
                          ? 'bg-gradient-to-br from-[#B38B21]/20 to-[#D4AF37]/10 border-[#B38B21]' 
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                        formData.condition === cond.id 
                          ? 'border-[#B38B21] bg-gradient-to-br from-[#B38B21] to-[#D4AF37]' 
                          : 'border-white/10'
                      }`}>
                        {formData.condition === cond.id 
                          ? <Check size={16} strokeWidth={3} className="text-black" />
                          : <span className={`text-lg ${cond.color}`}>{cond.icon}</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-black uppercase tracking-wider ${
                          formData.condition === cond.id ? 'text-white' : 'text-white/50'
                        }`}>
                          {cond.label}
                        </p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">{cond.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Issue Description */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                 <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                   <AlertCircle size={20} className="text-[#B38B21]" />
                   Describe the Issue
                   <span className="text-[#B38B21] text-sm">*</span>
                 </h3>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
                   Provide detailed information about the problem you're experiencing
                 </p>
                 <textarea 
                    placeholder="Example: Screen is cracked in the top right corner. Touch functionality still works but there's visible damage. Phone was dropped from about 3 feet..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={8}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-2xl p-6 text-sm font-normal leading-relaxed outline-none focus:border-[#B38B21]/30 transition-all resize-none placeholder:text-white/20"
                 />
                 <div className="flex items-center justify-between text-[9px] font-bold text-white/30">
                   <span>Minimum 10 characters</span>
                   <span className={formData.description.length >= 10 ? 'text-green-400' : ''}>{formData.description.length} characters</span>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <ImageIcon size={12} />
                  Add Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#B38B21]/30 transition-all cursor-pointer">
                  <Upload size={32} className="mx-auto mb-3 text-white/20" />
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Upload device photos</p>
                  <p className="text-[8px] text-white/20">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Clock size={18} className="text-[#B38B21]" />
                  Service Priority
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, urgency: level.id })}
                      className={`p-5 rounded-xl border text-center transition-all ${
                        formData.urgency === level.id 
                          ? 'bg-gradient-to-br from-[#B38B21]/20 to-[#D4AF37]/10 border-[#B38B21]' 
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <level.icon size={24} className={`mx-auto mb-2 ${formData.urgency === level.id ? 'text-[#B38B21]' : 'text-white/30'}`} />
                      <p className={`text-[11px] font-black uppercase tracking-wider mb-1 ${
                        formData.urgency === level.id ? 'text-white' : 'text-white/50'
                      }`}>
                        {level.label}
                      </p>
                      <p className="text-[8px] text-white/30 uppercase tracking-wider mb-2">{level.desc}</p>
                      <p className="text-[10px] font-black text-[#B38B21]">
                        {level.price === 0 ? 'FREE' : `+${formatCurrency(level.price)}`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Calendar size={20} className="text-[#B38B21]" />
                  Select Date
                  <span className="text-[#B38B21] text-sm">*</span>
                </h3>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-6 py-5 text-lg font-black outline-none text-white focus:border-[#B38B21]/30 transition-all"
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <Clock size={20} className="text-[#B38B21]" />
                  Select Time Slot
                  <span className="text-[#B38B21] text-sm">*</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setFormData({ ...formData, timeSlot: slot.id })}
                      disabled={!slot.available}
                      className={`p-5 rounded-xl border text-center transition-all ${
                        !slot.available
                          ? 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                          : formData.timeSlot === slot.id 
                          ? 'bg-gradient-to-br from-[#B38B21]/20 to-[#D4AF37]/10 border-[#B38B21]' 
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Clock size={18} className={`mx-auto mb-2 ${
                        !slot.available ? 'text-white/10' :
                        formData.timeSlot === slot.id ? 'text-[#B38B21]' : 'text-white/30'
                      }`} />
                      <p className={`text-sm font-black mb-1 ${
                        !slot.available ? 'text-white/20' :
                        formData.timeSlot === slot.id ? 'text-white' : 'text-white/50'
                      }`}>
                        {slot.time}
                      </p>
                      <p className="text-[8px] text-white/30 uppercase tracking-wider">
                        {slot.available ? slot.label : 'Booked'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#B38B21]/10 border border-[#B38B21]/20 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle size={20} className="text-[#B38B21] shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white">Important Note</p>
                  <p className="text-[9px] text-white/60 leading-relaxed">
                    Our technical staff will contact you to confirm the exact appointment time. Please ensure your contact details are correct in the next step.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Details */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                  <User size={20} className="text-[#B38B21]" />
                  Contact Information
                </h3>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
                  We'll use these details to confirm your appointment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <User size={12} />
                    Full Name <span className="text-[#B38B21]">*</span>
                  </label>
                  <input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-[#B38B21]/30 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Phone size={12} />
                    Phone Number <span className="text-[#B38B21]">*</span>
                  </label>
                  <input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-[#B38B21]/30 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Mail size={12} />
                  Email Address <span className="text-[#B38B21]">*</span>
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold outline-none focus:border-[#B38B21]/30 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <MapPin size={12} />
                  Address (Optional)
                </label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Your pickup/delivery address"
                  rows={3}
                  className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-5 py-4 text-[11px] font-normal outline-none focus:border-[#B38B21]/30 transition-all resize-none placeholder:text-white/20"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#B38B21]/20 to-[#D4AF37]/10 text-[#B38B21] rounded-2xl flex items-center justify-center mx-auto border-2 border-[#B38B21]/30">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">Review Your Request</h3>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider">
                    Please verify all details before submitting
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Device', value: `${formData.brand} ${formData.model}`, icon: Smartphone },
                  { label: 'Type', value: deviceTypes.find(d => d.id === formData.deviceType)?.label, icon: Package },
                  { label: 'Condition', value: conditions.find(c => c.id === formData.condition)?.label, icon: Activity },
                  { label: 'Priority', value: urgencyLevels.find(u => u.id === formData.urgency)?.label, icon: Clock },
                  { label: 'Appointment', value: formData.date ? `${formData.date} at ${timeSlots.find(t => t.id === formData.timeSlot)?.time}` : 'Not set', icon: Calendar },
                  { label: 'Contact', value: `${formData.name} • ${formData.phone}`, icon: User },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={18} className="text-[#B38B21]" />
                      <div>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-[11px] font-black text-white">{item.value}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setStep(i < 2 ? 1 : i < 4 ? 2 : i === 4 ? 3 : 4)}
                      className="text-[9px] font-bold text-[#B38B21] uppercase tracking-wider hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
                <p className="text-[10px] font-bold text-white/50 leading-relaxed">
                  <span className="text-white font-black">Issue Description:</span><br/>
                  {formData.description}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-white/10">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                step === 1 
                  ? 'opacity-0 invisible' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>
            
            {step < 5 ? (
              <button 
                onClick={() => {
                  if (!canProceed()) {
                    notify('Please complete all required fields', 'error');
                    return;
                  }
                  setStep(step + 1);
                }}
                disabled={!canProceed()}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={submitRepairRequest}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#B38B21] to-[#D4AF37] text-black rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Submit Request <Send size={16} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: CheckCircle2, label: 'Certified Technicians', desc: 'Expert repairs' },
            { icon: Package, label: 'Genuine Parts', desc: 'Original components' },
            { icon: Clock, label: 'Fast Service', desc: 'Quick turnaround' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
              <item.icon size={20} className="text-[#B38B21]" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white">{item.label}</p>
                <p className="text-[8px] text-white/30 uppercase tracking-wider">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};