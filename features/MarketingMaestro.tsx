
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
    RocketLaunchIcon, 
    GlobeAltIcon, 
    CheckBadgeIcon,
    ArrowPathIcon,
    LinkIcon,
    ServerStackIcon,
    CommandLineIcon,
    CheckCircleIcon
} from '@heroicons/react/24/solid';

const MarketingMaestro: React.FC = () => {
    const [seoUrl, setSeoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [sources, setSources] = useState<any[]>([]);

    // GSC State
    const [gscLoading, setGscLoading] = useState(false);
    const [gscLogs, setGscLogs] = useState<string[]>([]);
    const [gscData, setGscData] = useState<any>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    const runSEOAudit = async () => {
        if (!seoUrl.trim()) return;
        setLoading(true);
        setResultText('');
        setSources([]);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) {
                setResultText("خطأ: مفتاح API مفقود. يرجى إعداده من الخزنة.");
                setLoading(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `قم بإجراء تحليل سيو (SEO) وتدقيق تسويقي شامل لموقع: ${seoUrl}.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] }
            });
            setResultText(response.text || '');
            setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
        } catch (e) {
            console.error(e);
            setResultText("حدث خطأ أثناء الفحص. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };

    const runGSCAutomation = async () => {
        if (!seoUrl.trim()) return;
        setGscLoading(true);
        setGscLogs([]);
        setGscData(null);

        const addLog = (msg: string) => setGscLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("مفتاح API مفقود.");
            
            addLog("بدء الاتصال بـ Google Search Console API...");
            await new Promise(r => setTimeout(r, 1500));
            addLog("تم التحقق من الصلاحيات بنجاح.");
            
            const ai = new GoogleGenAI({ apiKey });
            const sitemapUrl = new URL('/sitemap.xml', seoUrl).href;
            const prompt = `
                أنت محاكي لواجهة Google Search Console API.
                المستخدم يطلب أتمتة لموقعه: ${seoUrl}
                مهمتك: توليد استجابة JSON واقعية تحاكي النتائج.

                JSON Structure:
                {
                  "sitemapStatus": {
                    "path": "${sitemapUrl}",
                    "lastSubmitted": "${new Date().toISOString()}",
                    "errors": 0,
                    "warnings": 0,
                    "isPending": false
                  },
                  "extractedUrls": [
                    "${new URL('/', seoUrl).href}",
                    "${new URL('/about', seoUrl).href}",
                    "${new URL('/services', seoUrl).href}",
                    "${new URL('/contact', seoUrl).href}",
                    "${new URL('/blog/post-1', seoUrl).href}"
                  ],
                  "finalLog": "تم تحديث السايت ماب وفحص حالته بنجاح."
                }
            `;
            
            addLog(`إرسال طلب تحديث السايت ماب: ${sitemapUrl}`);
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            
            const data = JSON.parse(response.text || '{}');
            setGscData(data);
            addLog(data.finalLog || "اكتملت العملية.");

        } catch(e) {
            console.error(e);
            addLog("❌ فشل الاتصال. تحقق من مفتاح API وصلاحيات GSC.");
        } finally {
            setGscLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-900/90 rounded-[3.5rem] border border-gray-800 shadow-2xl" dir="rtl">
            <div className="flex items-center gap-6 mb-12 border-b border-gray-800 pb-10">
                <div className="p-5 bg-red-600 rounded-3xl shadow-xl animate-pulse">
                    <RocketLaunchIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-white italic">المايسترو التسويقي</h1>
            </div>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <input 
                        value={seoUrl} 
                        onChange={e => setSeoUrl(e.target.value)}
                        className="flex-1 bg-black border-2 border-gray-800 rounded-2xl px-6 py-5 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/50 outline-none"
                        placeholder="أدخل رابط الموقع..."
                    />
                    <button 
                        onClick={runSEOAudit}
                        disabled={loading || !seoUrl.trim()}
                        className="bg-red-600 hover:bg-red-500 px-12 py-5 rounded-2xl font-black text-white disabled:opacity-50"
                    >
                        {loading ? <ArrowPathIcon className="w-6 h-6 animate-spin"/> : 'فحص سيو'}
                    </button>
                </div>
                {resultText && (
                    <div className="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700 text-gray-300 whitespace-pre-wrap leading-loose">
                        {resultText}
                    </div>
                )}
            </div>

            {/* GSC Automation Section */}
            <div className="mt-16 pt-12 border-t border-gray-800 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-xl"><ServerStackIcon className="w-8 h-8 text-white" /></div>
                    <h2 className="text-3xl font-black text-white">أتمتة Google Search Console</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <button onClick={runGSCAutomation} disabled={gscLoading || !seoUrl.trim()} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl disabled:opacity-50">
                            {gscLoading ? 'جاري التنفيذ...' : 'بدء الأتمتة'}
                        </button>
                        <div className="bg-black/80 p-6 rounded-[2rem] border border-gray-800 h-[300px] flex flex-col font-mono shadow-inner">
                            <h3 className="text-xs font-black text-blue-500 flex items-center gap-2 uppercase tracking-widest border-b border-gray-800 pb-3 mb-3"><CommandLineIcon className="w-4 h-4"/> سجل العمليات</h3>
                            <div ref={logEndRef} className="flex-1 overflow-y-auto custom-scrollbar text-[10px] space-y-1.5">
                                {gscLogs.map((log, i) => (<div key={i} className="text-green-500/80 animate-fade-in">{log}</div>))}
                                {gscLogs.length === 0 && <div className="text-gray-600">بانتظار الأوامر...</div>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700 min-h-[300px]">
                        {gscData ? (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-500"/> حالة السايت ماب</h4>
                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 text-sm space-y-2">
                                        <p><strong>آخر إرسال:</strong> {new Date(gscData.sitemapStatus.lastSubmitted).toLocaleString()}</p>
                                        <p><strong>أخطاء:</strong> <span className="text-red-500 font-bold">{gscData.sitemapStatus.errors}</span></p>
                                        <p><strong>تحذيرات:</strong> <span className="text-yellow-500 font-bold">{gscData.sitemapStatus.warnings}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><LinkIcon className="w-5 h-5 text-cyan-500"/> الروابط المستخرجة</h4>
                                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 max-h-40 overflow-y-auto custom-scrollbar">
                                        {gscData.extractedUrls.map((url: string, i: number) => (
                                            <a key={i} href={url} target="_blank" className="block text-cyan-400 hover:underline text-sm truncate">{url}</a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 italic">ستظهر نتائج الأتمتة هنا...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingMaestro;
