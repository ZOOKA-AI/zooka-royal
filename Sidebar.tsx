
import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  GlobeAltIcon,
  CommandLineIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  CircleStackIcon,
  BoltIcon,
  MegaphoneIcon,
  RectangleGroupIcon,
  BanknotesIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import { Feature, UserRole } from './types';

interface SidebarProps {
  onSelectFeature: (feature: Feature) => void;
  activeFeatureId?: string;
  role: UserRole;
}

const SidebarFeatures: Feature[] = [
  // Site 01: Intelligence Center
  { id: 'chatbot', name: 'الوكيل التنفيذي', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-cyan-400" />, description: 'AI Logic Core', category: 'free' },
  { id: 'global-ai-hub', name: 'محور الذكاء العالمي', icon: <RectangleGroupIcon className="w-5 h-5 text-purple-500" />, description: 'All AI Tools Worldwide', category: 'free' },
  { id: 'smart-editor', name: 'المحرر الاستراتيجي', icon: <PencilSquareIcon className="w-5 h-5 text-blue-400" />, description: 'Logic Optimization', category: 'free' },

  // Site 02: Production Studios
  { id: 'image-suite', name: 'استوديو الصور السيادي', icon: <PhotoIcon className="w-5 h-5 text-pink-500" />, description: 'Generative Arts', category: 'enterprise' },
  { id: 'video-suite', name: 'محرك Veo السينمائي', icon: <VideoCameraIcon className="w-5 h-5 text-red-500" />, description: 'Cinema Production', category: 'enterprise' },
  
  // Site 03: Dominance
  { id: 'marketing-maestro', name: 'المايسترو التسويقي', icon: <RocketLaunchIcon className="w-5 h-5 text-orange-500" />, description: 'SEO Automation', category: 'enterprise' },
  { id: 'geo-commander', name: 'القائد الجغرافي', icon: <GlobeAltIcon className="w-5 h-5 text-blue-500" />, description: '3D Fleet Mastery', category: 'enterprise' },
  { id: 'finance-manager', name: 'المدير المالي', icon: <BanknotesIcon className="w-5 h-5 text-emerald-500" />, description: 'OCR Finance', category: 'enterprise' },

  // Site 04: Engineering
  { id: 'app-builder', name: 'المهندس المعماري', icon: <CommandLineIcon className="w-5 h-5 text-blue-600" />, description: 'Software Build', category: 'enterprise' },
  { id: 'self-promotion', name: 'بروتوكول النشر الذاتي', icon: <MegaphoneIcon className="w-5 h-5 text-yellow-500 animate-pulse" />, description: 'Growth Automation', category: 'enterprise' },

  // Admin
  { id: 'admin-dashboard', name: 'غرفة التحكم (Admin)', icon: <ShieldCheckIcon className="w-5 h-5 text-red-600" />, description: 'Command & Control', category: 'system' },
  { id: 'settings', name: 'الخزنة السيادية', icon: <CircleStackIcon className="w-5 h-5 text-gray-500" />, description: 'Encryption Keys', category: 'system' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature, activeFeatureId, role }) => {
  const isAdmin = role === 'owner';

  const socialLinks = [
      { name: 'Facebook', url: 'https://www.facebook.com/share/1D2Dppyjux/', icon: <ChatBubbleLeftRightIcon className="w-4 h-4"/> },
      { name: 'Website', url: 'https://royalcleanuae.com', icon: <GlobeAltIcon className="w-4 h-4"/> },
      { name: 'WhatsApp', url: 'https://wa.me/971563177803', icon: <SignalIcon className="w-4 h-4"/> }
  ];

  const renderGroup = (title: string, category: string, filterIds?: string[]) => {
    let filtered = SidebarFeatures.filter(f => f.category === category);
    if (filterIds) filtered = filtered.filter(f => filterIds.includes(f.id));
    
    // Hide enterprise/system tools for normal users
    if (!isAdmin && category !== 'free') return null;
    if (filtered.length === 0) return null;
    
    return (
      <div className="mb-10">
        <h3 className="px-6 text-[9px] font-black text-gray-600 uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> {title}
        </h3>
        <div className="space-y-1">
          {filtered.map((feature) => (
            <button key={feature.id} onClick={() => onSelectFeature(feature)} className={`w-full flex items-center p-4 rounded-3xl text-right transition-all duration-300 group relative ${activeFeatureId === feature.id ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              <div className="ml-4 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6">{feature.icon}</div>
              <div className="flex-1 truncate">
                <p className="font-black text-[11px] tracking-tight">{feature.name}</p>
                <p className="text-[7px] font-bold opacity-40 mt-0.5 truncate uppercase tracking-widest">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="w-full bg-[#050505] flex flex-col h-full border-l border-gray-900 font-sans" dir="rtl">
      <div className="p-10 border-b border-gray-900 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-2xl animate-pulse">
             <BoltIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">ZOOKA OS</h1>
            <p className="text-[8px] text-blue-500 font-black tracking-[0.4em] uppercase italic">Royal Haroun Empire</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-6">
          {renderGroup("محور الذكاء", "free")}
          {renderGroup("الإنتاج السينمائي", "enterprise", ['image-suite', 'video-suite'])}
          {renderGroup("السيادة التجارية", "enterprise", ['marketing-maestro', 'finance-manager', 'geo-commander'])}
          {renderGroup("البناء الهندسي", "enterprise", ['app-builder', 'self-promotion'])}
          {renderGroup("النظام السيادي", "system")}
          
          <div className="mt-8 border-t border-gray-900 pt-6 px-4 space-y-4">
             <div className="flex justify-center gap-4 bg-gray-900/50 p-4 rounded-3xl">
                {socialLinks.map((s,i) => (
                    <a key={i} href={s.url} target="_blank" className="text-gray-500 hover:text-blue-500 transition-colors p-2 bg-black rounded-xl border border-gray-800" title={s.name}>{s.icon}</a>
                ))}
             </div>
             <button onClick={() => onSelectFeature({id: 'logout', name: 'خروج', icon: null, description: '', category: 'hidden'})} className="w-full flex items-center p-5 rounded-3xl text-gray-600 hover:bg-red-900/20 hover:text-red-500 transition-all group border border-transparent hover:border-red-900/30">
                <ArrowLeftOnRectangleIcon className="w-5 h-5 ml-4" />
                <span className="font-black text-[12px] uppercase tracking-widest">إنهاء الجلسة</span>
              </button>
          </div>
      </div>

      <div className="p-8 border-t border-gray-900 bg-black text-center relative overflow-hidden">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] relative z-10">Managed by Royal Haroun</p>
            <p className="text-[7px] text-gray-800 font-black uppercase mt-2 tracking-[0.5em] relative z-10 italic">Secure Zone Infinity</p>
      </div>
    </nav>
  );
};
