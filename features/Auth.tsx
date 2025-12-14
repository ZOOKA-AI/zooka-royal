import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  FingerPrintIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  ArrowRightOnRectangleIcon, 
  KeyIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon, 
  CpuChipIcon, 
  VideoCameraIcon, 
  GlobeAltIcon, 
  CodeBracketIcon, 
  PaperAirplaneIcon, 
  BuildingLibraryIcon,
  LockClosedIcon
} from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SystemInfo } from './SystemInfo';

// Brand Configuration
const BRAND_INFO = {
    website: "https://royalcleanuae.com/",
    system: "https://zoka.royalcleanuae.com/"
};

// --- Social Icons with Official Brand Shapes ---
const WhatsAppIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>);
const FacebookIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>);
const InstagramIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>);
const LinkedInIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>);
const TikTokIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>);
const SnapchatIcon = () => (<svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12.005 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 1.5c4.69 0 8.5 3.81 8.5 8.5 0 4.69-3.81 8.5-8.5 8.5-4.69 0-8.5-3.81-8.5-8.5 0-4.69 3.81-8.5 8.5-8.5zm-1.125 4.5c-.32.02-.63.13-.88.31-.25.18-.42.44-.47.75-.05.31.02.63.2.88s.44.42.75.47c.06.01.12.01.18.01.26 0 .52-.09.73-.26.21-.17.35-.41.39-.68.04-.27-.04-.54-.21-.76-.17-.22-.43-.35-.7-.38-.03 0-.06 0-.09 0zm2.25 0c-.03 0-.06 0-.09 0-.27.03-.53.16-.7.38-.17.22-.25.49-.21.76.04.27.18.51.39.68.21.17.47.26.73.26.06 0 .12 0 .18-.01.31-.05.57-.22.75-.47.18-.25.25-.57.2-.88-.05-.31-.22-.57-.47-.75-.25-.18-.56-.29-.88-.31z"/></svg>);

const CAPABILITIES = [
    { icon: <VideoCameraIcon className="w-5 h-5" />, title: "استوديو Veo", desc: "توليد فيديو سينمائي" },
    { icon: <CpuChipIcon className="w-5 h-5" />, title: "الذكاء المركزي", desc: "تحليل وإدارة البيانات" },
    { icon: <CodeBracketIcon className="w-5 h-5" />, title: "المهندس المعماري", desc: "بناء تطبيقات كاملة" },
    { icon: <GlobeAltIcon className="w-5 h-5" />, title: "التتبع العالمي", desc: "إدارة الأساطيل 3D" },
];

interface AuthProps {
  onLogin: (role: 'user' | 'owner') => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ownerCode, setOwnerCode] = useState('');
  const [notRobot, setNotRobot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [initialTab, setInitialTab] = useState<'identity' | 'capabilities' | 'legal' | 'chat'>('identity');

  // Chat Guide
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
      { role: 'model', text: "مرحبًا بك في بوابة زوكا (ZOOKA OS). أنا وكيلك الذكي، اسألني عن قدرات النظام قبل الدخول." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!notRobot && !ownerCode) {
      setErrorMsg("الرجاء تأكيد أنك لست روبوت (Human Check).");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      // ✅ STRICT AUTH CHECK
      if (ownerCode) {
          if (ownerCode === '3219' || ownerCode === '@3219') {
              console.log("[AUDIT] Admin Login Successful: User provided correct PIN.");
              onLogin('owner');
          } else {
              console.warn("[AUDIT] Admin Login Failed: Incorrect PIN attempted.");
              setErrorMsg("❌ كود الوصول غير صحيح. تم تسجيل محاولة الدخول.");
              setLoading(false);
              return;
          }
      } else {
          // Standard User Login (Simulation)
          onLogin('user');
      }
      setLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
      setLoading(true);
      setTimeout(() => {
          onLogin('user');
          setLoading(false);
      }, 1000);
  };

  const handleChat = async () => {
      if (!chatInput.trim()) return;
      const userMsg = chatInput;
      setChatInput('');
      setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
      setChatLoading(true);

      try {
          const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
          const ai = new GoogleGenAI({ apiKey: apiKey as string });
          const prompt = `You are the Official Guide for "ZOOKA OS" (Platform Edition). Answer briefly in Arabic about system capabilities. User: "${userMsg}"`;
          const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
          });
          setChatHistory(prev => [...prev, { role: 'model', text: result.text || "أنا هنا للإجابة." }]);
      } catch (error) {
          setChatHistory(prev => [...prev, { role: 'model', text: "عذرًا، يرجى التحقق من الاتصال." }]);
      } finally {
          setChatLoading(false);
      }
  };

  const openInfo = (tab: 'identity' | 'capabilities' | 'legal' | 'chat') => {
      setInitialTab(tab);
      setShowSystemInfo(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-950 font-sans text-right overflow-hidden relative" dir="rtl">
      {showSystemInfo && <SystemInfo onClose={() => setShowSystemInfo(false)} initialTab={initialTab} />}

      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col w-[55%] relative bg-gray-900 border-l border-gray-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-transparent to-black/80 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full p-10">
              <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/20">
                          <FingerPrintIcon className="w-10 h-10 text-white" />
                      </div>
                      <div>
                          <h1 className="text-4xl font-black text-white tracking-wide">ZOOKA OS</h1>
                          <div className="flex items-center gap-2 mt-1">
                              <span className="h-px w-8 bg-yellow-500"></span>
                              <p className="text-xs text-yellow-500 font-mono tracking-[0.3em] uppercase">PLATFORM EDITION</p>
                          </div>
                      </div>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                      النظام السيادي لإدارة العمليات الرقمية. <span className="text-white font-bold">Production Ready</span>.
                  </p>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 flex flex-col bg-black/30 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                  <div className="p-3 bg-gray-800/80 border-b border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <SparklesIcon className="w-4 h-4 text-green-400 animate-pulse" />
                          <span className="text-sm font-bold text-white">المرشد الذكي (Live)</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                              }`}>{msg.text}</div>
                          </div>
                      ))}
                      {chatLoading && <div className="text-xs text-gray-500 animate-pulse mr-2">جاري الكتابة...</div>}
                      <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 bg-gray-800/50 border-t border-gray-700 flex gap-2">
                      <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="استفسر عن النظام..." className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500" />
                      <button onClick={handleChat} disabled={chatLoading} className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-500"><PaperAirplaneIcon className="w-4 h-4 transform rotate-180" /></button>
                  </div>
              </div>
          </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-[45%] flex flex-col bg-black relative overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 relative">
              <div className="w-full max-w-md mx-auto z-10">
                  <div className="mb-8 text-center lg:text-right">
                      <h2 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h2>
                      <p className="text-gray-400 text-sm">بوابة الوصول الموحدة (SSO).</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                      {!ownerCode ? (
                        <div className="flex justify-end mb-2">
                            <button type="button" onClick={() => setOwnerCode(' ')} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
                                <LockClosedIcon className="w-3 h-3" /> بوابة المشرف (Admin)
                            </button>
                        </div>
                      ) : (
                        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl mb-6 animate-fade-in-down">
                            <label className="block text-red-400 text-xs font-bold mb-2 flex items-center gap-2">
                                <KeyIcon className="w-4 h-4" /> PIN Code
                            </label>
                            <input 
                              type="password" autoFocus placeholder="3219" value={ownerCode === ' ' ? '' : ownerCode}
                              onChange={(e) => setOwnerCode(e.target.value)}
                              className="w-full bg-black/50 border-b-2 border-red-800 text-white text-center text-xl p-2 focus:outline-none font-mono tracking-[0.5em]"
                            />
                            <button type="button" onClick={() => {setOwnerCode(''); setErrorMsg('');}} className="text-[10px] text-gray-500 mt-2 hover:text-white w-full text-center">عودة</button>
                        </div>
                      )}

                      {!ownerCode && (
                        <>
                          <div className="space-y-1">
                            <label className="text-gray-300 text-xs font-bold mr-1">البريد الإلكتروني</label>
                            <input type="email" required placeholder="admin@zooka-ai.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-300 text-xs font-bold mr-1">كلمة المرور</label>
                            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 text-white tracking-widest" />
                          </div>
                          <div className={`flex items-center p-3 bg-gray-900/50 rounded-xl border cursor-pointer transition-all ${notRobot ? 'border-green-500 bg-green-900/10' : 'border-gray-700 hover:border-gray-500'}`} onClick={() => setNotRobot(!notRobot)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ml-3 transition-all ${notRobot ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                              {notRobot && <CheckCircleIcon className="w-4 h-4 text-white" />}
                            </div>
                            <span className={`text-xs font-bold ${notRobot ? 'text-green-400' : 'text-gray-400'}`}>أنا إنسان (Verification)</span>
                          </div>
                        </>
                      )}

                      {errorMsg && (
                          <div className="bg-red-900/20 border border-red-500/50 text-red-300 text-xs p-3 rounded-lg text-center font-bold">
                              {errorMsg}
                          </div>
                      )}

                      <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] ${ownerCode ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'}`}>
                        {loading ? <LoadingSpinner /> : <>{ownerCode ? 'تأكيد الرمز' : 'دخول النظام'} <ArrowRightOnRectangleIcon className="w-4 h-4 transform rotate-180" /></>}
                      </button>
                  </form>

                  {/* Restored Socials */}
                  <div className="mt-8 pt-8 border-t border-gray-800">
                      <div className="flex justify-center items-center gap-4 flex-wrap">
                          <a href="https://wa.me/971563177803" target="_blank" className="w-10 h-10 flex items-center justify-center bg-[#25D366] rounded-full hover:scale-110 transition-transform shadow-lg text-white"><WhatsAppIcon /></a>
                          <a href="https://zoka.royalcleanuae.com/" target="_blank" className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 rounded-full hover:scale-110 transition-transform shadow-lg text-white" title="ZOOKA OS"><CpuChipIcon className="w-5 h-5" /></a>
                      </div>
                      <div className="text-center mt-4">
                          <p className="text-sm font-bold text-gray-500 opacity-80 tracking-wide font-mono">© ROYAL HAROUN 2025</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};