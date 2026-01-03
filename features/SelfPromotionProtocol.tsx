
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  RocketLaunchIcon, 
  GlobeAltIcon, 
  LinkIcon, 
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  CommandLineIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/solid';

export const SelfPromotionProtocol: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [directives, setDirectives] = useState<any>(null);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const generateKit = async () => {
        setLoading(true);
        setDeployedUrl(null);
        setLogs([]);
        addLog("بدء استدعاء محرك النمو السيادي...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `أنت مدير النمو في ZOOKA OS. قم بإنشاء خطة تسويقية وكود HTML لـ "صفحة هبوط" تروج لخدمات رويال كلين (Royal Clean). المطلوب: JSON { "plan": [], "keywords": [], "html": "" }`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const data = JSON.parse(response.text || '{}');
            setDirectives(data);
            addLog("تم توليد البنية التحتية للحملة بنجاح.");
        } catch (e) { 
            addLog("خطأ في النواة.");
            console.error(e); 
        } finally { 
          setLoading(false); 
        }
    };

    const handlePublish = async () => {
        if(!directives) return;
        setPublishing(true);
        addLog("بدء بروتوكول الانتشار العالمي...");
        await new Promise(r => setTimeout(r, 2000));
        addLog("تم البث الحي!");
        setDeployedUrl(`https://royalclean-live.zooka/p/${Math.random().toString(36).substring(7)}`);
        setPublishing(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 pb-32 font-sans" dir="rtl">
            <header className="relative bg-gradient-to-br from-red-950/60 to-black p-12 md:p-20 rounded-[4rem] border border-gray-800 overflow-hidden shadow-2xl text-center">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 <div className="relative z-10 space-y-6">
                    <div className="bg-red-600/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                        <RocketLaunchIcon className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter">بروتوكول <span className="text-red-600">الانتشار</span></h1>
                    <button onClick={generateKit} disabled={loading} className="mt-10 px-16 py-6 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 mx-auto">
                        {loading ? <LoadingSpinner /> : <><SparklesIcon className="w-8 h-8"/> إنشاء خطة السيطرة</>}
                    </button>
                 </div>
            </header>

            {directives && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-black/80 p-8 rounded-[3rem] border border-gray-800 space-y-4 h-[300px] flex flex-col font-mono shadow-inner">
                            <h3 className="text-xs font-black text-blue-500 flex items-center gap-3 uppercase tracking-widest border-b border-gray-800 pb-2"><CommandLineIcon className="w-4 h-4"/> سجل الانتشار</h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar text-[10px] space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-green-500 opacity-80">{log}</div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 bg-gray-900 border border-gray-800 rounded-[4rem] p-10 flex flex-col items-center justify-center">
                        {deployedUrl ? (
                          <div className="text-center">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold">تم النشر!</h3>
                            <p className="text-blue-400 font-mono mt-2">{deployedUrl}</p>
                          </div>
                        ) : (
                          <button onClick={handlePublish} disabled={publishing} className="bg-green-600 px-10 py-4 rounded-2xl font-bold">
                            {publishing ? <LoadingSpinner/> : 'نشر الحملة'}
                          </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelfPromotionProtocol;
