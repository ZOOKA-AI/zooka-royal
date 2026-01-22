import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ClipboardDocumentCheckIcon, 
  LanguageIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  Bars3BottomRightIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/solid';

const SmartEditor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');
  const outputRef = useRef<HTMLDivElement>(null);

  const actions = [
    { id: 'structural_formwork', label: 'مخطط الشدة الهندسية', icon: <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-400" />, prompt: "تصرف كمهندس مدني خبير ومدير مشروع. المهمة: إعداد خطة عمل وتقرير فني شامل لأعمال الشدة الخشبية والمعدنية (Formwork Method Statement). المطلوب: 1. التخطيط والتجهيز. 2. خطوات التنفيذ (تحطيط، تربيع، تقوية). 3. قائمة الاستلام (Inspection Checklist). 4. فك الشدة. استخدم المصطلحات الفنية (عرق، نهايز، برندات، تطبيق). البيانات المقدمة:" },
    { id: 'improve', label: 'تحسين الصياغة', icon: <SparklesIcon className="w-5 h-5" />, prompt: "Rewrite the following text to be more professional, eloquent, and clear in Arabic:" },
    { id: 'fix_grammar', label: 'تدقيق لغوي', icon: <CheckBadgeIcon className="w-5 h-5" />, prompt: "Fix all grammar, spelling, and punctuation errors in the following Arabic text:" },
    { id: 'summarize', label: 'تلخيص تنفيذي', icon: <Bars3BottomRightIcon className="w-5 h-5" />, prompt: "Summarize the following text into a professional executive summary:" },
    { id: 'extract_points', label: 'تحويل لنقاط', icon: <DocumentTextIcon className="w-5 h-5" />, prompt: "Extract key points from this text as a formatted list:" },
    { id: 'translate_en', label: 'ترجمة احترافية', icon: <LanguageIcon className="w-5 h-5" />, prompt: "Translate the following to fluent professional English, keeping the formatting:" },
  ];

  const handleAction = async (actionId: string, promptPrefix: string) => {
    if (!inputText.trim()) return;
    setLoading(true);
    setCurrentAction(actionId);
    setOutputText('');
    
    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `${promptPrefix}\n\n---\n${inputText}\n---`,
        config: { thinkingConfig: { thinkingBudget: 2048 } }
      });
      setOutputText(result.text || 'لم يتم استلام نص.');
    } catch (error: any) {
      setOutputText(`حدث خطأ أثناء المعالجة: ${error.message}`);
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const handlePrint = () => {
    const contentToPrint = outputRef.current?.innerHTML;
    if (!contentToPrint) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>تقرير مُصدّر من ZOOKA OS</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
              body { 
                font-family: 'Cairo', sans-serif; 
                direction: rtl;
                padding: 2rem;
                background-color: white;
                color: black;
              }
              p {
                white-space: pre-wrap;
                font-size: 1rem;
                line-height: 1.8;
              }
            </style>
          </head>
          <body>
            ${contentToPrint}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 min-h-[85vh] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-6 px-4">
        <div className="flex items-center space-x-4 space-x-reverse">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">المحرر الذكي (Pro Editor)</h2>
              <p className="text-gray-400 text-sm">مساعدك الهندسي واللغوي الفائق.</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 px-4 mb-4">
        {/* Input Area */}
        <div className="flex flex-col space-y-6">
          <div className="bg-gray-800/80 p-5 rounded-2xl border border-gray-700 flex-1 flex flex-col shadow-inner">
             <label className="text-gray-300 font-bold mb-3 flex justify-between items-center text-sm">
                 <span className="flex items-center gap-2"><DocumentTextIcon className="w-4 h-4 text-blue-400"/> النص الأصلي / معطيات الشدة</span>
                 <span className="text-[10px] text-gray-500 bg-black/40 px-2 py-0.5 rounded-full">{inputText.length} حرف</span>
             </label>
             <textarea 
               value={inputText} 
               onChange={(e) => setInputText(e.target.value)} 
               placeholder="أدخل النص أو معطيات المشروع (مثال: سقف Flat Slab مساحة 200م، ارتفاع 3م)..." 
               className="w-full flex-1 p-4 bg-gray-900/50 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white resize-none outline-none transition-all placeholder:text-gray-600 leading-relaxed" 
             />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {actions.map((action) => (
              <button 
                key={action.id} 
                onClick={() => handleAction(action.id, action.prompt)} 
                disabled={loading || !inputText.trim()} 
                className={`group flex flex-col items-center justify-center p-4 rounded-2xl font-bold transition-all border-2 text-xs gap-2 ${
                  loading && currentAction === action.id 
                  ? 'bg-blue-600 border-blue-400 text-white' 
                  : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:border-blue-500 hover:bg-gray-800 hover:text-white hover:shadow-lg hover:shadow-blue-500/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="transform group-hover:scale-110 transition-transform">
                   {loading && currentAction === action.id ? <LoadingSpinner /> : action.icon}
                </div>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col">
           <div className={`bg-gray-800/80 p-5 rounded-2xl border transition-colors flex-1 flex flex-col shadow-inner ${outputText ? 'border-green-500/30' : 'border-gray-700'}`}>
             <div className="flex justify-between items-center mb-3">
               <label className="text-gray-300 font-bold text-sm flex items-center gap-2">
                 <CheckBadgeIcon className="w-4 h-4 text-green-400"/> النتيجة / التقرير الهندسي
               </label>
               {outputText && (
                 <div className="flex gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(outputText)} 
                      className="text-[10px] text-green-400 bg-green-900/30 px-3 py-1 rounded-full font-bold hover:bg-green-900/50 transition-colors flex items-center gap-1"
                    >
                      <ClipboardDocumentCheckIcon className="w-3 h-3"/>
                      نسخ التقرير
                    </button>
                     <button 
                      onClick={handlePrint} 
                      className="text-[10px] text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full font-bold hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                    >
                      <DocumentArrowDownIcon className="w-3 h-3" />
                      تصدير PDF
                    </button>
                 </div>
               )}
             </div>
             <div className="flex-1 bg-black/40 rounded-xl p-6 overflow-y-auto border border-gray-800 relative group">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-gray-900/20 backdrop-blur-[2px]">
                    <div className="p-4 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 animate-bounce">
                        <WrenchScrewdriverIcon className="w-8 h-8 text-white"/>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-400 font-black text-sm animate-pulse">جاري التحليل الهندسي الشامل...</p>
                        <p className="text-[10px] text-gray-500 mt-1">توليد جداول الاستلام ومعايير الأمان</p>
                    </div>
                  </div>
                ) : (
                  <div ref={outputRef} className="prose prose-invert prose-sm max-w-none">
                    <p className="whitespace-pre-wrap leading-[1.8] text-gray-200 font-medium">
                        {outputText || "أدخل المعطيات واضغط على 'مخطط الشدة' للحصول على تقرير كامل..."}
                    </p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
      <div className="px-4 pb-4">
          <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            © 2025 ZOOKA ENGINEERING SYSTEMS - ROYAL HAROUN
          </p>
      </div>
    </div>
  );
};

export default SmartEditor;