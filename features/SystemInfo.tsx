
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ShieldCheckIcon, 
  CpuChipIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  GlobeAltIcon,
  ServerStackIcon,
  CodeBracketIcon,
  VideoCameraIcon,
  FingerPrintIcon,
  ScaleIcon,
  LightBulbIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface SystemInfoProps {
  onClose: () => void;
  initialTab?: 'identity' | 'capabilities' | 'legal' | 'chat';
}

const CAPABILITIES = [
    { icon: <VideoCameraIcon className="w-6 h-6" />, title: "استوديو الفيديو (Veo)", desc: "توليد وتحريك الفيديو بدقة سينمائية." },
    { icon: <CpuChipIcon className="w-6 h-6" />, title: "الذكاء المركزي (Core)", desc: "تحليل البيانات وإدارة العمليات المعقدة." },
    { icon: <CodeBracketIcon className="w-6 h-6" />, title: "المهندس المعماري", desc: "بناء التطبيقات وتحليل المخططات الهندسية." },
    { icon: <GlobeAltIcon className="w-6 h-6" />, title: "التتبع العالمي", desc: "إدارة الأساطيل والموظفين عبر خرائط 3D." },
    { icon: <ServerStackIcon className="w-6 h-6" />, title: "السحابة الخاصة", desc: "تخزين آمن ومعالجة بيانات مشفرة." },
    { icon: <SparklesIcon className="w-6 h-6" />, title: "المساعد الإسلامي", desc: "فتاوى، قرآن، وتلاوات (صدقة جارية)." },
];

export const SystemInfo: React.FC<SystemInfoProps> = ({ onClose, initialTab = 'identity' }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'capabilities' | 'legal' | 'chat'>(initialTab);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
      { role: 'model', text: "مرحبًا بك! أنا المرشد الذكي لنظام زوكا (ZOOKA OS). اسألني عن قدرات النظام، أو كيف يمكننا مساعدتك في أعمالك." }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleChat = async () => {
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      setChatInput('');
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
      setLoadingChat(true);

      try {
          const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
          if (!apiKey) throw new Error("API key is missing.");
          
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `
            You are the Official Guide and Sales Representative for "ZOOKA OS" (developed by Royal Haroun).
            
            System Capabilities:
            1. Advanced AI Video/Image Generation (Veo & Imagen).
            2. Code Engineering & App Building.
            3. Global Fleet Tracking (Zooka Track X).
            4. Islamic Suite (Quran & Fatwa).
            5. Financial Management (OCR Receipts).
            6. Marketing Automation.

            User Question: "${userMsg}"

            Instructions:
            - Answer in Arabic (Professional & Enthusiastic).
            - Focus on the power, security, and prestige of the system.
            - Keep answers concise (max 3 sentences).
            - If asked about pricing, say "Please contact Sales via the login screen."
          `;

          const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash', 
              contents: prompt
          });

          setChatHistory(prev => [...prev, { role: 'model', text: result.text || "أنا هنا للإجابة عن استفساراتك حول النظام." }]);
      } catch (error: any) {
          console.error("Chat Error:", error);
          let errorMsg = "عذرًا، حدث خطأ في الاتصال بالخادم.";
          if (error.message?.includes('API key')) {
              errorMsg = "عذرًا، مفتاح API مفقود أو غير صالح. يرجى إضافته من الإعدادات (الخزنة).";
          }
          setChatHistory(prev => [...prev, { role: 'model', text: errorMsg }]);
      } finally {
          setLoadingChat(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
        <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-600 rounded-lg shadow-lg shadow-yellow-900/50">
                        <FingerPrintIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wider">ZOOKA OS</h2>
                        <p className="text-xs text-yellow-500 tracking-[0.3em] uppercase">Royal Haroun Entity</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex border-b border-gray-800 bg-gray-900/50 overflow-x-auto">
                {[
                    { id: 'identity', label: 'التعريف والهوية', icon: <ShieldCheckIcon className="w-5 h-5"/> },
                    { id: 'capabilities', label: 'القدرات الخارقة', icon: <CpuChipIcon className="w-5 h-5"/> },
                    { id: 'chat', label: 'المرشد الذكي', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400"/> },
                    { id: 'legal', label: 'حفظ الحقوق', icon: <ScaleIcon className="w-5 h-5"/> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'text-yellow-400 border-b-2 border-yellow-500 bg-yellow-900/10' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative">
                <div className="absolute inset-0 bg-gray-900/90 pointer-events-none z-0"></div>
                <div className="relative z-10">
                    
                    {/* 1. IDENTITY */}
                    {activeTab === 'identity' && (
                        <div className="text-center space-y-8 animate-fade-in-up">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-yellow-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)] mb-6">
                                <SparklesIcon className="w-16 h-16 text-white animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-gray-400">
                                الكيان الرقمي المتكامل
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                                نظام <strong>ZOOKA OS</strong> ليس مجرد برنامج، بل هو عقل رقمي متكامل تم تطويره بواسطة 
                                <span className="text-yellow-500 font-bold"> "رويال هارون" </span>. 
                                يهدف النظام إلى أتمتة الأعمال، تأمين البيانات، وتوفير حلول ذكاء اصطناعي سيادية للمؤسسات والشركات الكبرى.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                                    <h3 className="text-blue-400 font-bold mb-2">الرؤية</h3>
                                    <p className="text-sm text-gray-400">تمكين المؤسسات من خلال ذكاء اصطناعي آمن ومستقل.</p>
                                </div>
                                <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                                    <h3 className="text-green-400 font-bold mb-2">الأمان</h3>
                                    <p className="text-sm text-gray-400">تشفير عسكري وحماية سيبرانية على مدار الساعة (Cyber Shield).</p>
                                </div>
                                <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700">
                                    <h3 className="text-purple-400 font-bold mb-2">التكامل</h3>
                                    <p className="text-sm text-gray-400">نظام واحد يجمع الإدارة، المال، والتسويق.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. CAPABILITIES */}
                    {activeTab === 'capabilities' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                            {CAPABILITIES.map((cap, i) => (
                                <div key={i} className="bg-gray-800/50 backdrop-blur border border-gray-700 p-6 rounded-2xl hover:border-yellow-500/50 transition-all hover:transform hover:scale-105 group">
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-yellow-500 mb-4 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                        {cap.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{cap.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{cap.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 3. LEGAL / IP */}
                    {activeTab === 'legal' && (
                        <div className="max-w-3xl mx-auto bg-black/40 border border-gray-700 p-8 rounded-2xl text-justify animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                                <ScaleIcon className="w-8 h-8 text-red-500" />
                                <h2 className="text-2xl font-bold text-white">وثيقة حماية الملكية الفكرية</h2>
                            </div>
                            <div className="space-y-4 text-gray-300 leading-loose">
                                <p>
                                    <strong className="text-white">1. الملكية الحصرية:</strong> جميع الأكواد البرمجية، التصاميم، الخوارزميات، والهوية البصرية لنظام ZOOKA OS هي ملكية حصرية وحقوق محفوظة لـ <strong>"رويال هارون" (@3219)</strong>.
                                </p>
                                <p>
                                    <strong className="text-white">2. حظر النسخ:</strong> يمنع منعًا باتًا نسخ، تعديل، توزيع، أو هندسة عكسية لأي جزء من هذا النظام دون إذن كتابي صريح من المالك.
                                </p>
                                <p>
                                    <strong className="text-white">3. العلامة التجارية:</strong> شعار "ZOOKA" واسم "رويال هارون" هما علامتان تجاريتان مسجلتان.
                                </p>
                                <p>
                                    <strong className="text-white">4. المسؤولية القانونية:</strong> أي انتهاك لهذه الحقوق يعرض الفاعل للمساءلة القانونية الكاملة بموجب قوانين حماية الملكية الفكرية والجرائم الإلكترونية الدولية والمحلية.
                                </p>
                                <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-xl text-center text-red-300 text-sm">
                                    <ShieldCheckIcon className="w-6 h-6 mx-auto mb-2" />
                                    هذا النظام محمي بواسطة بروتوكولات التتبع الرقمي. أي محاولة سرقة سيتم رصدها تلقائيًا.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. SMART GUIDE CHAT */}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-full max-h-[600px] bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden animate-fade-in-up">
                            {/* Chat Header */}
                            <div className="bg-gray-800 p-4 flex items-center gap-3 border-b border-gray-700">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                                    <LightBulbIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">المرشد الذكي</h3>
                                    <p className="text-xs text-green-400">متصل (Gemini Flash Link)</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                                            msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                                        }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {loadingChat && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-700 px-4 py-2 rounded-full rounded-bl-none flex items-center gap-2">
                                            <LoadingSpinner />
                                            <span className="text-xs text-gray-400">جاري الكتابة...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                                    placeholder="اسألني عن مميزات النظام..."
                                    className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                                />
                                <button 
                                    onClick={handleChat}
                                    disabled={loadingChat || !chatInput.trim()}
                                    className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5 transform rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    </div>
  );
};
