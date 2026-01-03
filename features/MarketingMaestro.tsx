
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
    RocketLaunchIcon, 
    GlobeAltIcon, 
    CheckBadgeIcon,
    ArrowPathIcon,
    LinkIcon
} from '@heroicons/react/24/solid';

const MarketingMaestro: React.FC = () => {
    const [seoUrl, setSeoUrl] = useState('https://royalcleanuae.com/');
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState('');
    const [sources, setSources] = useState<any[]>([]);

    const runSEOAudit = async () => {
        if (!seoUrl.trim()) return;
        setLoading(true);
        setResultText('');
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
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
                        className="flex-1 bg-black border-2 border-gray-800 rounded-2xl px-6 py-5 text-white focus:border-red-500 outline-none"
                        placeholder="أدخل رابط الموقع..."
                    />
                    <button 
                        onClick={runSEOAudit}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-500 px-12 py-5 rounded-2xl font-black text-white"
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
        </div>
    );
};

export default MarketingMaestro;
