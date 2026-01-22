
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  GlobeAltIcon, 
  BoltIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../components/LoadingSpinner';

const GeoCommander: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [prompt, setPrompt] = useState('حلل أفضل مسارات الخدمات اللوجستية في الإمارات بناءً على أحدث بيانات الخرائط.');
  const mapRef = useRef<HTMLDivElement>(null);

  // Lazy load the background map image when the dashboard is visible
  useEffect(() => {
    if (view !== 'dashboard' || !mapRef.current) return;

    const element = mapRef.current;
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                const mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.2708,25.2048,13,0,60/1200x800?access_token=pk.eyJ1IjoiZGVtb3MiLCJhIjoiY2w4Z3I1Znl5MDIzZTNubzFlYm50c252bCJ9.Kk8c0f7-1tGk7e8Xy3v4XA';
                element.style.backgroundImage = `url('${mapUrl}')`;
                observer.unobserve(element);
            }
        },
        { rootMargin: '0px 0px 200px 0px' } // Start loading when 200px away from viewport
    );

    observer.observe(element);

    return () => {
        if (element) {
            observer.unobserve(element);
        }
    };
  }, [view]);

  const runFleetAnalysis = async () => {
      if (!prompt.trim()) return;
      setLoading(true);
      setAiReport('');

      try {
          const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
          if (!apiKey) {
            setAiReport("فشل الاتصال: مفتاح API مفقود.");
            setLoading(false);
            return;
          }
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: { latitude: 25.2048, longitude: 55.2708 } // Dubai coordinates
                    }
                }
              }
          });

          setAiReport(response.text || 'لم يتم استلام أي بيانات.');
      } catch (e) {
          console.error(e);
          setAiReport("فشل الاتصال بنواة الخرائط السيادية. يرجى التحقق من مفتاح الـ API.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden" dir="rtl">
        {view === 'landing' ? (
            <div className="relative h-screen flex flex-col items-center justify-center p-6 text-center">
                <GlobeAltIcon className="w-32 h-32 text-blue-500 mb-8 animate-spin-slow" />
                <h1 className="text-6xl font-black mb-6 tracking-tighter italic">ZOOKA TRACK <span className="text-blue-600">X</span></h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-12 font-bold leading-relaxed">نظام التتبع العالمي للأساطيل والمؤسسات السيادية.</p>
                <button onClick={() => setView('dashboard')} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 rounded-3xl font-black text-xl shadow-2xl transition-all">دخول كونسول السيطرة</button>
            </div>
        ) : (
            <div className="h-screen flex flex-col">
                <div className="bg-gray-900 border-b border-gray-800 p-5 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl"><GlobeAltIcon className="w-6 h-6" /></div>
                        <h2 className="font-black text-xl">لوحة السيطرة الجغرافية</h2>
                    </div>
                    <button onClick={() => setView('landing')} className="text-gray-500 hover:text-white font-bold transition-colors">خروج</button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col p-6 shadow-2xl">
                        <div className="space-y-4 mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">الأمر الاستخباراتي</label>
                            <textarea 
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full h-32 p-3 bg-black/40 border border-gray-700 rounded-xl text-sm text-gray-200 resize-none outline-none focus:border-blue-500 transition-colors"
                                placeholder="اكتب استعلامك الجغرافي هنا..."
                            />
                        </div>
                        <button 
                            onClick={runFleetAnalysis}
                            disabled={loading || !prompt.trim()}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm flex items-center justify-center gap-3 mb-6 disabled:opacity-50"
                        >
                            {loading ? <LoadingSpinner /> : <BoltIcon className="w-5 h-5"/>}
                            بدء التحليل الجغرافي
                        </button>
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">التقرير</label>
                            {aiReport && <div className="p-5 bg-black/40 border border-gray-800 rounded-2xl text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">{aiReport}</div>}
                             {!aiReport && !loading && <div className="p-5 text-center text-gray-600 text-xs">بانتظار الأوامر...</div>}
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-800 relative">
                        <div
                            ref={mapRef}
                            className="absolute inset-0 bg-cover bg-center opacity-70"
                        ></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default GeoCommander;
