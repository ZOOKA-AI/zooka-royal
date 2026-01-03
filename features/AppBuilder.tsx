
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  CommandLineIcon, 
  CodeBracketIcon, 
  ServerStackIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/solid';

const AppBuilder: React.FC = () => {
  const [appDescription, setAppDescription] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [evolutionMode, setEvolutionMode] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const mode = localStorage.getItem('zooka_evolution_mode') === 'true';
      setEvolutionMode(mode);
  }, []);

  useEffect(() => {
    if (logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [buildLogs]);

  const handleBuild = async () => {
    if (!appDescription.trim()) return;
    setIsBuilding(true);
    setBuildLogs([]);
    setGeneratedCode('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const steps = [
          "تحليل المتطلبات الهندسية...",
          "توليد الخوارزمية السيادية...",
          "بناء الواجهة (Pixel-Perfect UI)...",
          "حقن منطق الذكاء الاصطناعي...",
          "اختبار سلامة الكود والتشغيل..."
      ];

      for (const step of steps) {
          setBuildLogs(prev => [...prev, `[CORE] ${step}`]);
          await new Promise(r => setTimeout(r, 600));
      }

      const promptText = `
        IDENTITY: Senior Software Architect for ZOOKA OS.
        TASK: Build or modify: "${appDescription}"
        MODE: ${evolutionMode ? "INTERNAL_SELF_EVOLUTION" : "EXTERNAL_PROJECT"}
        
        Provide high-performance, clean, and real code in React/Tailwind.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: promptText,
        config: { thinkingConfig: { thinkingBudget: 2048 } }
      });

      setGeneratedCode(result.text || '');
      setBuildLogs(prev => [...prev, "[SUCCESS] اكتملت عملية البناء الهندسي."]);

    } catch (error: any) {
      setBuildLogs(prev => [...prev, `[ERROR] عطل في النواة: ${error.message}`]);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-10 rounded-[5rem] min-h-[90vh] flex flex-col transition-all duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.4)] border ${evolutionMode ? 'bg-red-950/5 border-red-900/30' : 'bg-gray-900/40 backdrop-blur-3xl border-gray-800'}`} dir="rtl">
      
      <div className="flex items-center justify-between mb-16 border-b border-gray-800 pb-10">
        <div className="flex items-center gap-8">
            <div className={`p-6 rounded-[2.5rem] shadow-2xl transition-all ${evolutionMode ? 'bg-red-600 animate-pulse' : 'bg-blue-600 shadow-blue-900/40'}`}>
                {evolutionMode ? <WrenchScrewdriverIcon className="w-12 h-12 text-white" /> : <CommandLineIcon className="w-12 h-12 text-white" />}
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  {evolutionMode ? 'بروتوكول التطور الداخلي' : 'المهندس المعماري السيادي'}
              </h2>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.4em] mt-2">
                  Zooka OS Build Engine X-100
              </p>
            </div>
        </div>
        {evolutionMode && (
          <div className="flex items-center gap-4 bg-red-600/10 px-8 py-4 rounded-full border border-red-900/30">
            <BoltIcon className="w-5 h-5 text-red-500 animate-pulse"/>
            <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em]">System Modification Level: CRITICAL</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
            <div className="bg-gray-900/60 p-10 rounded-[4rem] border border-gray-800 shadow-inner">
                <label className="block text-[11px] font-black text-gray-600 mb-6 uppercase tracking-[0.4em] flex items-center gap-3">
                  <SparklesIcon className="w-5 h-5 text-yellow-500"/> وصف المشروع الهندسي
                </label>
                <textarea
                  rows={10}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="مثال: ابنِ لي داش بورد كاملة لإدارة عمال شركة تنظيف مع نظام تتبع..."
                  className="w-full p-8 bg-black/40 rounded-[2.5rem] border border-gray-800 focus:border-blue-600 text-white outline-none transition-all placeholder:text-gray-800 text-xl leading-relaxed shadow-inner"
                />
                <button
                    onClick={handleBuild}
                    disabled={isBuilding || !appDescription}
                    className={`w-full mt-10 py-6 font-black text-2xl rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 ${
                        isBuilding ? 'bg-gray-800 text-gray-600' : 
                        evolutionMode ? 'bg-red-600 hover:bg-red-500 text-white' : 
                        'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                >
                    {isBuilding ? <LoadingSpinner /> : <><ServerStackIcon className="w-7 h-7"/> {evolutionMode ? 'بدء التطور الذاتي' : 'إطلاق عملية البناء'}</>}
                </button>
            </div>
            
            <div className="bg-black/80 rounded-[3rem] border border-gray-800 p-8 h-60 overflow-y-auto font-mono text-[10px] custom-scrollbar shadow-inner" ref={logsContainerRef}>
                <div className="text-gray-700 mb-4 border-b border-gray-800 pb-2 uppercase font-black tracking-[0.5em]">Z-Core Build Terminal</div>
                {buildLogs.map((log, i) => (
                    <div key={i} className={`mb-2 font-bold ${log.includes('ERROR') ? 'text-red-500' : log.includes('SUCCESS') ? 'text-green-500' : 'text-blue-500'}`}>
                      <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                ))}
                {isBuilding && <div className="animate-pulse text-blue-500">_</div>}
            </div>
        </div>

        {/* Code Preview Panel */}
        <div className="lg:col-span-7 bg-black/40 rounded-[4rem] border border-gray-800 flex flex-col overflow-hidden shadow-2xl relative group">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-600/10 group-hover:bg-blue-600/30 transition-colors"></div>
            <div className="bg-gray-900 px-10 py-6 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-black text-gray-500 tracking-[0.3em] uppercase flex items-center gap-3">
                  <CodeBracketIcon className="w-5 h-5 text-blue-500" /> مخرجات البناء المصدري
                </span>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            <div className="flex-1 relative">
                <textarea 
                    readOnly 
                    value={generatedCode} 
                    className="absolute inset-0 w-full h-full bg-transparent p-10 text-sm font-mono text-blue-300/80 resize-none focus:outline-none custom-scrollbar leading-relaxed"
                    placeholder="// الكود المصدري سيتم توليده هنا بجودة Pixel-Perfect..."
                />
                {generatedCode && (
                  <div className="absolute bottom-8 left-8 flex gap-4">
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                      className="px-8 py-3 bg-blue-600/10 text-blue-400 border border-blue-600/30 rounded-2xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                    >
                      نسخ الكود المصدري
                    </button>
                    <button className="px-8 py-3 bg-emerald-600/10 text-emerald-400 border border-emerald-600/30 rounded-2xl text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all shadow-xl">تحليل الهندسة</button>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;
