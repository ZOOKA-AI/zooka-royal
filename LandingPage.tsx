
import React, { useState } from 'react';
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon, 
  VideoCameraIcon, 
  CommandLineIcon, 
  GlobeAltIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ArrowDownCircleIcon,
  MegaphoneIcon,
  SparklesIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';
import { Auth } from './Auth';

interface LandingPageProps {
  onLogin: (role: 'user' | 'owner') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  const officialLinks = [
    { name: 'موقع رويال كلين', url: 'https://royalcleanuae.com', icon: <GlobeAltIcon className="w-8 h-8 text-blue-500"/>, desc: 'المقر الرقمي الرسمي' },
    { name: 'فيسبوك الإمبراطورية', url: 'https://www.facebook.com/share/1D2Dppyjux/', icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600"/>, desc: 'منصة التواصل الاجتماعي' },
    { name: 'واتساب السيادة', url: 'https://wa.me/971563177803', icon: <BoltIcon className="w-8 h-8 text-green-500"/>, desc: 'الدعم الفني الفوري' },
  ];

  if (showLogin) return <Auth onLogin={onLogin} />;

  return (
    <div className="bg-[#020202] text-white font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* 🚀 Dynamic Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08),_transparent_70%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-blob"></div>
        
        <div className="relative z-10 text-center space-y-10 max-w-6xl animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-8 py-3 rounded-full">
            <CpuChipIcon className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">Zooka OS Infinity V8.2 Deployment</span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none italic uppercase">
            ZOOKA <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-white to-gray-600">INFINITY</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-400 font-bold max-w-4xl mx-auto leading-relaxed">
            المنصة السيادية التي تدمج قوة الذكاء الاصطناعي مع الواقع الصناعي. 
            أتمتة كاملة لشركات النظافة، المصانع، والمؤسسات الكبرى بقيادة <span className="text-white">رويال هارون</span>.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center pt-10">
            <button onClick={() => setShowLogin(true)} className="px-16 py-6 bg-blue-600 hover:bg-blue-500 rounded-3xl font-black text-2xl shadow-2xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
               دخول كونسول السيطرة <RocketLaunchIcon className="w-6 h-6"/>
            </button>
            <button onClick={() => window.open('https://royalcleanuae.com', '_blank')} className="px-16 py-6 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-3xl font-black text-2xl transition-all">موقعنا الرسمي</button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ArrowDownCircleIcon className="w-10 h-10 text-gray-800" />
        </div>
      </section>

      {/* 🔗 Social & Entity Links Section (The missing icons) */}
      <section className="py-24 px-4 bg-gray-900/20 relative border-y border-gray-800">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">روابط <span className="text-blue-600">السيادة</span> الرقمية</h2>
                <p className="text-gray-500 font-bold">تواصل مع الكيان الرسمي عبر القنوات المؤمنة</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {officialLinks.map((link, i) => (
                      <div 
                        key={i} 
                        onClick={() => window.open(link.url, '_blank')}
                        className="bg-black/40 border border-gray-800 p-8 rounded-[3rem] hover:border-blue-600 transition-all cursor-pointer group shadow-xl"
                      >
                          <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">{link.icon}</div>
                          <h3 className="text-2xl font-black text-white mb-2">{link.name}</h3>
                          <p className="text-sm text-gray-500 font-bold mb-6">{link.desc}</p>
                          <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest">
                              زيارة الآن <ArrowTopRightOnSquareIcon className="w-4 h-4"/>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 🛡️ Royal Footer */}
      <footer className="py-20 border-t border-gray-900 text-center bg-black relative">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <p className="text-[14px] font-black text-gray-700 uppercase tracking-[0.8em] mb-6">
            Sovereign Infrastructure Designed by Royal Haroun © 2025
          </p>
          <div className="flex justify-center gap-8 mb-10">
              <a href="https://www.facebook.com/share/1D2Dppyjux/" target="_blank" className="text-gray-600 hover:text-blue-500 transition-colors"><ChatBubbleLeftRightIcon className="w-8 h-8"/></a>
              <a href="https://royalcleanuae.com" target="_blank" className="text-gray-600 hover:text-blue-500 transition-colors"><GlobeAltIcon className="w-8 h-8"/></a>
              <a href="https://wa.me/971563177803" target="_blank" className="text-gray-600 hover:text-green-500 transition-colors"><BoltIcon className="w-8 h-8"/></a>
          </div>
          <p className="text-[12px] text-gray-800 font-bold uppercase tracking-widest leading-loose max-w-4xl mx-auto">
            نظام ZOOKA OS هو ملكية فكرية وتقنية مسجلة. كافة الحقوق محفوظة لـ رويال هارون.
          </p>
        </div>
      </footer>
    </div>
  );
};
