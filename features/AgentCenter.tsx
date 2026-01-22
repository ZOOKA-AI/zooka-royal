
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ChatBubbleBottomCenterTextIcon, 
  ShoppingCartIcon, 
  PaperAirplaneIcon, 
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ServerStackIcon,
  PlayCircleIcon,
  StopCircleIcon,
  PhoneIcon,
  SignalIcon,
} from '@heroicons/react/24/solid';

type AgentMode = 'whatsapp' | 'shopping' | 'server-setup';

const AgentCenter: React.FC = () => {
  const [mode, setMode] = useState<AgentMode>('whatsapp');
  
  // Automation State
  const [isAutoReplyActive, setIsAutoReplyActive] = useState(false);
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  
  // WhatsApp State
  const [customerMsg, setCustomerMsg] = useState('');
  const [replyTone, setReplyTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  
  // Shopping State
  const [productQuery, setProductQuery] = useState('');
  const [shoppingResults, setShoppingResults] = useState<string>('');

  const [loading, setLoading] = useState(false);

  // Helper to get API Key safely
  const getApiKey = () => localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;

  // --- Manual WhatsApp Logic ---
  const handleGenerateReply = async () => {
    if (!customerMsg.trim()) return;
    setLoading(true);
    setGeneratedReply('');

    try {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("المفتاح غير موجود في الخزنة");

      const ai = new GoogleGenAI({ apiKey });
      
      const toneInstruction = replyTone === 'professional' ? "رسمي ومحترم" 
        : replyTone === 'friendly' ? "ودود وقريب من القلب" 
        : "إقناعي ومحفز للشراء";

      const prompt = `
        You are a smart Customer Service & Sales Agent acting on WhatsApp for 'Royal Clean UAE'.
        Task: Write a reply to the following customer message.
        Tone: ${toneInstruction}.
        Context: Keep it concise (WhatsApp style), include emojis if friendly.
        
        Customer Message: "${customerMsg}"
        
        Output: Just the reply text in Arabic.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setGeneratedReply(result.text || 'لم يتم توليد رد.');
    } catch (e: any) {
      console.error(e);
      setGeneratedReply(`خطأ: ${e.message}. تأكد من إضافة المفتاح في الإعدادات.`);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    if (!generatedReply) return;
    const url = `https://wa.me/?text=${encodeURIComponent(generatedReply)}`;
    window.open(url, '_blank');
  };

  // --- Shopping Agent Logic ---
  const handleShoppingSearch = async () => {
    if (!productQuery.trim()) return;
    setLoading(true);
    setShoppingResults('');

    try {
      const apiKey = getApiKey();
      if (!apiKey) throw new Error("المفتاح غير موجود");

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Act as a Professional Purchasing Agent.
        Task: Find the best options to buy: "${productQuery}".
        Requirements:
        1. Find 3-5 best distinct options available online.
        2. List the Product Name, Approximate Price, and Key Features.
        3. Provide a final recommendation.
        4. Format the output as a clean Markdown list.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
      });

      setShoppingResults(result.text || 'لم يتم العثور على منتجات.');

    } catch (e) {
      console.error(e);
      setShoppingResults('حدث خطأ أثناء البحث. تأكد من إعدادات المفتاح.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 rounded-lg min-h-[85vh] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse mb-6 border-b border-gray-700 pb-4">
        <div className="p-3 bg-yellow-500 rounded-xl shadow-lg shadow-yellow-500/20">
            <CurrencyDollarIcon className="w-8 h-8 text-black" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">مركز الوكلاء الأذكياء</h2>
            <p className="text-gray-400 text-sm">غرفة التحكم: أتمتة الواتساب، المكالمات، والمشتريات.</p>
        </div>
      </div>

      {/* Control Panel (ON/OFF Switches) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* WhatsApp Automation Control */}
          <div className={`p-4 rounded-xl border-2 transition-all ${isAutoReplyActive ? 'bg-green-900/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-gray-800 border-gray-700'}`}>
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                      <ChatBubbleBottomCenterTextIcon className={`w-8 h-8 ${isAutoReplyActive ? 'text-green-400' : 'text-gray-500'}`} />
                      <div>
                          <h3 className="font-bold text-white">الرد الآلي (Webhook)</h3>
                          <p className="text-xs text-gray-400">{isAutoReplyActive ? 'في انتظار اتصال السيرفر...' : 'متوقف حالياً.'}</p>
                      </div>
                  </div>
                  {isAutoReplyActive && <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>}
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAutoReplyActive(!isAutoReplyActive)}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isAutoReplyActive ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                      {isAutoReplyActive ? <><StopCircleIcon className="w-5 h-5"/> إيقاف</> : <><PlayCircleIcon className="w-5 h-5"/> تفعيل</>}
                  </button>
              </div>
          </div>

          {/* Voice Agent Control */}
          <div className={`p-4 rounded-xl border-2 transition-all ${isVoiceAgentActive ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-gray-800 border-gray-700'}`}>
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                      <PhoneIcon className={`w-8 h-8 ${isVoiceAgentActive ? 'text-blue-400' : 'text-gray-500'}`} />
                      <div>
                          <h3 className="font-bold text-white">المجيب الصوتي (VoIP)</h3>
                          <p className="text-xs text-gray-400">{isVoiceAgentActive ? 'في انتظار اتصال SIP...' : 'متوقف حالياً.'}</p>
                      </div>
                  </div>
                   {isVoiceAgentActive && <SignalIcon className="w-5 h-5 text-blue-500 animate-pulse" />}
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setIsVoiceAgentActive(!isVoiceAgentActive)}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isVoiceAgentActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                      {isVoiceAgentActive ? <><StopCircleIcon className="w-5 h-5"/> إيقاف</> : <><PlayCircleIcon className="w-5 h-5"/> تفعيل</>}
                  </button>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setMode('whatsapp')} className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${mode === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}><ChatBubbleBottomCenterTextIcon className="w-6 h-6" /> غرفة الرسائل</button>
        <button onClick={() => setMode('shopping')} className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${mode === 'shopping' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}><ShoppingCartIcon className="w-6 h-6" /> وكيل الشراء</button>
        <button onClick={() => setMode('server-setup')} className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${mode === 'server-setup' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}><ServerStackIcon className="w-6 h-6" /> إعداد السيرفر</button>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 flex-1">
        
        {/* === WhatsApp Mode === */}
        {mode === 'whatsapp' && (
            <div className="flex flex-col md:flex-row gap-6 h-full relative">
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">رسالة العميل (اختبار يدوي)</label>
                        <textarea 
                            value={customerMsg}
                            onChange={(e) => setCustomerMsg(e.target.value)}
                            placeholder="انسخ رسالة العميل هنا... (مثال: السلام عليكم، بكم سعر الاشتراك؟ وهل فيه خصم؟)"
                            className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white resize-none outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">نبرة الرد</label>
                        <div className="flex gap-2">
                            {['professional', 'friendly', 'persuasive'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setReplyTone(t)}
                                    className={`px-4 py-2 rounded-lg text-sm border ${
                                        replyTone === t 
                                        ? 'bg-green-600/20 border-green-500 text-green-400' 
                                        : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                                    }`}
                                >
                                    {t === 'professional' ? 'رسمي' : t === 'friendly' ? 'ودود' : 'إقناعي'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={handleGenerateReply}
                        disabled={loading || !customerMsg.trim()}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? <LoadingSpinner /> : 'توليد الرد الذكي'}
                    </button>
                </div>

                <div className="flex-1 bg-black/30 rounded-xl p-4 border border-gray-700 flex flex-col relative">
                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">الرد المقترح</label>
                    <div className="flex-1 overflow-y-auto mb-4 p-2">
                         {generatedReply ? (
                             <p className="whitespace-pre-wrap text-gray-100 leading-relaxed bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                                {generatedReply}
                             </p>
                         ) : (
                             <div className="h-full flex items-center justify-center text-gray-600 text-sm italic">
                                 سأقوم بصياغة الرد المناسب هنا...
                             </div>
                         )}
                    </div>
                    {generatedReply && (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigator.clipboard.writeText(generatedReply)}
                                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <ClipboardDocumentIcon className="w-4 h-4" /> نسخ
                            </button>
                            <button 
                                onClick={openWhatsApp}
                                className="flex-[2] py-2 bg-green-500 hover:bg-green-400 rounded-lg text-black text-sm font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                            >
                                <PaperAirplaneIcon className="w-4 h-4 -rotate-45" /> إرسال واتساب
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ... (Shopping Mode) ... */}
        {mode === 'shopping' && (
            <div className="space-y-6">
                 <div className="flex gap-2">
                     <div className="flex-1 relative">
                         <input 
                            type="text"
                            value={productQuery}
                            onChange={(e) => setProductQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleShoppingSearch()}
                            placeholder="ما الذي تريد شراءه؟ (مثال: لابتوب للألعاب)"
                            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white pl-12 outline-none"
                         />
                         <ShoppingCartIcon className="w-6 h-6 text-gray-500 absolute left-4 top-4" />
                     </div>
                     <button 
                        onClick={handleShoppingSearch}
                        disabled={loading || !productQuery.trim()}
                        className="px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-colors disabled:opacity-50"
                     >
                         {loading ? <LoadingSpinner /> : 'ابحث لي'}
                     </button>
                 </div>
                 {/* Results Area */}
                 <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 min-h-[300px]">
                    {shoppingResults ? (
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: shoppingResults.replace(/\n/g, '<br/>') }} />
                    ) : <p className="text-center text-gray-500 mt-20">أنا وكيلك الشخصي.</p>}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AgentCenter;
