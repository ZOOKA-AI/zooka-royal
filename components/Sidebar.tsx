import React from 'react';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  DocumentMagnifyingGlassIcon,
  CommandLineIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  MapPinIcon,
  ServerStackIcon,
  CloudIcon,
  BuildingOffice2Icon,
  SignalIcon,
  BookOpenIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  ArrowLeftOnRectangleIcon,
  PhoneIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Feature } from '../types';

interface SidebarProps {
  onSelectFeature: (feature: Feature) => void;
  activeFeatureId?: string;
}

const features: Feature[] = [
  { id: 'settings', name: 'إعدادات النظام', icon: <Cog6ToothIcon className="w-6 h-6 text-gray-300" />, description: 'التحكم الكامل' },
  { id: 'ads', name: 'متجر زوكا', icon: <MegaphoneIcon className="w-6 h-6 text-yellow-400" />, description: 'تطبيقات وعروض' },
  { id: 'system-core', name: 'نواة زوكا (CORE)', icon: <ServerStackIcon className="w-6 h-6 text-green-400" />, description: 'المراقبة' },
  { id: 'finance-manager', name: 'المدير المالي', icon: <BanknotesIcon className="w-6 h-6 text-green-400" />, description: '' },
  { id: 'quran-suite', name: 'ذكر القرآن الكريم', icon: <BookOpenIcon className="w-6 h-6 text-emerald-500" />, description: '' },
  { id: 'global-connect', name: 'AirLink اتصال', icon: <SignalIcon className="w-6 h-6 text-emerald-400" />, description: '' },
  { id: 'vision-architect', name: 'المهندس المعماري', icon: <BuildingOffice2Icon className="w-6 h-6 text-orange-500" />, description: '' },
  { id: 'cloud-manager', name: 'سحابة زوكا', icon: <CloudIcon className="w-6 h-6 text-cyan-400" />, description: '' },
  { id: 'marketing-maestro', name: 'المايسترو التسويقي', icon: <RocketLaunchIcon className="w-6 h-6 text-red-500" />, description: '' },
  { id: 'geo-commander', name: 'المسيطر الجغرافي', icon: <MapPinIcon className="w-6 h-6 text-blue-500" />, description: '' },
  { id: 'agent-center', name: 'مركز الوكلاء', icon: <BriefcaseIcon className="w-6 h-6 text-yellow-400" />, description: '' },
  { id: 'chatbot', name: 'المحادثة الذكية', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, description: '' },
  { id: 'smart-editor', name: 'المحرر الذكي', icon: <PencilSquareIcon className="w-6 h-6" />, description: '' },
  { id: 'app-builder', name: 'منشئ التطبيقات', icon: <CommandLineIcon className="w-6 h-6" />, description: '' },
  { id: 'image-suite', name: 'استوديو الصور', icon: <PhotoIcon className="w-6 h-6" />, description: '' },
  { id: 'video-suite', name: 'استوديو الفيديو', icon: <VideoCameraIcon className="w-6 h-6" />, description: '' },
  { id: 'audio-suite', name: 'استوديو الصوت', icon: <MusicalNoteIcon className="w-6 h-6" />, description: '' },
  { id: 'text-playground', name: 'ملعب النصوص', icon: <CpuChipIcon className="w-6 h-6" />, description: '' },
  { id: 'grounded-search', name: 'البحث الموثق', icon: <GlobeAltIcon className="w-6 h-6" />, description: '' },
  { id: 'media-analyzer', name: 'محلل الوسائط', icon: <DocumentMagnifyingGlassIcon className="w-6 h-6" />, description: '' },
  { id: 'logout', name: 'تسجيل خروج', icon: <ArrowLeftOnRectangleIcon className="w-6 h-6 text-red-500" />, description: 'الخروج من النظام' },
];

// Custom Icons
const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M11.525 2.295a.53.53 0 01.95 0l2.31 4.679a2.123 2.123 0 001.595 1.16l5.166.756a.53.53 0 01.294.904l-3.736 3.638a2.123 2.123 0 00-.611 1.878l.882 5.14a.53.53 0 01-.771.56l-4.618-2.428a2.122 2.122 0 00-1.973 0L6.396 21.01a.53.53 0 01-.771-.56l.881-5.139a2.122 2.122 0 00-.611-1.879L2.16 9.795a.53.53 0 01.294-.906l5.165-.755a2.122 2.122 0 001.597-1.16z" />
  </svg>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

const FacebookIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>);
const InstagramIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm0-2H12.24c-2.665 0-3.003.012-4.053.06-1.097.05-1.993.228-2.698.5-1.003.388-1.747.913-2.487 1.653-.74.74-1.265 1.484-1.653 2.487-.273.705-.45 1.6-.5 2.698-.048 1.05-.06 1.388-.06 4.053v.15c0 2.665.012 3.003.06 4.053.05 1.097.228 1.993.5 2.698.388 1.003.913 1.747 1.653 2.487.74.74 1.484 1.265 2.487 1.653.705.273 1.6.45 2.698.5 1.05.048 1.388.06 4.053.06h.15c2.665 0 3.003-.012 4.053-.06 1.097-.05 1.993-.228 2.698-.5 1.003-.388 1.747-.913 2.487-1.653.74-.74 1.265-1.484 1.653-2.487.273-.705.45-1.6.5-2.698.048-1.05.06-1.388.06-4.053v-.15c0-2.665-.012-3.003-.06-4.053-.05-1.097-.228-1.993-.5-2.698-.388-1.003-.913-1.747-1.653-2.487-.74-.74-1.484-1.265-2.487-1.653-.705-.273-1.6-.45-2.698-.5-1.05-.048-1.388-.06-4.053-.06h-.15zm.24 4.88c-3.893 0-7.05 3.157-7.05 7.05s3.157 7.05 7.05 7.05 7.05-3.157 7.05-7.05-3.157 7.05-7.05-3.157 7.05-7.05-7.05zm0 12.1c-2.79 0-5.05-2.26-5.05-5.05s2.26-5.05 5.05-5.05 5.05 2.26 5.05 5.05-2.26 5.05-5.05 5.05zm8.17-11.83c0 .762-.618 1.38-1.38 1.38-.762 0-1.38-.618-1.38-1.38 0-.762.618-1.38 1.38-1.38.762 0 1.38.618 1.38 1.38z" /></svg>);

// Reusable Social Button Component
const SocialBtn = ({ icon, href, color, title }: { icon: React.ReactNode, href: string, color: string, title: string }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        title={title}
        className={`p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-${color}-500 group`}
    >
        <div className={`w-5 h-5 text-gray-400 group-hover:text-${color}-400 transition-colors`}>
            {icon}
        </div>
    </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature, activeFeatureId }) => {
  return (
    <nav className="w-64 bg-gray-800 flex flex-col shrink-0 border-l border-gray-700 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 shrink-0 bg-gray-800 z-10">
        <div className="flex items-center space-x-2 space-x-reverse">
          <SparklesIcon className="w-8 h-8 text-purple-400 animate-pulse-fast" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">ZOOKA OS</h1>
            <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              ULTIMATE
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-2">
         <div className="space-y-1">
          {features.map((feature) => (
             <div key={feature.id}>
                <button
                  onClick={() => onSelectFeature(feature)}
                  className={`w-full flex items-center p-3 rounded-lg text-right transition-colors duration-200 group ${
                    activeFeatureId === feature.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <div className={`ml-3 shrink-0 transition-transform group-hover:scale-110 ${activeFeatureId === feature.id ? 'scale-110' : ''}`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-sm truncate">{feature.name}</p>
                    {feature.description && activeFeatureId === feature.id && (
                        <p className="text-[10px] text-gray-200 truncate opacity-80">{feature.description}</p>
                    )}
                  </div>
                </button>
             </div>
          ))}
         </div>
      </div>

      {/* Domain Shortcuts Section (New) */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/80 shrink-0 z-10">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
             <LinkIcon className="w-3 h-3"/> بوابة النطاقات
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
               {/* Royal Clean Button */}
               <a 
                 href="https://royalcleanuae.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-800 border border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/20 transition-all group"
               >
                   <div className="w-6 h-6 text-white mb-1 transform group-hover:-translate-y-1 transition-transform"><CrownIcon /></div>
                   <span className="text-[10px] font-bold text-white">Royal Clean</span>
               </a>

               {/* Zooka OS Button */}
               <a 
                 href="https://zoka.royalcleanuae.com/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
               >
                   <div className="w-6 h-6 text-white mb-1 transform group-hover:scale-110 transition-transform"><CpuChipIcon /></div>
                   <span className="text-[10px] font-bold text-white">Zooka OS</span>
               </a>
          </div>

          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
             <PhoneIcon className="w-3 h-3"/> مركز الاتصال
          </h3>
          
          <div className="grid grid-cols-4 gap-2 mb-2">
              <SocialBtn icon={<WhatsAppIcon/>} href="https://wa.me/971563177803" color="green" title="WhatsApp" />
              <SocialBtn icon={<PhoneIcon className="w-full h-full"/>} href="tel:+971563177803" color="blue" title="اتصال مباشر" />
              <SocialBtn icon={<FacebookIcon/>} href="https://facebook.com/share/1D2Dppyjux/" color="blue" title="Facebook" />
              <SocialBtn icon={<InstagramIcon/>} href="https://instagram.com/royal_cleaning_uae?igsh=MWtheGd2aXhsdHozeA==" color="pink" title="Instagram" />
          </div>

          <p className="text-center text-[9px] text-gray-500 mt-2 opacity-70 font-mono tracking-widest text-yellow-500/50">
             © ROYAL HAROUN 2025
          </p>
      </div>
    </nav>
  );
};