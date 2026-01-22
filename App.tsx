
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar, SidebarFeatures } from './Sidebar'; 
import Chatbot from './features/Chatbot';
import ImageSuite from './features/ImageSuite';
import { Feature, UserRole } from './types';
import VideoSuite from './features/VideoSuite';
import SmartEditor from './features/SmartEditor';
import MarketingMaestro from './features/MarketingMaestro';
import GeoCommander from './GeoCommander';
import Settings from './features/Settings';
import QuranSuite from './features/QuranSuite';
import FinanceManager from './features/FinanceManager';
import AppBuilder from './features/AppBuilder';
import SystemScanner from './features/SystemScanner';
import SelfPromotionProtocol from './features/SelfPromotionProtocol';
import GlobalAIHub from './features/GlobalAIHub';
import AdminDashboard from './features/AdminDashboard';
import { Bars3Icon, XMarkIcon, ShieldCheckIcon, SignalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import AgentCenter from './features/AgentCenter';
import VisionArchitect from './features/VisionArchitect';
import CloudManager from './features/CloudManager';
import GlobalConnect from './features/GlobalConnect';
import CodeFixer from './features/CodeFixer';
import LandingPage from './LandingPage';
import WisdomCenter from './features/WisdomCenter';
import CloudBillingManager from './features/CloudBillingManager';
import SovereignLaunchpad from './features/SovereignLaunchpad';

// --- ZOOKA SHIELD UI COMPONENT ---
const ZookaShieldOverlay: React.FC<{ threats: number }> = ({ threats }) => {
  return (
    <div className="fixed top-4 right-4 z-[200]">
      <div className="glass-card p-3 rounded-xl border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-white">ZOOKA SHIELD ACTIVE</span>
          {threats > 0 && (
            <div className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-300 font-mono">
              THREATS: {threats}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeFeature, setActiveFeature] = useState<Feature | null>(SidebarFeatures[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userRole: UserRole = 'owner'; // Sovereign access is now default.
  const [isBillingAlertVisible, setIsBillingAlertVisible] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  // --- SecurityMonitor Logic ---
  useEffect(() => {
    // Keydown listener to block dev tools
    const suspiciousKeys = ['F12'];
    const suspiciousCombos = [
        { ctrl: true, shift: true, key: 'I' },
        { ctrl: true, shift: true, key: 'J' },
        { ctrl: true, key: 'U' }
    ];
    const handleKeyDown = (e: KeyboardEvent) => {
        if (suspiciousKeys.includes(e.key) || 
            suspiciousCombos.some(combo => combo.ctrl === e.ctrlKey && combo.shift === e.shiftKey && combo.key.toLowerCase() === e.key.toLowerCase())) {
            e.preventDefault();
            alert('🔒 هذه الأداة غير مسموح بها في ZOOKA OS');
            setAlerts(prev => [...prev, `Blocked dev tools shortcut`]);
        }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // --- Global Threat Listener ---
  useEffect(() => {
    const handleThreat = (event: CustomEvent) => {
      const { type, details } = event.detail;
      setAlerts(prev => [...prev, `${type}: ${details}`]);
    };
    
    window.addEventListener('zooka_threat', handleThreat as EventListener);
    
    return () => {
      window.removeEventListener('zooka_threat', handleThreat as EventListener);
    };
  }, []);


  // Handle URL Deep Linking for "/افحص"
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (decodeURIComponent(path) === '/افحص') {
        const scannerFeature = SidebarFeatures.find(f => f.id === 'system-scanner');
        if (scannerFeature) {
            setActiveFeature(scannerFeature);
            setShowLanding(false);
        }
      }
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  const handleLogout = () => {
    const keysToClear = ['zooka_core_memory', 'zooka_secure_vault_v4', 'zooka_primary_key_id', 'GEMINI_API_KEY'];
    keysToClear.forEach(key => localStorage.removeItem(key));
    window.location.reload();
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
  
  const renderFeature = () => {
    if (!activeFeature) return <Chatbot />;
    switch (activeFeature.id) {
      case 'wisdom-center': return <WisdomCenter />;
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
      case 'system-scanner': return <SystemScanner />;
      case 'global-ai-hub': return <GlobalAIHub />;
      case 'agent-center': return <AgentCenter />;
      case 'vision-architect': return <VisionArchitect />;
      case 'cloud-manager': return <CloudManager />;
      case 'global-connect': return <GlobalConnect />;
      case 'code-fixer': return <CodeFixer />;
      case 'cloud-billing-manager': return <CloudBillingManager />;
      case 'sovereign-launchpad': return <SovereignLaunchpad />;
      default: return <Chatbot />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden relative" dir="rtl">
      <ZookaShieldOverlay threats={alerts.length} />
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[120] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
      
      {isMobileMenuOpen && (
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[95] lg:hidden animate-fade-in"></div>
      )}

      <aside id="mobile-sidebar" className={`
        fixed inset-y-0 right-0 z-[100] transform lg:relative lg:translate-x-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        w-72 md:w-80 h-full border-l border-white/5 bg-black
      `}>
        <Sidebar onSelectFeature={handleSelectFeature} activeFeatureId={activeFeature?.id} role={userRole} />
      </aside>

      <main id="main-scroll-container" className="flex-1 overflow-y-auto bg-black relative custom-scrollbar">
        <header className="sticky top-0 left-0 right-0 h-16 z-[90] glass-header flex justify-between items-center px-4 md:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="lg:hidden p-2.5 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-controls="mobile-sidebar"
                    aria-expanded={isMobileMenuOpen}
                    aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                >
                    {isMobileMenuOpen ? <XMarkIcon className="w-7 h-7 text-white" /> : <Bars3Icon className="w-7 h-7 text-white" />}
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
                  <div className="text-[10px] font-black text-white uppercase">إمبراطور</div>
                  <div className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">الحالة: متصل</div>
                </div>
            </div>
        </header>

        {isBillingAlertVisible && (
            <div className="relative z-50 p-4 bg-red-900/50 border-b-2 border-red-500 text-white animate-fade-in" dir="rtl">
                <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-500 animate-pulse" />
                        <div>
                            <h3 className="font-black uppercase tracking-widest">⚠️ تنبيه سيادي: مشكلة في الفوترة</h3>
                            <p className="text-xs text-gray-300">تم إغلاق حساب الدفع (Firebase Payment). خدمات الذكاء الاصطناعي والنشر معرضة للتوقف الفوري.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <a href="https://console.cloud.google.com/billing" target="_blank" className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-black transition-all">حل المشكلة الآن</a>
                        <button onClick={() => setIsBillingAlertVisible(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}

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
