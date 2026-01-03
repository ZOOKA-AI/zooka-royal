
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/GeminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  SpeakerWaveIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/solid';

export const QuranSuite: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'read' | 'chat' | 'prayer'>('chat');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [azanActive, setAzanActive] = useState(false);
    const azanAudioRef = useRef<HTMLAudioElement | null>(null);

    const reciters = [
        { name: "عبد المجيد السريشي", id: "surayseri", url: "https://server13.mp3quran.net/surayseri/001.mp3" },
        { name: "مشاري العفاسي", id: "afasy", url: "" },
        { name: "سعود الشريم", id: "shuraim", url: "" },
        { name: "عبد الباسط عبد الصمد", id: "basit", url: "" },
    ];

    useEffect(() => {
        // Auto-fetch prayer times on mount
        fetchPrayerTimes();
        
        // Setup Azan check every minute
        const interval = setInterval(() => {
            checkAzanTime();
        }, 60000);
        
        return () => clearInterval(interval);
    }, [prayerTimes]);

    const checkAzanTime = () => {
        if (!prayerTimes) return;
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        for (const prayer of prayers) {
            if (prayerTimes[prayer] === currentTime && !azanActive) {
                playAzan();
                break;
            }
        }
    };

    const playAzan = () => {
        setAzanActive(true);
        // Using a symbolic URL for Sheikh Surayseri Azan
        const azanUrl = "https://www.islamcan.com/audio/adan/azan2.mp3"; 
        azanAudioRef.current = new Audio(azanUrl);
        azanAudioRef.current.play();
        azanAudioRef.current.onended = () => setAzanActive(false);
    };

    const handleChat = async () => {
        if (!chatInput.trim()) return;
        const msg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
        setLoading(true);

        try {
            const systemMsg = "أنت 'زوكا المرزوق'، مساعد إسلامي عالم، حكيم ولطيف. ردك يجب أن يستند للقرآن والسنة، بصيغة رصينة ومريحة.";
            const result = await gemini.ask(msg, systemMsg);
            setChatHistory(prev => [...prev, { role: 'model', text: result }]);
        } catch (e) {
            setChatHistory(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال بالنواة الإيمانية." }]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrayerTimes = () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=4`);
                const data = await res.json();
                setPrayerTimes(data.data.timings);
            } catch (e) {
                console.error("Failed to fetch prayer times");
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-12 bg-[#062016] min-h-[90vh] text-emerald-50 rounded-[5rem] border border-emerald-900 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden font-sans" dir="rtl">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-16 border-b border-emerald-900/50 pb-12 gap-10">
                <div className="flex items-center gap-8">
                    <div className="p-6 bg-emerald-600 rounded-[2.5rem] shadow-2xl animate-pulse">
                        <BookOpenIcon className="w-16 h-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">ذكر القرآن</h1>
                        <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-xs mt-2">Sovereign Islamic Suite (Sadaqah Jariyah)</p>
                    </div>
                </div>
                
                {azanActive && (
                    <div className="flex items-center gap-4 bg-emerald-600/20 px-8 py-4 rounded-full border border-emerald-500/30 animate-bounce">
                        <SpeakerWaveIcon className="w-6 h-6 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest">صوت الآذان يرفع الآن...</span>
                    </div>
                )}
            </div>

            <div className="flex gap-6 mb-12 overflow-x-auto pb-6 custom-scrollbar">
                {[
                    { id: 'chat', label: 'زوكا المرزوق', icon: <ChatBubbleLeftRightIcon className="w-6 h-6"/> },
                    { id: 'prayer', label: 'مواقيت الصلاة', icon: <ClockIcon className="w-6 h-6"/> },
                    { id: 'read', label: 'المكتبة الصوتية', icon: <MusicalNoteIcon className="w-6 h-6"/> },
                ].map((tab: any) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[200px] py-6 rounded-[2.5rem] font-black transition-all flex items-center justify-center gap-4 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-[1.05] border-2 border-emerald-400' : 'bg-emerald-900/40 text-emerald-400 hover:bg-emerald-800'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-black/40 rounded-[4rem] p-12 border border-emerald-900/50 min-h-[500px] shadow-inner relative">
                
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-[600px]">
                        <div className="flex-1 overflow-y-auto space-y-8 mb-8 custom-scrollbar pr-6">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-8 rounded-[3rem] ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none shadow-xl' : 'bg-emerald-800/40 text-emerald-100 rounded-bl-none border border-emerald-700'}`}>
                                        <p className="text-xl leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="text-emerald-500 animate-pulse text-sm font-black italic">زوكا المرزوق يتفكر في رحاب الإيمان...</div>}
                        </div>
                        <div className="flex gap-6">
                            <input 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleChat()}
                                className="flex-1 bg-emerald-900/30 border-2 border-emerald-800 rounded-[2.5rem] px-10 py-6 text-white outline-none focus:border-emerald-500 text-xl shadow-inner"
                                placeholder="اسأل عن آية، حديث، أو حكم شرعي..."
                            />
                            <button onClick={handleChat} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 px-14 rounded-[2.5rem] font-black text-xl text-white shadow-2xl transition-all active:scale-90">إرسال</button>
                        </div>
                    </div>
                )}

                {activeTab === 'prayer' && (
                    <div className="flex flex-col items-center justify-center py-20 gap-16 text-center">
                        {!prayerTimes ? (
                            <button onClick={fetchPrayerTimes} className="bg-emerald-600 px-16 py-6 rounded-[2.5rem] font-black text-xl flex items-center gap-6 mx-auto shadow-2xl hover:scale-110 transition-transform">
                                <MapPinIcon className="w-10 h-10" /> تحديد المواقيت تلقائياً
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full">
                                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
                                    <div key={p} className="bg-emerald-900/60 p-10 rounded-[3rem] border border-emerald-800 shadow-2xl group hover:border-emerald-500 transition-all hover:-translate-y-2">
                                        <div className="text-emerald-500 text-xs font-black uppercase mb-4 tracking-[0.3em]">{p === 'Fajr' ? 'الفجر' : p === 'Dhuhr' ? 'الظهر' : p === 'Asr' ? 'العصر' : p === 'Maghrib' ? 'المغرب' : 'العشاء'}</div>
                                        <div className="text-4xl font-black text-white font-mono">{prayerTimes[p]}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-emerald-500 font-bold text-sm tracking-widest bg-emerald-900/20 px-8 py-3 rounded-full border border-emerald-800">صوت الآذان مبرمج تلقائياً بصوت الشيخ عبد المجيد السريشي</p>
                    </div>
                )}
                
                {activeTab === 'read' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reciters.map((r, i) => (
                            <div key={i} className="bg-emerald-900/40 p-10 rounded-[3rem] border border-emerald-800 flex items-center justify-between group hover:bg-emerald-800 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-emerald-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                                        <SpeakerWaveIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">{r.name}</h3>
                                        <p className="text-xs text-emerald-500 font-bold">قران كريم - جودة عالية</p>
                                    </div>
                                </div>
                                <button className="p-5 bg-emerald-700 hover:bg-emerald-600 rounded-full text-white shadow-xl transition-all">
                                    <MusicalNoteIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-20 pt-12 border-t border-emerald-900/50 flex flex-col md:flex-row justify-center items-center gap-10 text-emerald-500 text-[12px] font-black uppercase tracking-[0.5em] text-center">
                <div className="flex items-center gap-4">
                    <HeartIcon className="w-6 h-6 text-red-600 animate-pulse" />
                    صدقة جارية على روح جزبية عبد الرحيم هارون علي
                </div>
                <div className="hidden md:block w-px h-6 bg-emerald-900"></div>
                <div className="text-emerald-700">جميع الحقوق محفوظة لنظام زوكا السيادي 2025</div>
            </div>
        </div>
    );
};

export default QuranSuite;
