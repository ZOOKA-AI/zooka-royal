
import React, { useState, useEffect } from 'react';
import { 
  FingerPrintIcon,
  SparklesIcon,
  VideoCameraIcon,
  PhotoIcon,
  ArrowPathIcon,
  LockClosedIcon,
  BoltIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GoogleGenAI } from "@google/genai";

interface AuthProps {
  onLogin: (role: 'user' | 'owner') => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');

  // Teaser State
  const [labPrompt, setLabPrompt] = useState('');
  const [labOutput, setLabOutput] = useState<{type: 'image' | 'video', url: string} | null>(null);
  const [labLoading, setLabLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const storedKeys = JSON.parse(localStorage.getItem('zooka_public_keys') || '[]');
      const masterCode = localStorage.getItem('zooka_sovereign_code') || '@3219';

      if (accessCode === masterCode || accessCode === masterCode.replace('@', '')) {
        onLogin('owner');
      } else if (storedKeys.includes(accessCode)) {
        onLogin('user');
      } else {
        setError('رمز السيادة غير مفعل أو خاطئ.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    
    setTimeout(() => {
      const newKey = `ZK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const currentKeys = JSON.parse(localStorage.getItem('zooka_public_keys') || '[]');
      localStorage.setItem('zooka_public_keys', JSON.stringify([...currentKeys, newKey]));
      setGeneratedKey(newKey);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto font-sans" dir="rtl">
      
      {/* 🌌 High-Performance Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1),_transparent_70%)]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] animate-blob"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 py-10 md:py-20 flex flex-col lg:flex-row gap-12 lg:items-center">
        
        {/* Info Section */}
        <div className="flex-1 space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-6 py-2 rounded-full">
                <BoltIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Sovereign Core V7.5 Launch</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter">
                ZOOKA <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-500 via-white to-gray-600">INFINITY</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                انضم إلى نخبة المستخدمين في الكيان الرقمي الأكثر تطوراً. 
                أتمتة، ذكاء بصري، وسيطرة كاملة على مشاريعك.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['أتمتة شاملة', 'ذكاء بصري', 'سيو استراتيجي', 'إدارة مالية'].map((f, i) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl text-[10px] font-black uppercase text-gray-500 tracking-widest">{f}</div>
                ))}
            </div>
        </div>

        {/* Auth Terminal */}
        <div className="w-full lg:w-[450px]">
            <div className="bg-gray-900/80 backdrop-blur-3xl p-8 md:p-10 rounded-[3.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="flex justify-center gap-2 mb-10 bg-black/40 p-1 rounded-2xl">
                    <button onClick={() => {setIsRegistering(false); setError('');}} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${!isRegistering ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>تسجيل دخول</button>
                    <button onClick={() => {setIsRegistering(true); setError('');}} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${isRegistering ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>إنشاء هوية</button>
                </div>

                {!isRegistering ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-center mb-6">
                            <FingerPrintIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-black">بوابة العبور</h2>
                        </div>
                        <input 
                            type="password"
                            value={accessCode}
                            onChange={e => setAccessCode(e.target.value)}
                            placeholder="أدخل الكود السيادي"
                            className="w-full bg-black/80 border-2 border-gray-800 rounded-2xl py-6 text-center text-white text-3xl font-mono focus:border-blue-600 outline-none transition-all"
                        />
                        {error && <p className="text-red-500 text-[10px] font-black text-center animate-bounce">{error}</p>}
                        <button disabled={loading} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                            {loading ? <LoadingSpinner /> : 'تفعيل النظام'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        {!generatedKey ? (
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="text-center mb-6">
                                    <UserPlusIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-black">طلب هوية جديدة</h2>
                                </div>
                                <input 
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="اسمك الكامل أو اسم الشركة"
                                    className="w-full bg-black/80 border-2 border-gray-800 rounded-2xl py-5 px-6 text-white text-center outline-none focus:border-emerald-500"
                                />
                                <button disabled={loading} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                                    {loading ? <LoadingSpinner /> : 'توليد الكود الآن'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 animate-fade-in">
                                <ShieldCheckIcon className="w-20 h-20 text-emerald-500 mx-auto" />
                                <h3 className="text-xl font-black">تم إنشاء هويتك بنجاح!</h3>
                                <div className="bg-black p-6 rounded-2xl border-2 border-dashed border-emerald-500/50">
                                    <p className="text-[10px] text-gray-500 uppercase mb-2">كود الدخول الخاص بك (احفظه جيداً):</p>
                                    <p className="text-4xl font-mono font-black text-emerald-400 select-all">{generatedKey}</p>
                                </div>
                                <button onClick={() => setIsRegistering(false)} className="w-full py-4 bg-gray-800 rounded-xl font-black text-xs">العودة لتسجيل الدخول</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Plans Section for Public */}
      <div className="w-full max-w-6xl px-4 py-20">
          <h2 className="text-4xl font-black text-center mb-16">باقات السيادة الرقمية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { name: 'الباقة البرونزية', price: '99', time: 'أسبوعي', color: 'border-gray-700', features: ['الدردشة الذكية', 'المحرر الاستراتيجي', 'دعم فني 24/7'] },
                  { name: 'الباقة الملكية', price: '299', time: 'شهري', color: 'border-blue-600 scale-105 shadow-blue-900/20', featured: true, features: ['كل ميزات البرونزية', 'استوديو الصور والفيديو', 'تحليل السيو المتقدم', 'أتمتة الواتساب'] },
                  { name: 'باقة المصانع', price: '999', time: 'سنوي', color: 'border-purple-600', features: ['كل الميزات الملكية', 'تتبع الأساطيل 3D', 'سيرفر خاص مشفر', 'مدير حساب مخصص'] },
              ].map((plan, i) => (
                  <div key={i} className={`bg-gray-900/40 backdrop-blur-xl border-2 ${plan.color} p-10 rounded-[3rem] flex flex-col relative`}>
                      {plan.featured && <div className="absolute -top-4 right-10 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">الأكثر طلباً</div>}
                      <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
                      <div className="text-5xl font-black mb-8">${plan.price}<span className="text-sm text-gray-500 font-bold">/{plan.time}</span></div>
                      <ul className="space-y-4 mb-10 flex-1">
                          {plan.features.map((f, j) => (
                              <li key={j} className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                  <ShieldCheckIcon className="w-4 h-4 text-blue-500" /> {f}
                              </li>
                          ))}
                      </ul>
                      <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs hover:bg-gray-200 transition-all">اشترك الآن</button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
