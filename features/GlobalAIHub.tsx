
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  CpuChipIcon, 
  SparklesIcon, 
  GlobeAltIcon, 
  CommandLineIcon, 
  BoltIcon, 
  MagnifyingGlassIcon,
  RectangleGroupIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

const AI_CATEGORIES = [
    { id: 'vision', name: 'الذكاء البصري', icon: <VideoCameraIcon className="w-6 h-6"/>, color: 'from-purple-600 to-blue-500' },
    { id: 'logic', name: 'المنطق والبرمجة', icon: <CommandLineIcon className="w-6 h-6"/>, color: 'from-blue-600 to-cyan-500' },
    { id: 'automation', name: 'الأتمتة والسيو', icon: <BoltIcon className="w-6 h-6"/>, color: 'from-orange-600 to-red-500' },
    { id: 'audio', name: 'الصوت والترجمة', icon: <MusicalNoteIcon className="w-6 h-6"/>, color: 'from-emerald-600 to-teal-500' },
];

export const GlobalAIHub: React.FC = () => {
    const [search, setSearch] = useState('');
    const [tools, setTools] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGlobalTools = async () => {
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a comprehensive directory of the top 20 AI tools/technologies in the world (OpenAI, Gemini, Midjourney, Anthropic, etc.) for marketing, automation, and engineering. 
            Format as JSON: [{"name": "", "category": "vision/logic/automation/audio", "description": "", "link": "", "impact": "High"}]`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            setTools(JSON.parse(response.text || '[]'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGlobalTools(); }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 font-sans pb-32" dir="rtl">
            {/* Header Site-style */}
            <header className="relative bg-gradient-to-br from-blue-900/40 to-black p-12 md:p-20 rounded-[4rem] border border-gray-800 overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
                <div className="relative z-10 space-y-6">
                    <div className="bg-blue-600/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/30 animate-pulse">
                        <RectangleGroupIcon className="w-12 h-12 text-blue-500" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">دليل الذكاء <span className="text-blue-600">العالمي</span></h1>
                    <p className="text-gray-400 text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed italic">
                        "كل ما يحتاجه الإمبراطور للسيطرة على السوق العالمي في واجهة واحدة"
                    </p>
                    <div className="flex max-w-2xl mx-auto relative group mt-10">
                        <input 
                            type="text" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-black/60 border-2 border-gray-800 rounded-3xl px-12 py-5 text-white focus:border-blue-600 outline-none transition-all shadow-inner text-xl"
                            placeholder="ابحث عن أداة، تقنية، أو بنية تحتية..."
                        />
                        <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                </div>
            </header>

            {/* Categories Scrollable Site Section */}
            <section className="space-y-10">
                <h2 className="text-3xl font-black text-white pr-4 border-r-4 border-blue-600">التصنيفات السيادية</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {AI_CATEGORIES.map(cat => (
                        <div key={cat.id} className={`bg-gradient-to-br ${cat.color} p-8 rounded-[3rem] shadow-xl hover:scale-105 transition-transform cursor-pointer group`}>
                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">{cat.icon}</div>
                            <h3 className="text-xl font-black text-white">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tools Nexus Grid */}
            <section className="space-y-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-white pr-4 border-r-4 border-cyan-500">مصفوفة الأدوات المتصلة</h2>
                    <button onClick={fetchGlobalTools} className="text-[10px] font-black uppercase text-blue-500 border border-blue-500/30 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">تحديث المصفوفة</button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-40 animate-pulse">
                        <LoadingSpinner />
                        <p className="text-blue-500 font-black tracking-widest mt-6">جاري الاتصال بقواعد البيانات العالمية...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((tool, i) => (
                            <div key={i} className="bg-gray-900/40 border border-gray-800 p-8 rounded-[3.5rem] hover:border-blue-600 transition-all group relative overflow-hidden flex flex-col h-full shadow-2xl">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-[50px] group-hover:bg-blue-600/10 transition-colors"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[10px] font-black text-blue-500 bg-blue-950/20 px-4 py-1 rounded-full border border-blue-900/30">{tool.category}</div>
                                    <ChartBarIcon className="w-5 h-5 text-gray-700" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">{tool.name}</h3>
                                <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8 flex-1">{tool.description}</p>
                                <button className="w-full py-4 bg-gray-800 hover:bg-blue-600 text-white rounded-2xl font-black transition-all group-hover:shadow-2xl">فتح الأداة الآن</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Documentation Site Section */}
            <section className="bg-gray-900/20 p-12 md:p-20 rounded-[5rem] border border-gray-800/50 space-y-12">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black text-white italic">دليل الاستخدام <span className="text-blue-500">للإمبراطور</span></h2>
                    <p className="text-gray-500 font-bold text-lg leading-loose">
                        نظام ZOOKA ليس أداة، بل هو استراتيجية. استخدم دليل الذكاء العالمي للبحث عن أفضل تقنيات الأتمتة لشركتك، ثم اطلب من "المهندس المعماري" دمجها في نظامك الخاص.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { t: "الخطوة 01", d: "حدد الأداة المناسبة لهدفك السوقي من المصفوفة أعلاه." },
                        { t: "الخطوة 02", d: "انسخ رابط أو اسم التقنية وتوجه للمهندس المعماري." },
                        { t: "الخطوة 03", d: "أعطِ أمراً بالنشر الآلي لبنية تحتية تدعم هذه التقنية." }
                    ].map((step, i) => (
                        <div key={i} className="bg-black/40 p-8 rounded-[3rem] border border-gray-800 text-center space-y-4">
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{step.t}</div>
                            <p className="text-gray-300 font-bold leading-relaxed">{step.d}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GlobalAIHub;
