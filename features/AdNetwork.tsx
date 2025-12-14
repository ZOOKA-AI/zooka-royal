import React from 'react';
import { 
  RocketLaunchIcon, 
  ArrowDownTrayIcon, 
  StarIcon,
  MegaphoneIcon
} from '@heroicons/react/24/solid';

const AdNetwork: React.FC = () => {
  // Mock Data (In a real app, this would come from a backend populated by the Admin)
  const apps = [
    { id: 1, name: "Zooka Cleaner", desc: "أفضل تطبيق لتنظيف الهاتف.", rating: 4.8, downloads: "1M+", icon: "🚀", type: "app" },
    { id: 2, name: "Royal VPN", desc: "تصفح آمن وسريع.", rating: 4.9, downloads: "500K+", icon: "🛡️", type: "app" },
    { id: 3, name: "عرض خاص!", desc: "خصم 50% على اشتراكات البريميوم لفترة محدودة.", type: "ad", image: "https://via.placeholder.com/600x200/22c55e/ffffff?text=SALE+50%" }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 neon-text">متجر وتحديثات زوكا</h1>
        <p className="text-gray-400">تطبيقات مفيدة وعروض حصرية لمجتمعنا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((item) => (
          item.type === 'app' ? (
            <div key={item.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105 shadow-xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl bg-gray-900 rounded-xl p-3 shadow-inner">{item.icon}</div>
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-full text-xs">
                  <span>{item.rating}</span>
                  <StarIcon className="w-3 h-3" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{item.desc}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">{item.downloads} تحميل</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/30">
                  <ArrowDownTrayIcon className="w-4 h-4" /> تحميل
                </button>
              </div>
            </div>
          ) : (
            <div key={item.id} className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-1 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                    <MegaphoneIcon className="w-3 h-3"/> إعلان مميز
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 h-full flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 text-center md:text-right">
                        <h3 className="text-2xl font-bold text-white mb-2">{item.desc}</h3>
                        <p className="text-green-300 text-sm mb-4">حصرياً لمستخدمي نظام زوكا.</p>
                        <button className="bg-white text-green-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            استفد من العرض
                        </button>
                    </div>
                </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AdNetwork;