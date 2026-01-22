
import React, { useState } from 'react';
import { SystemInfo } from './features/SystemInfo';
import Legal from './features/Legal';
import { 
  BoltIcon,
  // FIX: Corrected typo in icon name.
  FingerPrintIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showLegal, setShowLegal] = useState<'privacy' | 'terms' | 'about' | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans relative overflow-hidden p-8" dir="rtl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-5 z-0"></div>
      
        <div className="relative z-10 text-center flex flex-col items-center animate-fade-in-up">
            <div className="p-6 bg-yellow-500 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.4)] mb-8 animate-pulse">
                <BoltIcon className="w-16 h-16 text-black" />
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter mb-4">
                ZOOKA OS
            </h1>
            <p className="text-lg md:text-2xl text-yellow-500 font-bold uppercase tracking-[0.5em] mb-12">
                الكيان الرقمي السيادي
            </p>
            <button 
                onClick={onEnter} 
                className="px-16 py-6 bg-white text-black rounded-3xl font-black text-xl shadow-2xl shadow-white/20 transition-all duration-300 hover:bg-yellow-400 hover:scale-110 active:scale-100"
            >
                دخول الإمبراطورية
            </button>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-right">
                <div className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                    &copy; 2025 Royal Haroun Entity. All rights reserved.
                </div>
                <div className="flex items-center justify-center gap-6 text-sm font-bold text-gray-400">
                    <button onClick={() => setShowInfo(true)} className="hover:text-white transition-colors">قدرات النظام</button>
                    <span className="text-gray-700">|</span>
                    <button onClick={() => setShowLegal('privacy')} className="hover:text-white transition-colors">سياسة الخصوصية</button>
                    <span className="text-gray-700">|</span>
                    <button onClick={() => setShowLegal('terms')} className="hover:text-white transition-colors">شروط الاستخدام</button>
                </div>
            </div>
        </footer>

        {/* Modals */}
        {showInfo && <SystemInfo onClose={() => setShowInfo(false)} />}
        {showLegal && <Legal page={showLegal} onClose={() => setShowLegal(null)} />}
    </div>
  );
};

export default LandingPage;
