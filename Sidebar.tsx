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
  RocketLaunchIcon, // New Icon
} from '@heroicons/react/24/outline';
import { Feature } from '../types';

interface SidebarProps {
  onSelectFeature: (feature: Feature) => void;
  activeFeatureId?: string;
}

const features: Feature[] = [
  {
    id: 'marketing-maestro',
    name: 'المايسترو التسويقي',
    icon: <RocketLaunchIcon className="w-6 h-6 text-red-500 animate-pulse" />,
    description: 'أتمتة الحملات، السيو، والنشر الموحد.'
  },
  {
    id: 'agent-center',
    name: 'مركز الوكلاء',
    icon: <BriefcaseIcon className="w-6 h-6 text-yellow-400" />,
    description: 'أتمتة الواتساب ووكيل الشراء الذكي.'
  },
  {
    id: 'chatbot',
    name: 'المحادثة الذكية',
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    description: 'دردشة ذكية مدعومة بواسطة Gemini 3 Pro.'
  },
  {
    id: 'smart-editor',
    name: 'المحرر الذكي',
    icon: <PencilSquareIcon className="w-6 h-6" />,
    description: 'تحسين، تلخيص، وترجمة النصوص باحترافية.'
  },
  {
    id: 'app-builder',
    name: 'منشئ التطبيقات',
    icon: <CommandLineIcon className="w-6 h-6" />,
    description: 'بناء ونشر التطبيقات تلقائياً على نطاق مخصص.'
  },
  {
    id: 'image-suite',
    name: 'استوديو الصور',
    icon: <PhotoIcon className="w-6 h-6" />,
    description: 'توليد وتعديل الصور باستخدام نماذج Nano Banana.'
  },
  {
    id: 'video-suite',
    name: 'استوديو الفيديو',
    icon: <VideoCameraIcon className="w-6 h-6" />,
    description: 'إنشاء وتحريك الفيديوهات باستخدام Veo.'
  },
  {
    id: 'audio-suite',
    name: 'استوديو الصوت',
    icon: <MusicalNoteIcon className="w-6 h-6" />,
    description: 'محادثة صوتية فورية، تحويل الصوت لنص والعكس.'
  },
  {
    id: 'text-playground',
    name: 'ملعب النصوص',
    icon: <CpuChipIcon className="w-6 h-6" />,
    description: 'جرب نماذج النصوص المختلفة ووضع التفكير.'
  },
  {
    id: 'grounded-search',
    name: 'البحث الموثق',
    icon: <GlobeAltIcon className="w-6 h-6" />,
    description: 'احصل على إجابات محدثة من البحث والخرائط.'
  },
  {
    id: 'media-analyzer',
    name: 'محلل الوسائط',
    icon: <DocumentMagnifyingGlassIcon className="w-6 h-6" />,
    description: 'تحليل وفهم الصور والفيديوهات.'
  },
];

const SocialIcon = ({ path, href }: { path: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors p-1"
  >
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature, activeFeatureId }) => {
  return (
    <nav className="w-64 bg-gray-800 flex flex-col shrink-0 border-l border-gray-700 h-full">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center space-x-2 space-x-reverse pb-4 border-b border-gray-700">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-xl font-bold text-white">معرض Gemini</h1>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature.id}>
              <button
                onClick={() => onSelectFeature(feature)}
                className={`w-full flex items-center p-3 rounded-lg text-right transition-colors duration-200 ${
                  activeFeatureId === feature.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="ml-3 shrink-0">{feature.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{feature.name}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">تواصل معنا</h3>
          <div className="flex justify-center space-x-4 space-x-reverse">
              {/* Facebook */}
              <SocialIcon 
                href="#"
                path="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" 
              />
              
              {/* Twitter/X */}
              <SocialIcon 
                href="#"
                path="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" 
              />

              {/* Instagram */}
              <SocialIcon 
                href="#"
                path="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm0-2H12.24c-2.665 0-3.003.012-4.053.06-1.097.05-1.993.228-2.698.5-1.003.388-1.747.913-2.487 1.653-.74.74-1.265 1.484-1.653 2.487-.273.705-.45 1.6-.5 2.698-.048 1.05-.06 1.388-.06 4.053v.15c0 2.665.012 3.003.06 4.053.05 1.097.228 1.993.5 2.698.388 1.003.913 1.747 1.653 2.487.74.74 1.484 1.265 2.487 1.653.705.273 1.6.45 2.698.5 1.05.048 1.388.06 4.053.06h.15c2.665 0 3.003-.012 4.053-.06 1.097-.05 1.993-.228 2.698-.5 1.003-.388 1.747-.913 2.487-1.653.74-.74 1.265-1.484 1.653-2.487.273-.705.45-1.6.5-2.698.048-1.05.06-1.388.06-4.053v-.15c0-2.665-.012-3.003-.06-4.053-.05-1.097-.228-1.993-.5-2.698-.388-1.003-.913-1.747-1.653-2.487-.74-.74-1.484-1.265-2.487-1.653-.705-.273-1.6-.45-2.698-.5-1.05-.048-1.388-.06-4.053-.06h-.15zm.24 4.88c-3.893 0-7.05 3.157-7.05 7.05s3.157 7.05 7.05 7.05 7.05-3.157 7.05-7.05-3.157-7.05-7.05-7.05zm0 12.1c-2.79 0-5.05-2.26-5.05-5.05s2.26-5.05 5.05-5.05 5.05 2.26 5.05 5.05-2.26 5.05-5.05 5.05zm8.17-11.83c0 .762-.618 1.38-1.38 1.38-.762 0-1.38-.618-1.38-1.38 0-.762.618-1.38 1.38-1.38.762 0 1.38.618 1.38 1.38z" 
              />
              
              {/* LinkedIn */}
              <SocialIcon 
                href="#"
                path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
              />
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-4 opacity-70 font-mono tracking-widest text-yellow-500/50">
             © ROYAL HAROUN 2025
          </p>
      </div>
    </nav>
  );
};