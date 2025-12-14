import React from 'react';
import { SparklesIcon, ChartBarIcon, CpuChipIcon, BellIcon } from '@heroicons/react/24/solid';

export const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-gray-900 to-black pointer-events-none"></div>

        <div className="z-10 text-center max-w-4xl w-full">
            <div className="flex justify-center mb-6 animate-bounce">
                <div className="p-5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-purple-500/30">
                    <SparklesIcon className="w-16 h-16 text-white" />
                </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
                مرحبًا بك في نظام زوكا
                <span className="block text-xl md:text-2xl mt-2 text-purple-400 font-mono tracking-widest">ZOOKA OS v3.0</span>
            </h1>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left rtl:text-right">
                {/* System Status */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl hover:bg-gray-800 transition-colors group cursor-default">
                    <div className="flex items-center gap-3 mb-4">
                        <CpuChipIcon className="w-8 h-8 text-green-500" />
                        <h3 className="text-xl font-bold text-white">حالة النظام</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">السيرفر:</span>
                            <span className="text-green-400 font-bold animate-pulse">متصل</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الذاكرة:</span>
                            <span className="text-white">16% مستخدمة</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الذكاء:</span>
                            <span className="text-purple-400">Gemini 2.5 Flash</span>
                        </div>
                    </div>
                </div>

                 {/* Notifications */}
                 <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/30 p-6 rounded-2xl hover:bg-gray-800 transition-colors group cursor-default">
                    <div className="flex items-center gap-3 mb-4">
                        <BellIcon className="w-8 h-8 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">تنبيهات الأعمال</h3>
                    </div>
                    <div className="space-y-3">
                         <div className="bg-black/30 p-2 rounded border-l-2 border-yellow-500 text-xs text-gray-300">
                             فاتورة "برج إعمار" مستحقة اليوم.
                         </div>
                         <div className="bg-black/30 p-2 rounded border-l-2 border-blue-500 text-xs text-gray-300">
                             تم تلقي 5 طلبات توظيف جديدة.
                         </div>
                    </div>
                </div>

                 {/* Quick Insight */}
                 <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl hover:bg-gray-800 transition-colors group cursor-default">
                    <div className="flex items-center gap-3 mb-4">
                        <ChartBarIcon className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-bold text-white">نصيحة اليوم</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                        "الاستثمار في رضا العملاء هو الاستثمار الأكثر ربحية على المدى الطويل. استخدم المايسترو التسويقي لزيادة التفاعل اليوم."
                    </p>
                    <div className="mt-4 text-xs text-right text-blue-400 font-bold">- زوكا المستشار</div>
                </div>
            </div>

            <p className="text-gray-500 mt-12 text-sm animate-pulse">
                اختر تطبيقاً من القائمة الجانبية للبدء...
            </p>
        </div>
    </div>
  );
};