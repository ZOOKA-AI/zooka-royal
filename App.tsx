
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './Sidebar'; 
import Chatbot from './features/Chatbot';
import ImageSuite from './features/ImageSuite';
import { Welcome } from './features/Welcome';
import { Feature, UserRole } from './types';
import VideoSuite from './features/VideoSuite';
import SmartEditor from './features/SmartEditor';
import MarketingMaestro from './features/MarketingMaestro';
import GeoCommander from './GeoCommander';
import Settings from './features/Settings';
import QuranSuite from './features/QuranSuite';
import FinanceManager from './features/FinanceManager';
import AppBuilder from './features/AppBuilder';
import SelfPromotionProtocol from './features/SelfPromotionProtocol';
import GlobalAIHub from './features/GlobalAIHub';
import AdminDashboard from './features/AdminDashboard';
import { LandingPage } from './LandingPage';
import { Bars3Icon, XMarkIcon, ShieldCheckIcon, SignalIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('guest'); 

  useEffect(() => {
    const savedRole = localStorage.getItem('zooka_user_role') as UserRole;
    if (savedRole && savedRole !== 'guest') setUserRole(savedRole);
  }, []);

  const handleLogin = (role: 'user' | 'owner') => {
    setUserRole(role);
    localStorage.setItem('zooka_user_role', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('zooka_user_role');
    setUserRole('guest');
    setActiveFeature(null);
    setIsMobileMenuOpen(false);
  };

  const handleSelectFeature = useCallback((feature: Feature) => {
    if (feature.id === 'logout') {
      handleLogout();
      return;
    }
    setActiveFeature(feature);
    setIsMobileMenuOpen(false);
    
    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (userRole === 'guest') return <LandingPage onLogin={handleLogin} />;

  const renderFeature = () => {
    if (!activeFeature) return <Welcome />;
    switch (activeFeature.id) {
      case 'admin-dashboard': return <AdminDashboard />;
      case 'settings': return <Settings role={userRole} />;
      case 'image-suite': return <ImageSuite />;
      case 'video-suite': return <VideoSuite />;
      case 'chatbot': return <Chatbot />;
      case 'quran-suite': return <QuranSuite />;
      case 'geo-commander': return <GeoCommander />;
      case 'marketing-maestro': return <MarketingMaestro />;
      case 'self-promotion': return <SelfPromotionProtocol />;
      case 'smart-editor': return <SmartEditor />;
      case 'finance-manager': return <FinanceManager />;
      case 'app-builder': return <AppBuilder />;
      case 'global-ai-hub': return <GlobalAIHub />;
      default: return <Welcome />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden relative" dir="rtl">
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[120] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
      
      {isMobileMenuOpen && (
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[95] lg:hidden animate-fade-in"></div>
      )}

      <aside className={`
        fixed inset-y-0 right-0 z-[100] transform lg:relative lg:translate-x-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        w-72 md:w-80 h-full border-l border-white/5 bg-black
      `}>
        <Sidebar onSelectFeature={handleSelectFeature} activeFeatureId={activeFeature?.id} role={userRole} />
      </aside>

      <main id="main-scroll-container" className="flex-1 overflow-y-auto bg-black relative custom-scrollbar">
        <header className="sticky top-0 left-0 right-0 h-16 z-[90] glass-header flex justify-between items-center px-4 md:px-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all">
                    {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <SignalIcon className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black tracking-widest uppercase italic leading-none">ZOOKA EMPIRE</span>
                      <span className="text-[8px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-1">{activeFeature?.name || 'اللوحة الرئيسية'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-black uppercase text-blue-500">SECURE ZONE</span>
                </div>
                <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
                <div className="flex flex-col text-left">
                  <div className="text-[10px] font-black text-white uppercase">{userRole === 'owner' ? 'إمبراطور' : 'عضو'}</div>
                  <div className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">الحالة: متصل</div>
                </div>
            </div>
        </header>

        <div className="relative z-10 min-h-[calc(100vh-64px)] flex flex-col">
            <div className="flex-1">
              {renderFeature()}
            </div>
            
            <footer className="p-8 mt-12 border-t border-white/5 bg-black/40 text-center">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">
                 كيان سيادي بواسطة رويال هارون © 2025
               </p>
            </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
