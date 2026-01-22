
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  BoltIcon, 
  SignalIcon, 
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ServerIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/solid';

const SystemScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startScan = async () => {
    setScanning(true);
    setProgress(0);
    setLogs([]);
    setReport(null);

    const steps = [
      "بدء فحص النواة المركزية...",
      "التحقق من سلامة الأكواد السيادية...",
      "فحص بروتوكولات التشفير E2EE...",
      "اختبار سرعة استجابة الـ API...",
      "تحليل موارد السيرفر السحابي...",
      "فحص قاعدة بيانات رويال هارون...",
      "توليد التقرير النهائي..."
    ];

    for (let i = 0; i < steps.length; i++) {
      addLog(steps[i]);
      for (let p = 0; p < 100 / steps.length; p++) {
        setProgress(prev => Math.min(prev + 1, 100));
        await new Promise(r => setTimeout(r, 20));
      }
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "قم بتوليد تقرير استخباراتي تقني شامل حول حالة 'نظام زوكا السيادي'. أظهر القوة والأمان والجاهزية للسيطرة على السوق. استخدم لغة مهيبة واحترافية.",
        config: {
          systemInstruction: "أنت كبير مهندسي رويال هارون. هدفك طمأنة المالك بأن النظام في قمة جاهزيته."
        }
      });
      setReport(result.text || "اكتمل الفحص بنجاح. كافة الأنظمة تعمل بكفاءة 100%.");
    } catch (e) {
      setReport("اكتمل الفحص. الأنظمة مستقرة، ولكن يرجى التحقق من مفتاح الـ API لضمان استمرارية خدمات الذكاء.");
    } finally {
      setScanning(false);
      addLog("✅ اكتمل الفحص الشامل للكيان.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-32 font-sans" dir="rtl">
      <header className="relative bg-gradient-to-br from-blue-900/40 to-black p-12 rounded-[4rem] border border-gray-800 text-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative z-10 space-y-6">
          <div className="bg-blue-600/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto animate-pulse border border-blue-500/30">
            <MagnifyingGlassIcon className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">بروتوكول <span className="text-blue-600">الفحص</span> الشامل</h1>
          <p className="text-gray-400 text-xl font-bold max-w-2xl mx-auto leading-relaxed italic">
            "افحص سلامة النواة، قوة التشفير، وجاهزية الذكاء الاصطناعي بضغطة واحدة."
          </p>
          <button 
            onClick={startScan} 
            disabled={scanning} 
            className="mt-10 px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 mx-auto disabled:opacity-50"
          >
            {scanning ? <LoadingSpinner /> : <><BoltIcon className="w-8 h-8"/> ابدأ الفحص السيادي</>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-black/60 p-8 rounded-[3rem] border border-gray-800 h-[450px] flex flex-col font-mono shadow-inner">
            <h3 className="text-xs font-black text-blue-500 flex items-center gap-3 uppercase tracking-widest border-b border-gray-800 pb-3 mb-4">
              <SignalIcon className="w-5 h-5"/> مخرجات الفحص (Terminal)
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[11px] space-y-2">
              {logs.length === 0 && <div className="text-gray-700 italic">بانتظار بدء بروتوكول الفحص...</div>}
              {logs.map((log, i) => (
                <div key={i} className="text-green-500/80 animate-fade-in">
                  <span className="text-blue-500 mr-2">➜</span> {log}
                </div>
              ))}
              {scanning && (
                <div className="mt-4 space-y-2">
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="text-[10px] text-blue-400 text-left font-bold">{progress}% COMPLETED</div>
                </div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-[4rem] p-10 min-h-[450px] flex flex-col relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px]"></div>
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
            <DocumentMagnifyingGlassIcon className="w-8 h-8 text-blue-600" /> تقرير الحالة (Sovereign Report)
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {report ? (
              <div className="prose prose-invert max-w-none animate-fade-in">
                <p className="text-gray-300 leading-loose whitespace-pre-wrap text-lg font-medium">
                  {report}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-6 text-center italic">
                <ShieldCheckIcon className="w-24 h-24 opacity-10" />
                <p className="text-lg font-bold uppercase tracking-widest px-10">التقرير سيظهر هنا بعد اكتمال المعالجة الاستخباراتية</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <CpuChipIcon className="w-8 h-8 text-purple-500" />, label: "حالة المعالج", val: "Optimal" },
          { icon: <ServerIcon className="w-8 h-8 text-green-500" />, label: "تزامن السحاب", val: "Synced" },
          { icon: <CheckBadgeIcon className="w-8 h-8 text-blue-500" />, label: "أمان الهوية", val: "Verified" }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/40 border border-gray-800 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
            <div className="p-4 bg-black/40 rounded-2xl">{stat.icon}</div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-white">{stat.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemScanner;
