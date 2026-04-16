/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box,
  Truck, 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Bell, 
  User as UserIcon, 
  CreditCard, 
  Map, 
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Package,
  ArrowRight,
  Camera,
  Smartphone,
  LayoutGrid,
  Wallet,
  Receipt,
  Star,
  Send,
  Info,
  BadgeCheck,
  Settings,
  X,
  PlusCircle,
  Car,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import { AppView, User, Notification, Booking } from './types';

// Components for different screens will be defined or imported here.
// For brevity and organization, I'll define common UI elements and then the views.

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Payment Successful', message: 'Transaction #B12-990 confirmed.', timestamp: '1h ago', read: true, type: 'payment' },
    { id: '2', title: '50% Off Next Trip', message: 'Enjoy a half-price delivery.', timestamp: '3h ago', read: false, type: 'offer' }
  ]);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const addNotification = (title: string, message: string, type: Notification['type'] = 'trip') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const [user, setUser] = useState<User>({
    name: 'MD Rustom Hosen Ripon',
    phone: '01805736679',
    email: 'rhripon2025@gmail.com',
    isKycVerified: true,
    avatar: 'https://picsum.photos/seed/user123/200/200'
  });

  const [booking, setBooking] = useState<Booking>({
    id: Math.random().toString(36).substr(2, 9),
    pickup: 'Current Location',
    dropoff: 'Dhaka, Bangladesh',
    type: 'Furniture',
    weight: 500,
    timing: 'now',
    status: 'pending',
    price: 1240
  });

  const [pastBookings, setPastBookings] = useState<Booking[]>([
    {
      id: 'B-1001',
      pickup: 'Gulshan 2, Dhaka',
      dropoff: 'Banani, Dhaka',
      type: 'Industrial',
      weight: 1200,
      timing: 'now',
      status: 'completed',
      price: 2450,
      date: '2026-04-12'
    },
    {
      id: 'B-1002',
      pickup: 'Chittagong Port',
      dropoff: 'Uttara, Dhaka',
      type: 'Electronics',
      weight: 850,
      timing: 'scheduled',
      status: 'completed',
      price: 8900,
      date: '2026-04-14'
    },
    {
      id: 'B-1003',
      pickup: 'Savar, Dhaka',
      dropoff: 'Gazipur, Dhaka',
      type: 'Furniture',
      weight: 450,
      timing: 'now',
      status: 'pending',
      price: 1800,
      date: '2026-04-16'
    }
  ]);

  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => setCurrentView('welcome'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const navigate = (view: AppView) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'splash' && (
          <SplashView key="splash" />
        )}

        {currentView === 'welcome' && (
          <WelcomeView key="welcome" onContinue={() => navigate('signup')} />
        )}

        {currentView === 'signup' && (
          <SignUpView key="signup" onContinue={() => navigate('otp')} onLogin={() => navigate('welcome')} />
        )}

        {currentView === 'otp' && (
          <OtpView key="otp" onVerify={() => navigate('kyc-doc')} onBack={() => navigate('signup')} />
        )}

        {currentView === 'kyc-doc' && (
          <KycDocView key="kyc-doc" onNext={() => navigate('kyc-upload')} onBack={() => navigate('otp')} />
        )}

        {currentView === 'kyc-upload' && (
          <KycUploadView key="kyc-upload" onSubmit={() => navigate('kyc-success')} onBack={() => navigate('kyc-doc')} />
        )}

        {currentView === 'kyc-success' && (
          <KycSuccessView key="kyc-success" onHome={() => navigate('home')} />
        )}

        {currentView === 'home' && (
          <HomeView key="home" user={user} navigate={navigate} unreadCount={notifications.filter(n => !n.read).length} pastBookings={pastBookings} />
        )}

        {currentView === 'profile' && (
          <ProfileView key="profile" user={user} navigate={navigate} />
        )}

        {currentView === 'edit-profile' && (
          <EditProfileView key="edit-profile" user={user} onSave={() => navigate('profile')} onBack={() => navigate('profile')} />
        )}

        {currentView === 'booking-step1' && (
          <BookingStep1View key="booking-step1" onContinue={() => navigate('booking-step2')} onBack={() => navigate('home')} />
        )}

        {currentView === 'booking-step2' && (
          <BookingStep2View 
            key="booking-step2" 
            booking={booking}
            setBooking={setBooking}
            onContinue={() => navigate('booking-step3')} 
            onBack={() => navigate('booking-step1')} 
          />
        )}

        {currentView === 'booking-step3' && (
          <BookingStep3View key="booking-step3" onConfirm={() => navigate('payment')} onBack={() => navigate('booking-step2')} />
        )}

        {currentView === 'payment' && (
          <PaymentView 
            key="payment" 
            onPay={() => {
              addNotification('Vehicle Assigned', 'A Mini Truck (ABC-1234) has been assigned to your booking.');
              navigate('booking-tracking');
            }} 
            onBack={() => navigate('booking-step3')} 
          />
        )}

        {currentView === 'booking-tracking' && (
          <BookingTrackingView 
            key="booking-tracking" 
            onBack={() => navigate('home')}
            onArrived={() => {
              addNotification('Delivery Completed', 'Your shipment has been delivered successfully. Please rate your experience.', 'trip');
              setBooking(prev => ({ ...prev, status: 'completed' }));
              navigate('feedback');
            }}
            onStart={() => {
              addNotification('Shipment En Route', 'Your shipment is now on the way to the destination.', 'trip');
            }}
          />
        )}

        {currentView === 'feedback' && (
          <FeedbackView key="feedback" onSubmit={() => navigate('home')} />
        )}

        {currentView === 'notifications' && (
          <NotificationsView 
            key="notifications" 
            notifications={notifications} 
            onBack={() => navigate('home')} 
            onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          />
        )}

        {currentView === 'booking-history' && (
          <BookingHistoryView 
            key="booking-history" 
            bookings={pastBookings} 
            onBack={() => navigate('home')} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeToast && (
          <Toast 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
            onClick={() => {
              setActiveToast(null);
              navigate('notifications');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Toast({ notification, onClose, onClick }: { notification: Notification, onClose: () => void, onClick: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
    >
      <div 
        onClick={onClick}
        className="bg-white rounded-2xl p-4 shadow-2xl border border-outline-variant/10 flex items-start gap-4 cursor-pointer hover:bg-surface-container transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          notification.type === 'trip' ? 'bg-primary/10 text-primary' :
          notification.type === 'payment' ? 'bg-green-100 text-green-700' :
          notification.type === 'offer' ? 'bg-purple-100 text-purple-700' :
          'bg-red-100 text-red-700'
        }`}>
          {notification.type === 'trip' ? <Truck size={24} /> :
           notification.type === 'payment' ? <CreditCard size={24} /> :
           notification.type === 'offer' ? <Star size={24} /> :
           <Bell size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-on-surface truncate">{notification.title}</h4>
          <p className="text-sm text-on-surface-variant line-clamp-2">{notification.message}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-1 hover:bg-surface-dim rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// --- VIEW COMPONENTS ---

interface ViewProps {
  key?: string;
}

function SplashView() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-80 h-80 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-brand-blue/40 animate-pulse-ring"></div>
          <div className="absolute inset-0 rounded-full border-2 border-brand-blue/25 animate-pulse-ring" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute inset-0 rounded-full border-2 border-brand-blue/15 animate-pulse-ring" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative p-12 bg-white/50 rounded-full glass-blur flex items-center justify-center mb-8">
          <div className="text-primary flex items-center gap-2">
            <Smartphone size={48} />
            <span className="font-manrope text-5xl font-extrabold tracking-tighter">S</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="font-manrope text-4xl font-extrabold tracking-tight text-on-surface">SMART <span className="text-brand-blue">OS</span></h1>
          <p className="text-sm text-slate-500 uppercase tracking-[0.4em] font-light">
            Smart Platform & Technology
          </p>
        </div>
      </div>

      <div className="absolute bottom-16 w-full max-w-md px-8 flex flex-col items-center space-y-6">
        <div className="flex items-center space-y-1 flex-col">
          <span className="text-[10px] text-brand-blue font-bold uppercase tracking-widest opacity-80">Initializing Core Systems</span>
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Truck size={14} className="text-brand-blue" />
            </motion.div>
            <span className="text-[11px] font-medium text-slate-400">Precision Fluidity v4.0</span>
          </div>
        </div>
        
        <div className="relative w-full h-[2px] bg-surface-container-high rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue to-primary-container animate-loading-bar rounded-full shadow-[0_0_8px_rgba(10,132,255,0.5)]"></div>
        </div>

        <div className="flex justify-between w-full opacity-30 px-2">
          <span className="text-[9px] font-medium tracking-tighter">LDN</span>
          <span className="text-[9px] font-medium tracking-tighter">NYC</span>
          <span className="text-[9px] font-medium tracking-tighter">SGP</span>
          <span className="text-[9px] font-medium tracking-tighter">DXB</span>
          <span className="text-[9px] font-medium tracking-tighter">TKY</span>
        </div>
      </div>
    </motion.main>
  );
}

function WelcomeView({ onContinue }: { onContinue: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-[420px] space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-surface-container-lowest flex items-center justify-center shadow-sm">
             <Smartphone size={40} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center leading-tight font-manrope">
            Welcome to SMART ECOSYSTEM
          </h1>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-on-surface-variant px-1">Phone Number</label>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-4 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <span className="text-base font-medium">+88</span>
              </div>
              <div className="flex-1">
                <input 
                  type="tel" 
                  className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-lg font-medium focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant outline-none" 
                  placeholder="000-000-0000" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-3xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Continue
            </button>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-on-surface-variant text-sm">Don't have an account?</span>
              <button 
                className="text-primary font-bold text-sm hover:underline"
                onClick={onContinue}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 bg-surface-container-low py-4 rounded-2xl hover:bg-surface-container-high transition-colors active:scale-95">
            <UserIcon size={20} className="text-on-surface-variant" />
            <span className="text-sm font-bold text-on-surface">Email</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-surface-container-low py-4 rounded-2xl hover:bg-surface-container-high transition-colors active:scale-95">
            <LayoutGrid size={20} className="text-on-surface-variant" />
            <span className="text-sm font-bold text-on-surface">QR Scan</span>
          </button>
        </div>
      </div>
      
      <footer className="mt-auto py-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
          <ShieldCheck size={16} className="text-outline" />
          <span className="text-[11px] font-bold text-outline uppercase tracking-widest">Secure encrypted login</span>
        </div>
      </footer>
    </motion.main>
  );
}

function SignUpView({ onContinue, onLogin }: { onContinue: () => void; onLogin: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-md mx-auto relative z-10 flex flex-col h-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden mt-10"
    >
      <header className="pt-8 px-6 pb-6 flex flex-col gap-6">
        <div className="flex justify-center mb-2">
           <Smartphone size={32} className="text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
          <div className="h-1.5 flex-1 bg-surface-container-high rounded-full"></div>
          <div className="h-1.5 flex-1 bg-surface-container-high rounded-full"></div>
        </div>
        <div className="text-center">
          <p className="text-sm text-primary font-medium tracking-wide uppercase mb-2">Step 1 of 3</p>
          <h1 className="font-manrope text-3xl font-extrabold tracking-tight text-on-surface mb-2">Create Your Account</h1>
          <p className="text-base text-on-surface-variant">Let's start with the basics to get you moving.</p>
        </div>
      </header>

      <div className="flex-1 px-6 pb-8 bg-surface-container-low/50">
        <form className="flex flex-col gap-6 pt-6" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface">Full Name</label>
            <div className="relative flex items-center bg-surface-container-highest rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all group">
              <UserIcon className="absolute left-4 text-outline group-focus-within:text-primary" size={20} />
              <input 
                type="text" 
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base text-on-surface placeholder:text-outline focus:ring-0 outline-none" 
                placeholder="MD Rustom Hosen Ripon" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface">Phone Number</label>
            <div className="flex items-center bg-surface-container-highest rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
              <div className="relative flex items-center border-r border-outline-variant/30">
                <select className="appearance-none bg-transparent border-none py-4 pl-4 pr-8 text-base font-body text-on-surface focus:ring-0 outline-none cursor-pointer">
                  <option>🇧🇩 +880</option>
                </select>
              </div>
              <input 
                type="tel" 
                className="w-full bg-transparent border-none py-4 pl-4 pr-4 text-base text-on-surface placeholder:text-outline focus:ring-0 outline-none" 
                placeholder="01805736679" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-medium text-on-surface">Email Address</label>
              <span className="text-xs text-outline">Optional</span>
            </div>
            <div className="relative flex items-center bg-surface-container-highest rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all group">
              <Bell className="absolute left-4 text-outline group-focus-within:text-primary" size={20} />
              <input 
                type="email" 
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base text-on-surface placeholder:text-outline focus:ring-0 outline-none" 
                placeholder="rhripon2025@gmail.com" 
              />
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold text-lg py-4 px-6 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
            <p className="text-center text-sm text-on-surface-variant mt-6">
              Already have an account? <button type="button" onClick={onLogin} className="text-primary font-medium hover:text-primary-container">Log in</button>
            </p>
          </div>
        </form>
      </div>
    </motion.main>
  );
}

function OtpView({ onVerify, onBack }: { onVerify: () => void; onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fc]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-slate-500" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">KYC Verification</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 max-w-lg mx-auto w-full flex flex-col">
        <div className="mb-8 flex items-center justify-between w-full">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm mb-2 shadow-sm">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-xs font-medium text-primary">Identity</span>
          </div>
          <div className="h-1 bg-primary flex-1 mx-2 rounded-full"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm mb-2 relative">
              2
              <div className="absolute inset-0 rounded-full border-2 border-primary-container blur-[1px] opacity-50"></div>
            </div>
            <span className="text-xs font-medium text-primary">Phone</span>
          </div>
          <div className="h-1 bg-surface-container-highest flex-1 mx-2 rounded-full"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-sm mb-2">3</div>
            <span className="text-xs font-medium text-on-surface-variant">Details</span>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h2 className="font-manrope text-3xl font-bold tracking-tight text-on-surface mb-3">Verify Your Phone</h2>
          <p className="text-on-surface-variant leading-relaxed">
            We've sent a 6-digit code to <br/>
            <span className="font-manrope font-bold text-on-surface">+1 (555) 019-2834</span>
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-surface-container-low mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-container rounded-full blur-[64px] opacity-10 pointer-events-none"></div>
          <form className="flex flex-col items-center relative z-10" onSubmit={(e) => { e.preventDefault(); onVerify(); }}>
            <div className="flex justify-between w-full gap-2 mb-8">
              {[4, 2, '', '', '', ''].map((val, i) => (
                <input 
                  key={i}
                  readOnly={i < 2}
                  defaultValue={val}
                  className="w-12 h-14 md:w-14 md:h-16 bg-surface-container-highest border-none rounded-md text-center font-manrope text-2xl font-bold text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all shadow-inner" 
                  maxLength={1} 
                  placeholder="0"
                />
              ))}
            </div>
            <div className="flex items-center justify-center space-x-2 mb-6 text-on-surface-variant text-sm">
              <Clock size={16} />
              <span>01:45</span>
            </div>
            <div className="text-center w-full mb-8">
              <button type="button" className="font-medium text-primary hover:text-primary-container transition-colors">
                Resend OTP
              </button>
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-manrope font-bold text-lg py-4 px-6 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Verify
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center space-x-2 text-on-surface-variant bg-surface-container-low rounded-lg p-3 mx-auto w-fit">
          <ShieldCheck size={16} className="text-primary" />
          <span className="text-xs">Secure Verification Process</span>
        </div>
      </main>
    </motion.main>
  );
}

function KycDocView({ onNext, onBack }: { onNext: () => void; onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-xl mx-auto px-6 pt-24 pb-32 space-y-8"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fc]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">KYC Verification</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-semibold mb-2 shadow-sm">
            <CheckCircle2 size={16} />
          </div>
          <span className="text-xs text-on-surface-variant text-center">Basic Info</span>
        </div>
        <div className="flex-1 h-px bg-primary opacity-30 mx-2 -mt-6"></div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-semibold mb-2 shadow-sm">
            <CheckCircle2 size={16} />
          </div>
          <span className="text-xs text-on-surface-variant text-center">Address</span>
        </div>
        <div className="flex-1 h-px bg-primary opacity-30 mx-2 -mt-6"></div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-semibold mb-2 shadow-[0_0_15px_rgba(0,90,179,0.4)]">
            3
          </div>
          <span className="text-xs text-primary font-medium text-center">Identity</span>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-manrope text-2xl tracking-tight font-bold text-on-surface">Select Document Type</h2>
        <p className="text-sm text-on-surface-variant">Please choose the type of official document you wish to upload for verification.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={onNext}
            className="relative w-full text-left bg-surface-container-lowest rounded-xl p-5 border-2 border-primary shadow-sm flex flex-col items-start gap-4 transition-transform active:scale-95 duration-200"
          >
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircle2 size={20} />
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <BadgeCheck size={24} />
            </div>
            <div>
              <h3 className="font-manrope font-bold text-base text-on-surface">National ID</h3>
              <span className="text-xs text-on-surface-variant mt-1 block">Government issued ID card</span>
            </div>
          </button>

          <button className="w-full text-left bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:bg-surface-container transition-colors flex flex-col items-start gap-4 active:scale-95 group">
            <div className="w-12 h-12 rounded-lg bg-surface-variant text-on-surface-variant flex items-center justify-center group-hover:bg-primary-fixed group-hover:text-primary">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-manrope font-bold text-base text-on-surface group-hover:text-primary">Passport</h3>
              <span className="text-xs text-on-surface-variant mt-1 block">International travel document</span>
            </div>
          </button>

          <button className="w-full text-left bg-surface-container-low rounded-xl p-5 border-2 border-transparent hover:bg-surface-container transition-colors flex flex-col items-start gap-4 active:scale-95 group">
            <div className="w-12 h-12 rounded-lg bg-surface-variant text-on-surface-variant flex items-center justify-center group-hover:bg-primary-fixed group-hover:text-primary">
              <Car size={24} />
            </div>
            <div>
              <h3 className="font-manrope font-bold text-base text-on-surface group-hover:text-primary">Driving License</h3>
              <span className="text-xs text-on-surface-variant mt-1 block">Official permit to drive</span>
            </div>
          </button>
        </div>
      </section>
    </motion.main>
  );
}

function KycUploadView({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-2xl mx-auto px-4 pt-24 pb-32 space-y-8"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">KYC Verification</h1>
        <div className="w-10"></div>
      </header>

      <div className="space-y-6 pt-6 relative">
        <h2 className="font-manrope text-2xl tracking-tight font-bold text-on-surface">Upload Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container transition-colors cursor-pointer text-center group h-48">
            <div className="w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-4 group-hover:bg-primary-fixed group-hover:text-primary">
              <Smartphone size={24} />
            </div>
            <h4 className="font-manrope font-bold text-sm text-on-surface mb-1">Front of ID</h4>
            <p className="text-xs text-on-surface-variant">Tap to upload or take a photo</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container transition-colors cursor-pointer text-center group h-48">
            <div className="w-12 h-12 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-4 group-hover:bg-primary-fixed group-hover:text-primary">
              <Smartphone size={24} />
            </div>
            <h4 className="font-manrope font-bold text-sm text-on-surface mb-1">Back of ID</h4>
            <p className="text-xs text-on-surface-variant">Tap to upload or take a photo</p>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-xl p-6 mt-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 shrink-0 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="font-manrope text-lg font-bold text-on-surface mb-1">Selfie Verification</h2>
            <p className="text-sm text-on-surface-variant">Please take a selfie holding your ID next to your face to confirm your identity.</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-surface-variant">
          <div className="absolute inset-0 bg-surface-variant animate-pulse opacity-50"></div>
          <div className="text-center relative z-10 p-6 flex flex-col items-center">
            <Camera size={40} className="text-on-surface-variant mb-2" />
            <p className="text-sm text-on-surface-variant">Camera preview will appear here</p>
          </div>
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="flex justify-between w-full">
              <div className="w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
            </div>
            <div className="flex justify-between w-full">
              <div className="w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 px-6 rounded-xl font-manrope font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 border-none">
          <Camera size={18} />
          Capture Selfie
        </button>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-3 border border-surface-variant mt-8">
        <ShieldCheck size={20} className="text-secondary" />
        <p className="text-xs text-on-surface-variant flex-1">Your data is securely encrypted and never shared with third parties without your consent.</p>
      </div>

      <div className="pt-8 flex justify-end gap-4">
        <button className="bg-surface-container-low text-on-surface py-3 px-6 rounded-xl font-manrope font-bold text-sm tracking-wide hover:bg-surface-container active:scale-95">
          Save Draft
        </button>
        <button 
          onClick={onSubmit}
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 px-8 rounded-xl font-manrope font-bold text-sm tracking-wide shadow-md hover:opacity-90 active:scale-95"
        >
          Submit Verification
        </button>
      </div>
    </motion.main>
  );
}

function KycSuccessView({ onHome }: { onHome: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed blur-[100px] rounded-full opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-fixed blur-[100px] rounded-full opacity-30 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-center">
        <h1 className="text-blue-600 font-manrope font-bold text-lg">KYC Verification</h1>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-lg px-6">
        <div className="relative flex items-center justify-center w-40 h-40 mb-10">
          <div className="absolute inset-0 bg-primary-fixed rounded-full blur-2xl opacity-70 scale-125"></div>
          <div className="absolute inset-0 rounded-full border border-primary-fixed opacity-60 scale-110"></div>
          <div className="relative z-10 w-28 h-28 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-xl border border-outline-variant/15">
            <CheckCircle2 size={72} className="text-primary" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="font-manrope font-extrabold text-4xl text-on-surface tracking-tight leading-tight">
            Verification<br/>Submitted
          </h2>
          <p className="text-on-surface-variant text-lg max-w-sm mx-auto leading-relaxed">
            Your account is under review. You will receive an update once the process is complete.
          </p>
        </div>

        <div className="mt-8 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/15 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="text-sm text-on-surface-variant font-medium">Review pending</span>
        </div>
      </div>

      <div className="w-full max-w-md mt-16 px-6 pb-20">
        <button 
          onClick={onHome}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl py-4 px-6 font-semibold text-lg tracking-wide shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Go to Home
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.main>
  );
}

function HomeView({ user, navigate, unreadCount, pastBookings }: { user: User; navigate: (v: AppView) => void; unreadCount: number; pastBookings: Booking[]; key?: string }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32"
    >
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
           <Truck size={32} className="text-blue-600" />
          <span className="text-lg font-black tracking-tight text-blue-600 font-manrope uppercase">LOGISTICS ELITE</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('notifications')}
            className="p-2 rounded-full hover:bg-blue-50 transition-colors relative"
          >
            <Bell size={24} className="text-on-surface-variant" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-primary text-on-primary text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white ring-1 ring-primary/20 animate-pulse">
               {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('profile')}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-surface-container active:scale-95 transition-transform"
          >
            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="px-6 pt-8 max-w-7xl mx-auto">
        <section className="mb-10">
          <h1 className="font-manrope text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-on-surface-variant font-medium text-lg">Manage your logistics ecosystem today.</p>
        </section>

        <section className="mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search size={20} className="text-outline" />
            </div>
            <input 
              className="w-full h-16 pl-14 pr-6 bg-surface-container-highest border-none rounded-2xl font-body text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm outline-none" 
              placeholder="Search services, tracking IDs, or hubs..." 
            />
          </div>
        </section>

        <section className="mb-12">
          <div 
            onClick={() => navigate('booking-step1')}
            className="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg bg-surface-container-lowest"
          >
            <div className="flex flex-col md:flex-row min-h-[320px]">
              <div className="flex-1 p-8 flex flex-col justify-between relative z-10">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                    Priority Service
                  </div>
                  <h2 className="font-manrope text-3xl font-extrabold tracking-tighter mb-4 text-on-surface">Truck Booking</h2>
                  <p className="text-on-surface-variant max-w-sm text-lg leading-relaxed mb-8">
                    On-demand freight solutions with real-time GPS tracking and instant fleet availability.
                  </p>
                </div>
                <button className="bg-primary w-fit px-8 py-4 rounded-2xl text-on-primary font-bold flex items-center gap-3 shadow-lg hover:brightness-110 transition-all">
                  <span>Book Now</span>
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex-1 relative min-h-[240px] md:min-h-full">
                <div className="absolute inset-0 bg-surface-container-low">
                  <img 
                    src="https://storage.googleapis.com/test-media-human-eval/antigravity/GAFFAR_Truck.png" 
                    alt="Gaffar Truck" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/40 shadow-2xl">
                    <Truck size={64} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-manrope text-2xl font-bold tracking-tight">Recent Shipments</h3>
            <button 
              onClick={() => navigate('booking-history')}
              className="text-primary font-bold text-sm hover:underline"
            >
              See All
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm divide-y divide-outline-variant/5">
            {[...pastBookings].reverse().slice(0, 2).map((b) => (
              <div key={b.id} className="p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container-low transition-colors first:rounded-t-3xl last:rounded-b-3xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{b.id}</h4>
                    <p className="text-xs text-on-surface-variant font-medium">{b.pickup.split(',')[0]} → {b.dropoff.split(',')[0]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-manrope font-black text-on-surface">৳{b.price.toLocaleString()}</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${b.status === 'completed' ? 'text-green-600' : 'text-primary'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="font-manrope text-2xl font-bold tracking-tight mb-6">Ecosystem Services</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center mb-4 text-secondary">
                <Car size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">Taxi</h4>
              <p className="text-on-surface-variant text-sm">On-demand city rides</p>
            </div>

            {[
              { label: 'Foods', icon: <Search size={24} /> },
              { label: 'Online Shop', icon: <LayoutGrid size={24} /> },
              { label: 'Online Medical', icon: <ShieldCheck size={24} /> }
            ].map(service => (
              <div key={service.label} className="p-6 rounded-3xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-12 h-12 rounded-xl bg-surface-dim/40 flex items-center justify-center mb-4 text-outline">
                  {service.icon}
                </div>
                <span className="font-bold text-outline uppercase text-[10px] tracking-widest bg-outline/10 px-2 py-1 rounded-md mb-2">Coming Soon</span>
                <h4 className="font-bold text-outline uppercase text-xs">{service.label}</h4>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav active="home" onNavigate={navigate} />
    </motion.main>
  );
}

function ProfileView({ user, navigate }: { user: User; navigate: (v: AppView) => void; key?: string }) {
  return (
    <motion.main 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pt-20 px-4 pb-32 max-w-4xl mx-auto space-y-6"
    >
      <header className="bg-surface fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 shadow-sm">
        <button onClick={() => navigate('home')} className="text-blue-600 p-2 rounded-full hover:bg-slate-50">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-blue-600 font-manrope font-bold text-lg">Profile</h1>
        <button className="text-blue-600 p-2 rounded-full hover:bg-slate-50">
          <Settings size={24} />
        </button>
      </header>

      <section className="flex flex-col items-center justify-center py-6">
        <div className="relative w-32 h-32 mb-4">
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest shadow-md" />
          <button 
            onClick={() => navigate('edit-profile')}
            className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 shadow-md hover:bg-primary-container active:scale-95 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
        <h2 className="text-2xl font-manrope font-bold text-on-surface tracking-tight mb-1">{user.name}</h2>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-3">
          <span>{user.phone}</span>
          <BadgeCheck size={16} className="text-primary" />
        </div>
        {user.isKycVerified && (
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <CheckCircle2 size={14} />
            KYC Verified
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-manrope font-bold text-lg text-on-surface">Personal Info</h3>
            <button onClick={() => navigate('edit-profile')} className="text-primary hover:bg-primary/5 p-1 rounded-md">
              <Settings size={20} />
            </button>
          </div>
          {[
            { icon: <UserIcon size={20} />, label: 'Full Name', value: user.name },
            { icon: <Smartphone size={20} />, label: 'Phone Number', value: user.phone },
            { icon: <Bell size={20} />, label: 'Email Address', value: user.email }
          ].map((item, i) => (
             <div key={i} className="flex items-start gap-4">
              <div className="bg-surface-container-low p-3 rounded-2xl text-on-surface-variant">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="font-medium text-on-surface">{item.value}</p>
              </div>
            </div>
          ))}
        </article>

        <article className="bg-primary rounded-3xl p-6 shadow-lg flex flex-col justify-between text-on-primary relative overflow-hidden h-full">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black opacity-10 rounded-full blur-3xl"></div>
          <div className="z-10 relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-manrope font-bold text-lg mb-1">Identity Verification</h3>
                <p className="text-sm opacity-90">Secure SMART Platform Access</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <BadgeCheck size={24} />
              <span className="text-lg font-semibold tracking-tight">Status: Verified</span>
            </div>
          </div>
          <button className="z-10 relative bg-surface-container-lowest text-primary font-semibold py-3 px-4 rounded-xl hover:bg-surface active:scale-95 transition-all flex items-center justify-center gap-2 w-full mt-auto">
            View Documents
            <ArrowRight size={18} />
          </button>
        </article>
      </div>
      
      <div className="w-full space-y-3">
        <button 
           onClick={() => navigate('booking-history')}
           className="w-full flex items-center justify-between p-6 bg-surface-container-low rounded-3xl hover:bg-white border border-transparent hover:border-primary/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors shadow-sm">
              <Box size={24} />
            </div>
            <span className="font-bold text-lg text-on-surface">Past Bookings</span>
          </div>
          <ChevronRight size={24} className="text-outline" />
        </button>
      </div>
      
      <BottomNav active="account" onNavigate={navigate} />
    </motion.main>
  );
}

// Minimal Navigation
function BottomNav({ active, onNavigate }: { active: string; onNavigate: (v: AppView) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-2xl">
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl transition-all scale-90 ${active === 'home' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
      >
        <LayoutGrid size={24} />
        <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">Home</span>
      </button>
      <button 
        onClick={() => onNavigate('booking-tracking')}
        className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl transition-all scale-90 ${active === 'bookings' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
      >
        <Truck size={24} />
        <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">Bookings</span>
      </button>
      <button className="flex flex-col items-center justify-center px-5 py-2.5 text-slate-400 scale-90">
        <Wallet size={24} />
        <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">Wallet</span>
      </button>
      <button 
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl transition-all scale-90 ${active === 'account' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
      >
        <UserIcon size={24} />
        <span className="text-[10px] font-semibold uppercase tracking-wider mt-1">Account</span>
      </button>
    </nav>
  );
}

// Minimal Navigation

function BookingStep1View({ onContinue, onBack }: { onContinue: () => void; onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen relative overflow-hidden bg-surface-container-high"
    >
       <div className="absolute inset-0 bg-[#e5e7eb] overflow-hidden grayscale opacity-80">
         <div className="absolute inset-0 opacity-40">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
         </div>
         <img src="https://picsum.photos/seed/smartmap/1200/800" className="w-full h-full object-cover mix-blend-multiply opacity-20" />
       </div>

       <div className="absolute top-10 left-6 z-50">
         <button onClick={onBack} className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl hover:bg-white active:scale-95 transition-all text-primary">
           <ChevronLeft size={24} />
         </button>
       </div>

       <div className="absolute bottom-0 left-0 w-full z-50 px-4 pb-4">
         <div className="bg-white rounded-[3rem] p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] flex flex-col gap-8 max-w-2xl mx-auto border border-outline-variant/10">
            <div className="w-16 h-1.5 bg-surface-container-high rounded-full mx-auto"></div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-manrope">Book a Pickup</h2>
              <p className="text-on-surface-variant font-medium">Set your logistics route</p>
            </div>

            <div className="space-y-6 relative">
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary to-outline-variant opacity-30"></div>
              
              <div className="flex items-center gap-5 p-4 bg-surface-container-low rounded-2xl border border-transparent focus-within:border-primary transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary z-10">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Pickup Point</label>
                  <input defaultValue="221B Baker Street, London" className="w-full bg-transparent border-none outline-none font-bold text-on-surface placeholder:text-outline-variant" />
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 bg-surface-container-highest rounded-2xl border border-transparent shadow-inner transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-outline group-focus-within:text-primary z-10 shadow-sm">
                  <PlusCircle size={24} />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Drop-off Point</label>
                  <input placeholder="Enter destination..." className="w-full bg-transparent border-none outline-none font-bold text-on-surface" />
                </div>
              </div>
            </div>

            <button onClick={onContinue} className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-[2rem] font-bold text-lg shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Continue to Vehicle Select
              <ArrowRight size={20} />
            </button>
         </div>
       </div>
    </motion.main>
  );
}

function BookingStep2View({ booking, setBooking, onContinue, onBack }: { booking: Booking, setBooking: (b: Booking) => void, onContinue: () => void; onBack: () => void; key?: string }) {
  const categories = [
    { name: 'Furniture', icon: <HomeIcon size={20} /> },
    { name: 'Electronics', icon: <Smartphone size={20} /> },
    { name: 'Industrial', icon: <Briefcase size={20} /> },
    { name: 'Perishables', icon: <Package size={20} /> },
    { name: 'Building', icon: <LayoutGrid size={20} /> },
    { name: 'Other', icon: <PlusCircle size={20} /> }
  ];

  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-2xl mx-auto px-6 pt-24 pb-32 space-y-10"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">Shipment Details</h1>
        <div className="w-10"></div>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-outline">Category Selection</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <button 
              key={cat.name} 
              onClick={() => setBooking({ ...booking, type: cat.name })}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all group active:scale-95 ${booking.type === cat.name ? 'border-primary bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-surface-container-low opacity-80'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${booking.type === cat.name ? 'text-on-primary bg-primary' : 'bg-white text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10'}`}>
                {cat.icon}
              </div>
              <span className={`font-bold text-sm ${booking.type === cat.name ? 'text-primary' : 'text-on-surface'}`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-outline">Est. Weight</h2>
          <span className="text-2xl font-black text-primary font-manrope">{booking.weight} KG</span>
        </div>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          step="50"
          value={booking.weight}
          onChange={(e) => setBooking({ ...booking, weight: parseInt(e.target.value) })}
          className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
        />
        <div className="flex justify-between text-[10px] font-bold text-outline-variant uppercase">
          <span>100 KG</span>
          <span>1000 KG</span>
          <span>2000 KG</span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-outline">Pickup Timing</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setBooking({ ...booking, timing: 'now' })}
            className={`flex-1 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${booking.timing === 'now' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface hover:bg-white border-2 border-transparent hover:border-primary'}`}
          >
            <Clock size={20} />
            Now
          </button>
          <button 
            onClick={() => setBooking({ ...booking, timing: 'scheduled' })}
            className={`flex-1 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${booking.timing === 'scheduled' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface hover:bg-white border-2 border-transparent hover:border-primary'}`}
          >
            <Map size={20} className={booking.timing === 'scheduled' ? 'text-on-primary' : 'text-outline'} />
            Schedule
          </button>
        </div>

        <AnimatePresence>
          {booking.timing === 'scheduled' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 gap-4 pt-2 overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase ml-2 tracking-widest">Select Date</label>
                <input 
                  type="date"
                  value={booking.date || ''}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 font-manrope font-bold text-on-surface outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-outline uppercase ml-2 tracking-widest">Select Time</label>
                <input 
                  type="time"
                  value={booking.time || ''}
                  onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 font-manrope font-bold text-on-surface outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <button 
        onClick={onContinue} 
        className="w-full bg-primary text-on-primary py-5 rounded-[2.5rem] font-bold text-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        Continue to Choice Vehicle
        <ArrowRight size={24} />
      </button>
    </motion.main>
  );
}

function BookingStep3View({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void; key?: string }) {
  const trucks = [
    { name: 'Mini Truck', capacity: '500 KG', price: '৳850', img: 'https://picsum.photos/seed/truck1/400/300' },
    { name: 'Pickup - 1 Ton', capacity: '1000 KG', price: '৳1,240', img: 'https://picsum.photos/seed/truck2/400/300', recommended: true },
    { name: 'Covered Van', capacity: '2000 KG', price: '৳2,800', img: 'https://picsum.photos/seed/truck3/400/300' }
  ];

  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-3xl mx-auto px-6 pt-24 pb-32 space-y-8"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">Select Vehicle</h1>
        <div className="w-10"></div>
      </header>

      <div className="space-y-6">
        {trucks.map(truck => (
          <div key={truck.name} className={`relative overflow-hidden p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer bg-white ${truck.recommended ? 'border-primary shadow-xl scale-[1.02]' : 'border-outline-variant/20 shadow-sm opacity-80'}`}>
            {truck.recommended && (
              <div className="absolute top-0 right-10 bg-primary text-on-primary px-4 py-1.5 rounded-b-2xl text-[10px] font-black uppercase tracking-widest shadow-md">
                Recommended
              </div>
            )}
            <div className="flex gap-6 items-center">
              <div className="w-32 h-24 bg-surface-container-low rounded-2xl flex items-center justify-center overflow-hidden">
                <img src={truck.img} alt={truck.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-on-surface mb-1">{truck.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-outline bg-surface-container-high px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Package size={14} />
                    {truck.capacity}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-black text-primary font-manrope">{truck.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-4">
        <div className="flex justify-between items-center opacity-60">
          <span className="font-bold text-sm uppercase tracking-wide">Shipment Fare</span>
          <span className="font-manrope font-bold">৳1,100</span>
        </div>
        <div className="flex justify-between items-center opacity-60">
          <span className="font-bold text-sm uppercase tracking-wide">Tax & Tolls (15%)</span>
          <span className="font-manrope font-bold">৳140</span>
        </div>
        <div className="h-px bg-outline-variant/30 my-2"></div>
        <div className="flex justify-between items-center">
          <span className="font-black text-lg uppercase tracking-wider">Estimated Total</span>
          <span className="font-manrope font-black text-2xl text-primary">৳1,240</span>
        </div>
      </div>

      <button onClick={onConfirm} className="w-full bg-primary text-on-primary py-5 rounded-[2rem] font-bold text-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4">
        Confirm Booking
        <ArrowRight size={24} />
      </button>
    </motion.main>
  );
}

function PaymentView({ onPay, onBack }: { onPay: () => void; onBack: () => void; key?: string }) {
  const methods = [
    { id: 'wallet', name: 'Smart Pay Wallet', icon: <Wallet size={24} />, balance: '৳4,520' },
    { id: 'card', name: 'Visa • 4281', icon: <CreditCard size={24} /> },
    { id: 'cash', name: 'Cash on Delivery', icon: <Receipt size={24} /> }
  ];

  return (
    <motion.main 
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      className="max-w-2xl mx-auto px-6 pt-24 pb-32 space-y-8"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">Payment</h1>
        <div className="w-10"></div>
      </header>

      <section className="bg-primary rounded-[2.5rem] p-10 text-on-primary shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] opacity-70 mb-2">Total Amount Due</h2>
        <p className="text-5xl font-black font-manrope">৳1,240.00</p>
        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
          <ShieldCheck size={14} />
          Secure payment active
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-outline ml-4">Payment Method</h2>
        <div className="space-y-3">
          {methods.map(method => (
            <div key={method.id} className="p-6 bg-surface-container-low rounded-3xl border-2 border-transparent hover:border-primary cursor-pointer transition-all flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors shadow-sm">
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-on-surface">{method.name}</h3>
                {method.balance && <p className="text-xs text-primary font-black uppercase tracking-wider">Balance: {method.balance}</p>}
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-all">
                <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={onPay} className="w-full bg-primary text-on-primary py-5 rounded-[2rem] font-bold text-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all mt-6">
        Pay and Secure Booking
      </button>
    </motion.main>
  );
}

function RealTimeMap({ onFocusVehicle, isFocused }: { onFocusVehicle?: () => void, isFocused?: boolean }) {
  const [showDetails, setShowDetails] = useState(false);
  const [speed, setSpeed] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * (45 - 38) + 38));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#F7F9FC] overflow-hidden">
      {/* Background Map Image Simulation */}
      <div className="absolute inset-0 opacity-40">
        <img src="https://picsum.photos/seed/map/1200/1600" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F9FC]/80 via-transparent to-[#F7F9FC]/90"></div>
      </div>
      
      <svg className="w-full h-full p-10 relative z-10" viewBox="0 0 800 1200" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#005ab3" />
            <stop offset="100%" stopColor="#0073e0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Abstract Major Roads */}
        <path d="M-100 400 L 900 400M-100 800 L 900 800M400 -100 L 400 1300" stroke="#E2E8F0" strokeWidth="40" strokeLinecap="round" />
        
        {/* The Route Path (Background) */}
        <path 
          d="M150 1050 L 150 800 L 650 800 L 650 400 L 400 400 L 400 150" 
          stroke="#005ab3" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeDasharray="1 15"
          opacity="0.2"
        />

        {/* Progress Path */}
        <motion.path 
          d="M150 1050 L 150 800 L 650 800 L 650 400 L 400 400 L 400 150" 
          stroke="url(#mapGradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Pickup and Dropoff Markers */}
        <g transform="translate(138, 1010)">
          <circle cx="12" cy="12" r="20" fill="#005ab3" opacity="0.1" className="animate-ping" />
          <circle cx="12" cy="12" r="6" fill="#005ab3" />
        </g>

        <g transform="translate(388, 138)">
          <circle cx="12" cy="12" r="20" fill="#BA1A1A" opacity="0.1" className="animate-ping" />
          <MapPin size={24} className="text-white fill-[#BA1A1A]" />
        </g>

        {/* Animated Truck */}
        <motion.g
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: "path('M150 1050 L 150 800 L 650 800 L 650 400 L 400 400 L 400 150')", offsetRotate: "auto" }}
          className="cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          {/* ETA Bubble */}
          <foreignObject x="-40" y="-80" width="80" height="40" className="pointer-events-none">
            <div className="bg-primary px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-center gap-1">
              <Clock size={12} className="text-white" />
              <span className="text-white font-manrope font-black text-[10px]">12 MINS</span>
            </div>
          </foreignObject>

          <circle cx="0" cy="0" r="28" fill="white" className="shadow-xl" />
          <circle cx="0" cy="0" r="24" stroke="#005ab3" strokeWidth="4" fill="white" />
          <Truck size={24} className="text-[#005ab3]" style={{ transform: 'translate(-12px, -12px)' }} />
          
          {/* Truck Details Tooltip */}
          {showDetails && (
            <motion.foreignObject 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              x="-100" y="-240" width="200" height="155"
              className="pointer-events-none"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-primary/20 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <img src="https://picsum.photos/seed/driver7/100/100" className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-black text-on-surface font-manrope leading-none mb-1">Johnathan Doe</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-primary">
                        <Star size={10} className="fill-primary" />
                        <span className="text-[10px] font-black ml-0.5">4.9</span>
                      </div>
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider">ABC-1234</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-px bg-outline-variant/20"></div>
                
                <div className="flex justify-between w-full px-1">
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-outline uppercase tracking-widest">Live Speed</p>
                    <p className="text-sm font-black text-on-surface font-manrope">{speed} KM/H</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-outline uppercase tracking-widest">Model</p>
                    <p className="text-sm font-black text-on-surface font-manrope">Freightliner</p>
                  </div>
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-primary/10"></div>
              </div>
            </motion.foreignObject>
          )}
        </motion.g>
      </svg>
    </div>
  );
}

function BookingTrackingView({ onArrived, onStart, onBack }: { onArrived: () => void; onStart: () => void; onBack: () => void; key?: string }) {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    // Simulate "En route" notification after 3 seconds
    const timer = setTimeout(onStart, 3000);
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen relative overflow-hidden bg-surface"
    >
       <RealTimeMap isFocused={isFocused} onFocusVehicle={() => setIsFocused(true)} />

       {/* Top Navigation */}
       <header className="absolute top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
           <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-slate-100 transition-colors">
             <ChevronLeft size={24} className="text-blue-600" />
           </button>
           <h1 className="text-lg font-black tracking-tight text-blue-600 font-headline uppercase">SMART ECOSYSTEM</h1>
         </div>
         <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-colors">
           <Bell size={24} className="text-blue-600" />
         </button>
       </header>

       {/* Map Controls */}
       <div className="absolute top-24 right-6 z-40 flex flex-col gap-3">
          <button 
            onClick={() => setIsFocused(!isFocused)}
            className="w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-2xl flex items-center justify-center text-on-surface hover:bg-white transition-all active:scale-90"
          >
            <MapPin size={24} className={isFocused ? 'text-primary' : 'text-outline'} />
          </button>
          <button className="w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-2xl flex items-center justify-center text-on-surface hover:bg-white transition-all active:scale-90">
            <LayoutGrid size={24} className="text-outline" />
          </button>
       </div>

       {/* Driver Details Card */}
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-40 px-6">
         <motion.div 
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.1)] flex flex-col gap-8 w-full"
         >
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-5">
               <div className="relative">
                 <img src="https://picsum.photos/seed/driver7/200/200" className="w-16 h-16 rounded-[1.5rem] object-cover shadow-md" referrerPolicy="no-referrer" />
                 <div className="absolute -bottom-1 -right-1 bg-primary w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                   <BadgeCheck size={14} className="text-white fill-primary" />
                 </div>
               </div>
               <div>
                 <h2 className="text-2xl font-black text-on-surface font-manrope leading-tight">Johnathan Doe</h2>
                 <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                     <Star size={12} className="fill-primary" />
                     4.8
                   </div>
                   <span className="text-outline text-[10px] font-black tracking-widest uppercase">ABC-1234</span>
                 </div>
               </div>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Truck Model</p>
               <p className="text-sm font-black text-on-surface-variant font-manrope">Freightliner M2</p>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <button className="h-16 rounded-[1.5rem] bg-surface-container-high flex items-center justify-center gap-3 text-on-surface font-manrope font-black hover:bg-surface-container-highest transition-all active:scale-95 group">
                <Send size={20} className="text-primary group-hover:scale-110 transition-transform" />
                Message
             </button>
             <button className="h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center gap-3 font-manrope font-black shadow-lg shadow-primary/25 hover:brightness-110 transition-all active:scale-95 group">
                <Smartphone size={20} className="text-white group-hover:scale-110 transition-transform" />
                Call Driver
             </button>
           </div>

           <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,90,179,0.5)]"></div>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Out for delivery</span>
              </div>
              <button onClick={onArrived} className="text-[10px] font-black text-primary uppercase tracking-[0.1em] hover:underline underline-offset-4 transition-all">
                Simulate Arrival
              </button>
           </div>
         </motion.div>
       </div>
    </motion.main>
  );
}

function FeedbackView({ onSubmit }: { onSubmit: () => void; key?: string }) {
  const [rating, setRating] = useState(0);
  const tags = ['On-time', 'Friendly', 'Safe driving', 'Professional', 'Clean Vehicle'];

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-lg space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
             <CheckCircle2 size={16} />
             Trip Completed
          </div>
          <h2 className="font-manrope text-5xl font-black tracking-tighter text-on-surface leading-tight">How was your trip?</h2>
          <p className="text-on-surface-variant text-lg font-medium">Your feedback helps us core system precision.</p>
        </div>

        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              className="group active:scale-75 transition-transform"
            >
              <Star 
                size={48} 
                className={`${star <= rating ? 'fill-primary text-primary' : 'text-surface-container-highest'} group-hover:scale-110 transition-all`} 
              />
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map(tag => (
              <button key={tag} className="px-5 py-2.5 rounded-2xl bg-surface-container-low text-on-surface-variant font-bold text-sm border-2 border-transparent hover:border-primary/20 hover:bg-white hover:text-primary transition-all active:scale-95">
                {tag}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea 
              className="w-full bg-surface-container-low rounded-[2rem] p-8 h-48 border-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-on-surface font-medium resize-none shadow-inner" 
              placeholder="Additional comments (optional)..." 
            />
          </div>
        </div>

        <button 
          onClick={onSubmit} 
          className="w-full bg-primary text-on-primary py-6 rounded-[2.5rem] font-bold text-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          Submit Feedback
          <Send size={24} />
        </button>
      </div>
    </motion.main>
  );
}

function EditProfileView({ user, onSave, onBack }: { user: User; onSave: () => void; onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="pt-24 px-6 pb-32 max-w-2xl mx-auto space-y-10"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">Edit Profile</h1>
        <div className="w-10"></div>
      </header>

      <section className="flex flex-col items-center gap-6">
        <div className="relative group cursor-pointer inline-block">
          <img src={user.avatar} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-surface shadow-xl group-hover:brightness-75 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={32} />
          </div>
        </div>
        <p className="text-sm font-bold text-primary uppercase tracking-widest">Update Profile Picture</p>
      </section>

      <div className="space-y-6">
        {[
          { label: 'Full Name', value: user.name, icon: <UserIcon size={20} /> },
          { label: 'Email Address', value: user.email, icon: <Bell size={20} /> },
          { label: 'Phone Number', value: user.phone, icon: <Smartphone size={20} /> },
          { label: 'Company Address', value: 'Dhaka, Bangladesh', icon: <MapPin size={20} /> }
        ].map(field => (
          <div key={field.label} className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-[0.2em] ml-2">{field.label}</label>
            <div className="flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus-within:border-primary focus-within:bg-white transition-all group">
              <div className="text-outline group-focus-within:text-primary transition-colors">
                {field.icon}
              </div>
              <input defaultValue={field.value} className="bg-transparent border-none outline-none w-full font-bold text-on-surface" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-widest text-outline">Preferences</h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/5 rounded-xl text-primary"><Bell size={20} /></div>
            <span className="font-bold">Push Notifications</span>
          </div>
          <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <button onClick={onSave} className="w-full bg-primary text-on-primary py-5 rounded-[2rem] font-bold text-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all">
        Save Changes
      </button>
    </motion.main>
  );
}

function BookingHistoryView({ bookings, onBack }: { bookings: Booking[], onBack: () => void; key?: string }) {
  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="max-w-4xl mx-auto pb-32"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-blue-600" />
        </button>
        <h1 className="font-manrope font-bold text-blue-600 text-lg">Booking History</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 pt-24 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-outline ml-2">All Deliveries</h2>
          
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
                   <Box size={40} />
                </div>
                <p className="font-bold">No bookings found</p>
              </div>
            ) : (
              bookings.slice().reverse().map((b) => (
                <div key={b.id} className="p-6 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-outline">{b.date || 'Today'}</span>
                        <h3 className="font-manrope font-black text-on-surface">{b.id}</h3>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      b.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-primary/10 text-primary'
                    }`}>
                      {b.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10"></div>
                        <div className="text-sm font-bold text-on-surface truncate pr-4">{b.pickup}</div>
                      </div>
                      <div className="absolute left-[4.5px] top-3 w-px h-8 bg-outline-variant/30 hidden md:block"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-purple-600 ring-4 ring-purple-600/10"></div>
                        <div className="text-sm font-bold text-on-surface pr-4">{b.dropoff}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 bg-surface-container-low/50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Weight</p>
                        <p className="font-manrope font-black text-sm text-on-surface">{b.weight} KG</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Fare Paid</p>
                        <p className="font-manrope font-black text-xl text-primary">৳{b.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function NotificationsView({ notifications, onBack, onMarkAllRead }: { notifications: Notification[], onBack: () => void, onMarkAllRead: () => void, key?: string }) {
  const filters: Notification['type'][] = ['trip', 'payment', 'offer', 'alert'];
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  return (
    <motion.main 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="min-h-screen bg-surface"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="font-manrope font-bold text-on-surface text-lg">Notifications</h1>
        <button onClick={onMarkAllRead} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Settings size={22} className="text-outline" />
        </button>
      </header>

      <div className="pt-24 px-6 pb-32 max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeFilter === 'all' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface-variant'}`}
          >
            All
          </button>
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap capitalize transition-all ${activeFilter === f ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low text-on-surface-variant'}`}
            >
              {f}s
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline">
                <Bell size={32} />
              </div>
              <p className="text-outline font-bold">No notifications yet</p>
            </div>
          ) : (
            filtered.map(n => (
              <article 
                key={n.id}
                className={`relative overflow-hidden p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm transition-all hover:shadow-md cursor-pointer ${!n.read ? 'ring-1 ring-primary/10' : 'opacity-80'}`}
              >
                {!n.read && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                  </>
                )}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.type === 'trip' ? 'bg-primary-fixed text-on-primary-fixed' :
                    n.type === 'payment' ? 'bg-surface-container-high text-on-surface-variant' :
                    n.type === 'offer' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                    'bg-error-container text-on-error-container'
                  }`}>
                    {n.type === 'trip' ? <Truck size={24} /> :
                     n.type === 'payment' ? <Wallet size={24} /> :
                     n.type === 'offer' ? <Package size={24} /> :
                     <Info size={24} />}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-manrope font-bold text-on-surface mb-1 truncate">{n.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{n.message}</p>
                    <time className="block mt-3 text-[10px] font-bold text-outline uppercase tracking-wider">{n.timestamp}</time>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </motion.main>
  );
}
