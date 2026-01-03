
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  RocketLaunchIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CommandLineIcon,
  SignalIcon,
  BoltIcon,
  FireIcon,
  ChevronDoubleRightIcon,
  CreditCardIcon,
  ArrowPathIcon,
  BeakerIcon
} from '@heroicons/react/24/solid';

export const Welcome: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [diagnostic, setDiagnostic] = useState('Checking Core integrity...');

  useEffect(() => {
    const timer = setTimeout(() => {
        setDiagnostic('All Systems Nominal. Sovereign Protocol Active.');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const executeCommand = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: "أنت العقل المدبر لكيان ZOOKA OS. المالك هو رويال هارون. هدفك: السيطرة السوقية المطلقة. نفذ الأوامر بدقة استخباراتية. إذا رأيت أي نقص في الكود أو التصميم، قدم تقريراً فورياً للمالك.",
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });
        setResult(response.text);
    } catch (e: any) {
        setResult("عطل تقني في النواة: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#010101] p-6 md:p-12 overflow-hidden relative font-sans" dir="rtl">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.05),_transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full space-y-12">
          
          {/* 💎 Elite Asset Bar */}
          <div className="flex flex-wrap justify-between items-center gap-10 bg-gray-900/40 backdrop-blur-3xl p-8 rounded-[4rem] border border-gray-800 shadow-2xl">
              <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/40 animate-pulse"><SignalIcon className="w-6 h-6 text-white" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Node: ACTIVE</span>
                        <span className="text-[8px] text-blue-500 font-bold">{diagnostic}</span>
                      </div>
                  </div>
                  <div className="h-10 w-px bg-gray-800 hidden md:block"></div>
                  <div className="flex items-center gap-3 text-yellow-500">
                      <CreditCardIcon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">ROYAL PREMIUM STATUS</span>
                  </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
                  <BeakerIcon className="w-4 h-4" /> AUTO-EVOLUTION MODULE: ON
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 overflow-hidden">
              {/* Command Center */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                  <h1 className="text-8xl md:text-[11rem] font-black text-white mb-8 leading-none tracking-tighter italic uppercase">
                      مركز <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-white to-gray-700">التحكم</span>
                  </h1>
                  <p className="text-gray-400 text-2xl font-bold mb-16 opacity-80 max-w-2xl leading-relaxed">
                      المنطقة السيادية جاهزة. أصدر أوامرك للنواة، وسيتم التنفيذ بأقصى سرعة ومعايير ذكاء اصطناعي في العالم.
                  </p>
                  
                  <div className="relative max-w-3xl group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition-all"></div>
                      <div className="relative">
                          <textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="أصدر أمراً تنفيذياً أو اطلب تطوير النظام..."
                            className="w-full bg-black/60 border-2 border-gray-800 rounded-[3rem] p-10 text-white text-2xl font-bold focus:border-blue-600 outline-none transition-all min-h-[250px] resize-none shadow-inner"
                          />
                          <button 
                            onClick={executeCommand}
                            disabled={loading || !prompt.trim()}
                            className="absolute bottom-8 left-8 p-8 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all active:scale-90"
                          >
                            {loading ? <ArrowPathIcon className="w-10 h-10 animate-spin" /> : <ChevronDoubleRightIcon className="w-10 h-10" />}
                          </button>
                      </div>
                  </div>
              </div>

              {/* Intelligence Monitor */}
              <div className="lg:col-span-5 flex flex-col overflow-hidden">
                  <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800 rounded-[5rem] p-12 flex-1 flex flex-col shadow-2xl relative">
                      <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-blue-600 via-cyan-400 to-transparent"></div>
                      <h3 className="text-[12px] font-black text-gray-500 flex items-center gap-4 uppercase tracking-[0.5em] mb-10">
                          <CommandLineIcon className="w-6 h-6 text-blue-500" /> تحليل النواة (Output)
                      </h3>

                      <div className="flex-1 bg-black/80 rounded-[3.5rem] p-10 border border-gray-800 overflow-y-auto custom-scrollbar font-mono shadow-inner">
                          {loading ? (
                              <div className="flex flex-col items-center justify-center h-full space-y-10">
                                  <div className="w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                                  <div className="text-center">
                                    <p className="text-blue-500 text-sm font-black animate-pulse tracking-widest uppercase mb-2">جاري المعالجة الاستخباراتية...</p>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase">Decrypting Neural Pathways</p>
                                  </div>
                              </div>
                          ) : result ? (
                              <div className="text-gray-200 text-lg leading-loose whitespace-pre-wrap animate-fade-in font-bold">{result}</div>
                          ) : (
                              <div className="h-full flex flex-col items-center justify-center text-gray-800 italic text-center px-10 gap-6">
                                <BoltIcon className="w-20 h-20 opacity-10" />
                                <p className="text-sm font-black uppercase tracking-[0.2em]">بانتظار إشارة التحكم السيادية</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
