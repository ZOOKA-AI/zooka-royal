import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
    RocketLaunchIcon, 
    DocumentDuplicateIcon, 
    CalendarDaysIcon,
    HashtagIcon,
    ChatBubbleLeftRightIcon,
    PhoneIcon,
    PaperAirplaneIcon,
    ShareIcon,
    CheckCircleIcon,
    GlobeAltIcon,
    SparklesIcon,
    CodeBracketIcon
} from '@heroicons/react/24/solid';

const BRAND_IDENTITY = `
    BRAND NAME: Royal Clean UAE & ZOOKA OS (Owned by Royal Haroun 2025).
    WEBSITE: https://royalcleanuae.com/
    SYSTEM: https://zoka.royalcleanuae.com/
    PHONE: +971563177803
    WHATSAPP: https://wa.me/971563177803
`;

interface CampaignPlan {
    strategy_overview: string;
    keywords: string[];
    viral_headlines: string[];
    schedule: {
        day: string;
        platform: string;
        content: string;
        time: string;
    }[];
}

const MarketingMaestro: React.FC = () => {
    const [campaignIdea, setCampaignIdea] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [plan, setPlan] = useState<CampaignPlan | null>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'plan' | 'schedule' | 'dryrun'>('plan');
    const [dryRunLogs, setDryRunLogs] = useState<string[]>([]);

    const startCampaign = async () => {
        if (!campaignIdea.trim()) return;
        setIsRunning(true);
        setError('');
        setPlan(null);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("مفتاح API مفقود. يرجى إضافته في الخزنة.");

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
                ACT AS A WORLD-CLASS MARKETING STRATEGIST.
                BRAND: ${BRAND_IDENTITY}
                User Command: "${campaignIdea}"
                Generate a JSON response: { "strategy_overview": "", "keywords": [], "viral_headlines": [], "schedule": [{ "day": "", "platform": "", "content": "", "time": "" }] }
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            if (result.text) {
                setPlan(JSON.parse(result.text));
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsRunning(false);
        }
    };

    const runDryRun = (platform: string, content: string) => {
        const payload = {
            target: platform,
            message: content,
            scheduled_at: new Date().toISOString(),
            meta: {
                trace_id: Math.random().toString(36).substring(7),
                mode: "DRY_RUN",
                author: "ZOOKA_AUTO_AGENT"
            }
        };
        
        setDryRunLogs(prev => [`[${new Date().toLocaleTimeString()}] PREPARED PAYLOAD: \n${JSON.stringify(payload, null, 2)}`, ...prev]);
        alert(`[DRY RUN] Would publish to ${platform}. See logs tab for JSON Payload.`);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 min-h-screen text-white rounded-lg font-sans">
            <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
                         <RocketLaunchIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">المايسترو التسويقي</h1>
                        <p className="text-gray-400 text-sm">أتمتة الهوية الرقمية (DRY-RUN ENABLED)</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
                        <label className="block font-bold mb-2 text-gray-300">أمر الحملة</label>
                        <textarea 
                            value={campaignIdea} 
                            onChange={(e) => setCampaignIdea(e.target.value)} 
                            placeholder="اكتب الأمر هنا..." 
                            className="w-full h-40 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white resize-none"
                        />
                        <button 
                            onClick={startCampaign} 
                            disabled={isRunning || !campaignIdea}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            {isRunning ? <LoadingSpinner /> : <><RocketLaunchIcon className="w-5 h-5"/> توليد الخطة</>}
                        </button>
                        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                    </div>
                </div>

                <div className="lg:col-span-8">
                    {plan && (
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden flex flex-col h-full shadow-2xl">
                            <div className="flex border-b border-gray-700 bg-gray-900/50">
                                <button onClick={() => setActiveTab('plan')} className={`flex-1 py-4 font-bold ${activeTab === 'plan' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}>الاستراتيجية</button>
                                <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-4 font-bold ${activeTab === 'schedule' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}>الجدول</button>
                                <button onClick={() => setActiveTab('dryrun')} className={`flex-1 py-4 font-bold ${activeTab === 'dryrun' ? 'text-green-400 border-b-2 border-green-500' : 'text-gray-400'}`}>API Logs (Dry Run)</button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[600px]">
                                {activeTab === 'plan' && (
                                    <div className="space-y-6">
                                        <p className="text-gray-300 bg-gray-900 p-5 rounded-xl">{plan.strategy_overview}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {plan.keywords.map((kw, i) => <span key={i} className="bg-blue-900/20 text-blue-300 px-3 py-1 rounded-full">#{kw}</span>)}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'schedule' && (
                                    <div className="space-y-4">
                                        {plan.schedule.map((item, i) => (
                                            <div key={i} className="bg-gray-900 p-4 rounded-xl flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-red-400">{item.platform} - {item.time}</div>
                                                    <p className="text-gray-300 text-sm mt-1">{item.content}</p>
                                                </div>
                                                <button onClick={() => runDryRun(item.platform, item.content)} className="px-4 py-2 bg-gray-700 hover:bg-green-600 rounded-lg text-xs font-bold transition-colors">Test Publish</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'dryrun' && (
                                    <div className="bg-black p-4 rounded-xl font-mono text-xs text-green-400 h-full overflow-auto">
                                        {dryRunLogs.length === 0 ? <p className="opacity-50">// No API calls simulated yet. Click 'Test Publish' in Schedule tab.</p> : dryRunLogs.map((log, i) => (
                                            <pre key={i} className="mb-4 whitespace-pre-wrap border-b border-green-900 pb-2">{log}</pre>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketingMaestro;