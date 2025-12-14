import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { decode, decodeAudioData } from '../utils';
import { 
  BookOpenIcon, 
  SpeakerWaveIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon, 
  PlayIcon, 
  PauseIcon, 
  RadioIcon,
  HeartIcon,
  ShareIcon,
  MicrophoneIcon, 
  MegaphoneIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  SunIcon,
  MoonIcon,
  FaceSmileIcon,
  StarIcon,
  StopCircleIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/solid';

type Tab = 'read' | 'audio' | 'chat' | 'kids' | 'radio' | 'prayer';
type KidsMode = 'story' | 'tahfiz' | 'fun';

interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    date: {
        hijri: { day: string; month: { ar: string }; year: string };
        gregorian: { date: string; weekday: { en: string } };
    };
}

// Mock Data for Quran
const SURAHS = [
    { id: 1, name: "الفاتحة", verses: 7, type: "مكية" },
    { id: 2, name: "البقرة", verses: 286, type: "مدنية" },
    { id: 3, name: "آل عمران", verses: 200, type: "مدنية" },
    { id: 18, name: "الكهف", verses: 110, type: "مكية" },
    { id: 36, name: "يس", verses: 83, type: "مكية" },
    { id: 55, name: "الرحمن", verses: 78, type: "مدنية" },
    { id: 67, name: "الملك", verses: 30, type: "مكية" },
    { id: 112, name: "الإخلاص", verses: 4, type: "مكية" },
    { id: 113, name: "الفلق", verses: 5, type: "مكية" },
    { id: 114, name: "الناس", verses: 6, type: "مكية" },
];

const RECITERS = [
    { id: 'hussary', name: "محمود خليل الحصري", url: "https://server13.mp3quran.net/husr/" },
    { id: 'abdulbasit', name: "عبد الباسط عبد الصمد", url: "https://server7.mp3quran.net/basit/" },
    { id: 'minshawi', name: "محمد صديق المنشاوي", url: "https://server10.mp3quran.net/minsh/" },
    { id: 'sudais', name: "عبد الرحمن السديس", url: "https://server11.mp3quran.net/sds/" },
    { id: 'maher', name: "ماهر المعيقلي", url: "https://server12.mp3quran.net/maher/" },
    { id: 'ajamy', name: "أحمد العجمي", url: "https://server10.mp3quran.net/ajm/" },
    { id: 'fares', name: "فارس عباد", url: "https://server8.mp3quran.net/frs_a/" },
    { id: 'meshary', name: "مشاري العفاسي", url: "https://server8.mp3quran.net/afs/" },
];

const RADIO_STATIONS = [
    { name: "إذاعة القرآن الكريم - القاهرة", url: "https://n0a.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABjQ5y3_wA5p9f6c9_9Q" },
    { name: "إذاعة القرآن الكريم - السعودية", url: "https://stream.radiojar.com/4wqre23fytzuv" },
    { name: "إذاعة الشيخ عبد الباسط", url: "https://backup.qurarradio.com/basit" },
];

const QuranSuite: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('read');
    
    // Audio State
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackName, setCurrentTrackName] = useState('');
    const [adhanPlaying, setAdhanPlaying] = useState(false);
    const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
    const [chatLoading, setChatLoading] = useState(false);

    // --- Kids State (Enhanced) ---
    const [kidsMode, setKidsMode] = useState<KidsMode>('fun');
    const [kidsInput, setKidsInput] = useState('');
    const [kidsResponse, setKidsResponse] = useState('أهلاً يا صديقي! أنا زوكا. هل نلعب أم نحفظ القرآن؟ 🎈');
    const [isKidsSpeaking, setIsKidsSpeaking] = useState(false);
    const [isZookaTalking, setIsZookaTalking] = useState(false);
    const [kidsStars, setKidsStars] = useState(0);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Reader State
    const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
    const [surahText, setSurahText] = useState<string>('');
    const [loadingSurah, setLoadingSurah] = useState(false);

    // Prayer Times State
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
    const [loadingPrayer, setLoadingPrayer] = useState(false);
    const [locationError, setLocationError] = useState('');

    // --- Audio Player Logic ---
    const playTrack = (url: string, name: string) => {
        if (adhanAudioRef.current) {
            adhanAudioRef.current.pause();
            setAdhanPlaying(false);
        }
        if (currentAudio) {
            if (currentAudio.src === url) {
                if (isPlaying) {
                    currentAudio.pause();
                    setIsPlaying(false);
                } else {
                    currentAudio.play();
                    setIsPlaying(true);
                }
                return;
            } else {
                currentAudio.pause();
            }
        }
        const audio = new Audio(url);
        audio.onended = () => setIsPlaying(false);
        audio.play().catch(e => console.error("Playback error", e));
        setCurrentAudio(audio);
        setIsPlaying(true);
        setCurrentTrackName(name);
    };

    const stopAllAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(false);
        }
        if (adhanAudioRef.current) {
            adhanAudioRef.current.pause();
            setAdhanPlaying(false);
        }
    };

    // --- Adhan Logic ---
    const toggleAdhan = () => {
        if (adhanPlaying && adhanAudioRef.current) {
            adhanAudioRef.current.pause();
            setAdhanPlaying(false);
        } else {
            if (currentAudio) {
                currentAudio.pause();
                setIsPlaying(false);
            }
            const adhanUrl = "https://www.islamcan.com/audio/adhan/azan2.mp3"; 
            const audio = new Audio(adhanUrl);
            audio.onended = () => setAdhanPlaying(false);
            audio.play();
            adhanAudioRef.current = audio;
            setAdhanPlaying(true);
        }
    };

    // --- Quran Reader Logic ---
    const fetchSurah = async (id: number, name: string) => {
        setSelectedSurah(id);
        setLoadingSurah(true);
        setSurahText('');
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const prompt = `Write the full Arabic text of Surat ${name} (Surah #${id}) with Tashkeel. Just the verses directly.`;
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setSurahText(result.text || "تعذر تحميل السورة.");
        } catch (e) {
            setSurahText("حدث خطأ في تحميل السورة.");
        } finally {
            setLoadingSurah(false);
        }
    };

    // --- Islamic Chatbot Logic ---
    const handleChat = async () => {
        if (!chatInput.trim()) return;
        setChatLoading(true);
        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, {role: 'user', text: userMsg}]);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const prompt = `
                أنت "زوكا المرزوق"، مساعد إسلامي ذكي وخلوق.
                مهمتك: الإجابة على الأسئلة الدينية، الفتاوى (مع ذكر "الله أعلم").
                المرجعية: القرآن الكريم والسنة النبوية الصحيحة.
                السؤال: ${userMsg}
            `;
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setChatHistory(prev => [...prev, {role: 'model', text: result.text || ''}]);
        } catch (e) {
            setChatHistory(prev => [...prev, {role: 'model', text: "حدث خطأ في الاتصال."}]);
        } finally {
            setChatLoading(false);
        }
    };

    // --- KID'S VOICE & INTERACTION LOGIC (ZOOKA) ---
    
    // 1. Speak (TTS)
    const zookaSpeak = async (text: string) => {
        setIsZookaTalking(true);
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Kore is usually clearer
                    },
                },
            });
            
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                audioContextRef.current = ctx;
                const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => setIsZookaTalking(false);
                source.start();
            } else {
                setIsZookaTalking(false);
            }
        } catch (error) {
            console.error("Zooka TTS Error", error);
            setIsZookaTalking(false);
        }
    };

    // 2. Process Input (Brain)
    const processChildInput = async (input: string) => {
        setIsKidsSpeaking(false);
        if (!input.trim()) return;

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            
            let systemPrompt = "";
            if (kidsMode === 'tahfiz') {
                systemPrompt = `
                    أنت "الشيخ زوكا"، معلم قرآن للأطفال. 
                    الطفل يحاول تسميع القرآن. استمع للنص: "${input}".
                    1. إذا كانت الآية صحيحة، قل "ممتاز!" وشجعه.
                    2. إذا كانت خاطئة، صححها له بلطف شديد، قل: "اقتربت يا بطل، لكن الصحيح هو...".
                    3. تكلم بالعربية البسيطة والمرحة.
                    4. لا تكن طويلاً.
                `;
            } else if (kidsMode === 'story') {
                systemPrompt = `
                    أنت "زوكا الحكواتي". الطفل قال: "${input}".
                    أكمل القصة أو احكِ قصة قصيرة جداً (3 جمل) عن هذا الموضوع.
                    استخدم مؤثرات صوتية في النص مثل (هووو، طراااخ).
                    اجعلها مضحكة وفيها عبرة.
                `;
            } else {
                // Fun Mode
                systemPrompt = `
                    أنت "زوكا المضحك". صديق الأطفال.
                    الطفل قال: "${input}".
                    رد عليه بنكتة، أو لغز، أو كلام مضحك.
                    كن لطيفاً جداً ونادِهِ "يا بطل" أو "يا أميرتي".
                `;
            }

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: systemPrompt
            });

            const reply = result.text || "لم أسمعك جيداً يا بطل، قل مرة أخرى؟";
            setKidsResponse(reply);
            
            // If praise found, give stars
            if (reply.includes("ممتاز") || reply.includes("أحسنت") || reply.includes("شاطر")) {
                setKidsStars(prev => prev + 1);
            }

            // Speak result
            zookaSpeak(reply);

        } catch (e) {
            console.error(e);
            setKidsResponse("حدث خطأ في الاتصال يا صديقي.");
        }
    };

    // 3. Listen (STT)
    const startListeningToKid = () => {
        // Stop Zooka if talking
        if (audioContextRef.current) audioContextRef.current.close();
        setIsZookaTalking(false);

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("المتصفح لا يدعم الميكروفون.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        
        recognition.onstart = () => setIsKidsSpeaking(true);
        recognition.onend = () => setIsKidsSpeaking(false);
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setKidsInput(text);
            processChildInput(text);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // --- Prayer Times Logic ---
    const fetchPrayerTimes = () => {
        setLoadingPrayer(true);
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError("المتصفح لا يدعم تحديد الموقع.");
            setLoadingPrayer(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
                const data = await response.json();
                if (data.code === 200) {
                    setPrayerTimes({
                        Fajr: data.data.timings.Fajr,
                        Sunrise: data.data.timings.Sunrise,
                        Dhuhr: data.data.timings.Dhuhr,
                        Asr: data.data.timings.Asr,
                        Maghrib: data.data.timings.Maghrib,
                        Isha: data.data.timings.Isha,
                        date: data.data.date
                    });
                }
            } catch (error) {
                setLocationError("حدث خطأ في الاتصال بالشبكة.");
            } finally {
                setLoadingPrayer(false);
            }
        }, (err) => {
            setLocationError("يرجى السماح بصلاحية الموقع.");
            setLoadingPrayer(false);
        });
    };

    useEffect(() => {
        if (activeTab === 'prayer' && !prayerTimes) fetchPrayerTimes();
    }, [activeTab]);

    const shareApp = () => {
        const text = "تطبيق ذكر القرآن الكريم - مصحف، تلاوات، وقصص أطفال. صدقة جارية. جربه الآن!";
        if (navigator.share) {
            navigator.share({ title: 'ذكر القرآن الكريم', text: text, url: window.location.href });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-emerald-950 min-h-[90vh] text-emerald-50 rounded-2xl border border-emerald-800 shadow-2xl relative overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-6 border-b border-emerald-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/30">
                        <BookOpenIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">ذكر القرآن الكريم</h1>
                        <p className="text-emerald-300 text-sm">مصحف، تلاوات، فتاوى، وركن للأطفال (صدقة جارية)</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <button 
                        onClick={toggleAdhan}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                            adhanPlaying 
                            ? 'bg-yellow-500 text-black animate-pulse shadow-lg shadow-yellow-500/50' 
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                        }`}
                    >
                        <MegaphoneIcon className="w-5 h-5" />
                        {adhanPlaying ? 'إيقاف الأذان' : 'أذان السريحي'}
                    </button>
                    <button 
                        onClick={shareApp}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-xl flex items-center gap-2 transition-colors"
                    >
                        <ShareIcon className="w-5 h-5" /> نشر الخير
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-thin scrollbar-thumb-emerald-700">
                {[
                    { id: 'read', label: 'المصحف والتفسير', icon: <BookOpenIcon className="w-5 h-5"/> },
                    { id: 'audio', label: 'المقرأة الصوتية', icon: <SpeakerWaveIcon className="w-5 h-5"/> },
                    { id: 'prayer', label: 'مواقيت الصلاة', icon: <ClockIcon className="w-5 h-5"/> },
                    { id: 'chat', label: 'زوكا المرزوق (فتاوى)', icon: <ChatBubbleLeftRightIcon className="w-5 h-5"/> },
                    { id: 'kids', label: 'ركن الأطفال', icon: <SparklesIcon className="w-5 h-5 text-yellow-400"/> },
                    { id: 'radio', label: 'إذاعة القرآن', icon: <RadioIcon className="w-5 h-5"/> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                            ? 'bg-emerald-500 text-white font-bold shadow-lg' 
                            : 'bg-emerald-900/50 text-emerald-200 hover:bg-emerald-800'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-emerald-900/30 rounded-2xl p-6 min-h-[500px] border border-emerald-800/50 relative">
                
                {/* 1. READ QURAN */}
                {activeTab === 'read' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1 bg-emerald-900/50 rounded-xl p-4 h-[600px] overflow-y-auto border border-emerald-800">
                            <h3 className="text-emerald-300 font-bold mb-4 text-center border-b border-emerald-700 pb-2">فهرس السور</h3>
                            <div className="space-y-2">
                                {SURAHS.map(surah => (
                                    <button
                                        key={surah.id}
                                        onClick={() => fetchSurah(surah.id, surah.name)}
                                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors ${
                                            selectedSurah === surah.id ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-800 text-emerald-100'
                                        }`}
                                    >
                                        <span className="font-bold">{surah.id}. {surah.name}</span>
                                        <span className="text-xs opacity-70">{surah.type} | {surah.verses}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-3 bg-[#fff8dc] text-black rounded-xl p-8 h-[600px] overflow-y-auto border-4 border-double border-emerald-700 relative shadow-inner">
                            {loadingSurah ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : surahText ? (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-6 font-serif text-emerald-900 border-b-2 border-emerald-900/20 pb-4 inline-block">
                                        سورة {SURAHS.find(s => s.id === selectedSurah)?.name}
                                    </h2>
                                    <div className="text-2xl leading-[2.5] font-serif text-justify" dir="rtl">
                                        {surahText}
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-emerald-900/20 text-center">
                                         <p className="text-sm text-gray-600">صدق الله العظيم</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-emerald-900/50">
                                    <BookOpenIcon className="w-24 h-24 mb-4 opacity-20" />
                                    <p className="text-xl font-serif">اختر سورة من القائمة للقراءة</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. AUDIO RECITER */}
                {activeTab === 'audio' && (
                    <div>
                        <div className="flex justify-between items-center mb-6 bg-emerald-800 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                {isPlaying ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> : <SpeakerWaveIcon className="w-8 h-8" />}
                                <div>
                                    <h3 className="font-bold text-white">المشغل الصوتي</h3>
                                    <p className="text-xs text-emerald-300">{isPlaying ? `جاري التشغيل: ${currentTrackName}` : 'متوقف'}</p>
                                </div>
                            </div>
                            {isPlaying && (
                                <button onClick={stopAllAudio} className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                    إيقاف
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {RECITERS.map(reciter => (
                                <div key={reciter.id} className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700 hover:border-emerald-500 transition-all group">
                                    <div className="w-16 h-16 bg-emerald-800 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                        <MicrophoneIcon className="w-8 h-8 text-emerald-200" />
                                    </div>
                                    <h3 className="text-center font-bold text-emerald-100 mb-2 truncate">{reciter.name}</h3>
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => playTrack(`${reciter.url}001.mp3`, `الفاتحة - ${reciter.name}`)}
                                            className="p-2 bg-emerald-600 rounded-full hover:bg-emerald-500 text-white"
                                            title="تشغيل الفاتحة"
                                        >
                                            <PlayIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => playTrack(`${reciter.url}002.mp3`, `البقرة - ${reciter.name}`)}
                                            className="p-2 bg-emerald-800 rounded-full hover:bg-emerald-700 text-white"
                                            title="تشغيل البقرة"
                                        >
                                            <span className="text-xs font-bold">002</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. PRAYER TIMES */}
                {activeTab === 'prayer' && (
                    <div className="text-center">
                         {loadingPrayer ? (
                             <div className="py-20 flex flex-col items-center justify-center">
                                 <LoadingSpinner />
                                 <p className="mt-4 text-emerald-400">جاري تحديد موقعك وحساب المواقيت...</p>
                             </div>
                         ) : locationError ? (
                             <div className="py-10 bg-red-900/50 rounded-xl border border-red-700 text-red-200">
                                 <MapPinIcon className="w-12 h-12 mx-auto mb-4" />
                                 <p className="text-lg mb-4">{locationError}</p>
                                 <button onClick={fetchPrayerTimes} className="px-6 py-2 bg-red-700 rounded-lg hover:bg-red-600">محاولة مرة أخرى</button>
                             </div>
                         ) : prayerTimes ? (
                             <div className="animate-fade-in-up">
                                 <div className="bg-emerald-800/50 p-6 rounded-2xl border border-emerald-600 mb-8 inline-block shadow-lg">
                                     <div className="flex flex-col md:flex-row items-center gap-8">
                                         <div className="text-center">
                                             <div className="text-sm text-emerald-400 mb-1">التاريخ الهجري</div>
                                             <div className="text-2xl font-bold font-serif">
                                                 {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.ar} {prayerTimes.date.hijri.year}
                                             </div>
                                         </div>
                                         <div className="h-10 w-px bg-emerald-600 hidden md:block"></div>
                                         <div className="text-center">
                                             <div className="text-sm text-emerald-400 mb-1">التاريخ الميلادي</div>
                                             <div className="text-xl font-bold font-mono">
                                                 {prayerTimes.date.gregorian.date} ({prayerTimes.date.gregorian.weekday.en})
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
                                     {[
                                         { name: 'الفجر', time: prayerTimes.Fajr, icon: <MoonIcon className="w-6 h-6"/> },
                                         { name: 'الشروق', time: prayerTimes.Sunrise, icon: <SunIcon className="w-6 h-6 text-yellow-400"/> },
                                         { name: 'الظهر', time: prayerTimes.Dhuhr, icon: <SunIcon className="w-6 h-6"/> },
                                         { name: 'العصر', time: prayerTimes.Asr, icon: <SunIcon className="w-6 h-6 opacity-75"/> },
                                         { name: 'المغرب', time: prayerTimes.Maghrib, icon: <MoonIcon className="w-6 h-6 opacity-75"/> },
                                         { name: 'العشاء', time: prayerTimes.Isha, icon: <MoonIcon className="w-6 h-6"/> },
                                     ].map((p, i) => (
                                         <div key={i} className="bg-emerald-900 p-4 rounded-xl border border-emerald-700 hover:bg-emerald-800 transition-all hover:scale-105 shadow-md group">
                                             <div className="text-emerald-400 mb-2 group-hover:text-emerald-200">{p.icon}</div>
                                             <div className="text-sm text-gray-400 mb-1">{p.name}</div>
                                             <div className="text-xl font-bold font-mono text-white">{p.time.split(' ')[0]}</div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ) : null}
                    </div>
                )}

                {/* 4. ISLAMIC CHAT */}
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-[600px]">
                        <div className="flex-1 bg-emerald-900/50 rounded-xl p-4 overflow-y-auto mb-4 border border-emerald-800 space-y-4">
                            {chatHistory.length === 0 && (
                                <div className="text-center text-emerald-500/50 mt-20">
                                    <AcademicCapIcon className="w-20 h-20 mx-auto mb-4" />
                                    <p className="text-lg">أنا زوكا المرزوق، مساعدك الإسلامي.</p>
                                    <p className="text-sm">اسألني عن الفقه، التفسير، أو قصص الأنبياء.</p>
                                </div>
                            )}
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                                        msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-br-none' 
                                        : 'bg-emerald-800 text-emerald-100 rounded-bl-none border border-emerald-700'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {chatLoading && <div className="text-emerald-400 text-center animate-pulse">جاري البحث في المصادر...</div>}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                                placeholder="اكتب سؤالك هنا (مثال: ما حكم صلاة الضحى؟)"
                                className="flex-1 p-4 bg-emerald-900 border border-emerald-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-emerald-700"
                            />
                            <button 
                                onClick={handleChat}
                                disabled={chatLoading}
                                className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg"
                            >
                                إرسال
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. KIDS CORNER (UPDATED & INTERACTIVE) */}
                {activeTab === 'kids' && (
                    <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
                        
                        {/* Kid Modes */}
                        <div className="flex gap-4 mb-4">
                            <button 
                                onClick={() => setKidsMode('fun')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${kidsMode === 'fun' ? 'bg-yellow-400 text-black scale-110 shadow-lg' : 'bg-emerald-800 text-emerald-200'}`}
                            >
                                🤪 هزار ولعب
                            </button>
                            <button 
                                onClick={() => setKidsMode('story')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${kidsMode === 'story' ? 'bg-blue-400 text-black scale-110 shadow-lg' : 'bg-emerald-800 text-emerald-200'}`}
                            >
                                📖 حكايات
                            </button>
                            <button 
                                onClick={() => setKidsMode('tahfiz')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${kidsMode === 'tahfiz' ? 'bg-green-400 text-black scale-110 shadow-lg' : 'bg-emerald-800 text-emerald-200'}`}
                            >
                                🕋 تحفيظ
                            </button>
                        </div>

                        {/* Zooka Character Animation */}
                        <div className={`relative w-48 h-48 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-green-400 shadow-2xl ${isZookaTalking ? 'animate-bounce' : ''}`}>
                            <FaceSmileIcon className={`w-32 h-32 text-white ${isZookaTalking ? 'animate-pulse' : ''}`} />
                            {/* Stars Badge */}
                            <div className="absolute -top-2 -right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg transform rotate-12">
                                <StarIcon className="w-4 h-4 text-white" /> {kidsStars}
                            </div>
                        </div>

                        {/* Chat Bubble */}
                        <div className="bg-white text-emerald-900 p-6 rounded-2xl border-4 border-yellow-400 shadow-xl max-w-lg w-full relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-yellow-400"></div>
                            <p className="text-xl font-bold leading-relaxed">{kidsResponse}</p>
                        </div>

                        {/* Interaction Controls */}
                        <div className="w-full max-w-md space-y-4">
                            {/* User input display */}
                            {kidsInput && (
                                <div className="text-emerald-300 text-sm bg-emerald-900/50 p-2 rounded-lg inline-block">
                                    أنت قلت: "{kidsInput}"
                                </div>
                            )}

                            <button 
                                onMouseDown={startListeningToKid}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-4 ${
                                    isKidsSpeaking 
                                    ? 'bg-red-500 border-red-300 animate-pulse' 
                                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 border-white'
                                }`}
                            >
                                {isKidsSpeaking ? <StopCircleIcon className="w-12 h-12 text-white" /> : <MicrophoneIcon className="w-12 h-12 text-white" />}
                            </button>
                            
                            <p className="text-emerald-400 text-sm font-bold">
                                {isKidsSpeaking ? 'زوكا يسمعك الآن...' : 'اضغط باستمرار للتحدث مع زوكا'}
                            </p>
                        </div>
                    </div>
                )}

                {/* 6. RADIO */}
                {activeTab === 'radio' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {RADIO_STATIONS.map((station, i) => (
                            <div key={i} className="bg-emerald-800 p-6 rounded-2xl border border-emerald-600 text-center hover:bg-emerald-700 transition-colors">
                                <div className="w-20 h-20 bg-emerald-900 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                                    <RadioIcon className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{station.name}</h3>
                                <button 
                                    onClick={() => playTrack(station.url, station.name)}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                                >
                                    <PlayIcon className="w-5 h-5" /> تشغيل البث
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Quote */}
                <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none opacity-30">
                    <p className="text-sm font-serif">"وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"</p>
                </div>
            </div>

            {/* Charity Footer */}
            <div className="bg-emerald-950 p-4 text-center border-t border-emerald-900 mt-6">
                 <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                     <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
                     <span>هذا العمل صدقة جارية على روح جزبية عبد الرحيم هارون علي - رحمها الله</span>
                 </div>
            </div>
        </div>
    );
};

export default QuranSuite;