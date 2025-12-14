import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  BoltIcon,
  TruckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/solid';

// --- Types & Interfaces ---
type ViewMode = 'landing' | 'dashboard';
type PlanTier = 'free' | 'business' | 'factory' | 'enterprise';

interface Entity {
    id: number;
    name: string;
    type: 'car' | 'worker';
    status: 'moving' | 'stopped' | 'offline';
    lastUpdate: string;
    battery: number;
}

// --- Mock Data ---
const MOCK_ENTITIES: Entity[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    name: i % 2 === 0 ? `شاحنة رقم ${i + 100}` : `مندوب ${i + 1}`,
    type: i % 2 === 0 ? 'car' : 'worker',
    status: Math.random() > 0.5 ? 'moving' : 'stopped',
    lastUpdate: 'الآن',
    battery: Math.floor(Math.random() * 100)
}));

const GeoCommander: React.FC = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [plan, setPlan] = useState<PlanTier>('free'); // Change this to test locks
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  
  // 3D Map Ref (Simulation)
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // --- AI Logic (Private Agent) ---
  const runPrivateAgent = async () => {
      if (plan === 'free') return; // Locked for free users
      setLoading(true);
      try {
          const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
          const ai = new GoogleGenAI({ apiKey: apiKey as string });
          const prompt = `
            Act as a Logistics AI Manager for a specific company (Isolated Tenant Data).
            Analyze the current fleet status: 50 Vehicles, 120 Workers.
            Current Issue: High fuel consumption in Sector 7.
            
            Task: Provide 3 strategic optimization moves to reduce cost and improve delivery time.
            Output: Concise bullet points in Arabic.
          `;
          
          const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
          });
          setAiAnalysis(result.text || '');
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  // --- Renderers ---

  // 1. LANDING PAGE (The Sales Pitch)
  const renderLanding = () => (
      <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-black z-0"></div>
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-fast"></div>

          {/* Navbar */}
          <nav className="relative z-20 flex justify-between items-center p-6 max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                  <GlobeAltIcon className="w-10 h-10 text-blue-500 animate-spin-slow" />
                  <span className="text-2xl font-bold tracking-wider">ZOOKA TRACK <span className="text-blue-500">X</span></span>
              </div>
              <button onClick={() => setView('dashboard')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30">
                  دخول النظام
              </button>
          </nav>

          {/* Hero Section */}
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white">
                  السيطرة الكاملة.<br/>
                  في أي مكان. وفي كل لحظة.
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                  نظام التتبع العالمي للمصانع، الشركات، والأساطيل الضخمة. 
                  يدعم حتى 10,000 موظف ومركبة مع وكيل ذكاء اصطناعي خاص لكل مؤسسة.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
                  <button onClick={() => setView('dashboard')} className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                      <PlayIcon className="w-6 h-6" /> ابدأ التجربة الحية
                  </button>
                  <button className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                      تواصل مع المبيعات
                  </button>
              </div>

              {/* 3D Map Preview Simulation */}
              <div className="relative w-full max-w-5xl mx-auto h-[400px] bg-gray-800 rounded-2xl border-4 border-gray-700 shadow-2xl overflow-hidden transform perspective-1000 rotate-x-12 group hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.2708,25.2048,13,0,60/800x400?access_token=pk.eyJ1IjoiZGVtb3MiLCJhIjoiY2w4Z3I1Znl5MDIzZTNubzFlYm50c252bCJ9.Kk8c0f7-1tGk7e8Xy3v4XA')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  
                  {/* Floating Pins */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-blue-400 px-3 py-1 rounded text-xs font-mono whitespace-nowrap border border-blue-500/50">
                              Fleet #102: Active
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Pricing Plans */}
          <div className="relative z-10 bg-gray-800/50 backdrop-blur-md py-20 border-t border-gray-700">
              <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center mb-12">باقات العمالقة (VIP Tiers)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Plan 1 */}
                      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-colors">
                          <h3 className="text-xl font-bold text-gray-400 mb-2">الشركات الناشئة</h3>
                          <div className="text-4xl font-bold text-white mb-4">$99<span className="text-sm text-gray-500">/شهر</span></div>
                          <ul className="space-y-3 text-gray-400 text-sm mb-8">
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-blue-500"/> حتى 50 موظف/مركبة</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-blue-500"/> تتبع مباشر 2D</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-blue-500"/> تقارير أساسية</li>
                          </ul>
                          <button onClick={() => {setPlan('business'); setView('dashboard');}} className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold">اشتراك</button>
                      </div>

                      {/* Plan 2 (Best) */}
                      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-8 relative transform scale-105 shadow-2xl shadow-purple-900/20">
                          <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">الأكثر طلباً</div>
                          <h3 className="text-xl font-bold text-purple-400 mb-2">المصانع والشركات</h3>
                          <div className="text-4xl font-bold text-white mb-4">$299<span className="text-sm text-gray-500">/شهر</span></div>
                          <ul className="space-y-3 text-gray-300 text-sm mb-8">
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-purple-500"/> حتى 500 موظف/مركبة</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-purple-500"/> خرائط 3D متقدمة</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-purple-500"/> وكيل AI خاص للتحليل</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-purple-500"/> أتمتة الواتساب</li>
                          </ul>
                          <button onClick={() => {setPlan('factory'); setView('dashboard');}} className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold">بدء الفترة التجريبية</button>
                      </div>

                      {/* Plan 3 */}
                      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-yellow-500 transition-colors">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">المؤسسات (Enterprise)</h3>
                          <div className="text-4xl font-bold text-white mb-4">$999<span className="text-sm text-gray-500">/شهر</span></div>
                          <ul className="space-y-3 text-gray-400 text-sm mb-8">
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-yellow-500"/> عدد غير محدود</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-yellow-500"/> سيرفر خاص معزول</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-yellow-500"/> تكامل API كامل</li>
                              <li className="flex gap-2"><CheckCircleIcon className="w-5 h-5 text-yellow-500"/> مدير حساب شخصي</li>
                          </ul>
                          <button onClick={() => {setPlan('enterprise'); setView('dashboard');}} className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg">تواصل معنا</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  // 2. DASHBOARD (The System)
  const renderDashboard = () => (
      <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
          {/* Top Bar */}
          <div className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shadow-md z-20">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                      <GlobeAltIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                      <h2 className="font-bold text-lg leading-none">ZOOKA TRACK X</h2>
                      <span className="text-[10px] text-gray-400 font-mono">
                          PLAN: <span className={`uppercase font-bold ${plan === 'free' ? 'text-gray-500' : plan === 'factory' ? 'text-purple-400' : 'text-yellow-400'}`}>{plan}</span>
                      </span>
                  </div>
              </div>
              
              <div className="flex gap-3">
                  {/* Status Indicators */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-gray-700">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs">GPS: Connected</span>
                  </div>
                  <button onClick={() => setView('landing')} className="text-xs text-gray-400 hover:text-white">خروج</button>
              </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
              {/* Sidebar (List) */}
              <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-10 shadow-2xl">
                  <div className="p-4 border-b border-gray-800">
                      <input type="text" placeholder="بحث عن مركبة، موظف، ID..." className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none" />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                      {MOCK_ENTITIES.map(entity => (
                          <div 
                            key={entity.id}
                            onClick={() => setSelectedEntity(entity)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-800 flex items-center justify-between ${selectedEntity?.id === entity.id ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-900/50 border-gray-800'}`}
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${entity.type === 'car' ? 'bg-orange-900/30 text-orange-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                      {entity.type === 'car' ? <TruckIcon className="w-4 h-4"/> : <UserGroupIcon className="w-4 h-4"/>}
                                  </div>
                                  <div>
                                      <div className="font-bold text-sm">{entity.name}</div>
                                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                          <span className={`w-1.5 h-1.5 rounded-full ${entity.status === 'moving' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                          {entity.status}
                                      </div>
                                  </div>
                              </div>
                              <div className="text-[10px] text-gray-600 font-mono">{entity.battery}%</div>
                          </div>
                      ))}
                  </div>

                  {/* Quick Stats Footer */}
                  <div className="p-4 bg-black/20 border-t border-gray-800 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-gray-800 p-2 rounded">
                          <div className="text-blue-400 font-bold">50</div>
                          <div className="text-gray-500">مركبة</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                          <div className="text-green-400 font-bold">120</div>
                          <div className="text-gray-500">موظف</div>
                      </div>
                  </div>
              </div>

              {/* Main Map Area */}
              <div className="flex-1 relative bg-gray-800 overflow-hidden">
                  {/* Map Layer (Simulation) */}
                  <div 
                    ref={mapContainerRef}
                    className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/55.2708,25.2048,14,60,60/1200x800?access_token=pk.eyJ1IjoiZGVtb3MiLCJhIjoiY2w4Z3I1Znl5MDIzZTNubzFlYm50c252bCJ9.Kk8c0f7-1tGk7e8Xy3v4XA')] bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ filter: plan === 'free' ? 'grayscale(100%) blur(2px)' : 'none' }}
                  ></div>

                  {/* 3D Buildings Overlay Simulation */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pointer-events-none"></div>

                  {/* Locked Content Overlay (If Free) */}
                  {plan === 'free' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                          <div className="bg-gray-900 p-8 rounded-2xl border border-red-500/50 text-center max-w-md shadow-2xl">
                              <LockClosedIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                              <h3 className="text-2xl font-bold text-white mb-2">ميزة مدفوعة (Pro Feature)</h3>
                              <p className="text-gray-400 mb-6">
                                  نظام الخرائط ثلاثية الأبعاد والتتبع المباشر متاح فقط للمشتركين في باقات الشركات والمصانع.
                              </p>
                              <button onClick={() => setView('landing')} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold">
                                  ترقية الباقة الآن
                              </button>
                          </div>
                      </div>
                  )}

                  {/* Map Controls & AI Panel (Visible if Paid) */}
                  {plan !== 'free' && (
                      <>
                          {/* Map Tools */}
                          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                              <button className="p-3 bg-gray-900/90 text-white rounded-lg border border-gray-700 hover:bg-blue-600 transition-colors shadow-lg" title="تغيير المنظور 3D"><BuildingOfficeIcon className="w-5 h-5"/></button>
                              <button className="p-3 bg-gray-900/90 text-white rounded-lg border border-gray-700 hover:bg-blue-600 transition-colors shadow-lg" title="تحديث الموقع"><MapPinIcon className="w-5 h-5"/></button>
                          </div>

                          {/* AI Assistant Floating Panel */}
                          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl z-20">
                              <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-bold text-purple-400 flex items-center gap-2">
                                      <SparklesIcon className="w-5 h-5" /> الوكيل الذكي (ZOOKA AI)
                                  </h4>
                                  <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/30">Private Tenant</span>
                              </div>
                              
                              <div className="bg-black/40 rounded-lg p-3 min-h-[80px] text-xs text-gray-300 font-mono mb-3 border border-gray-800">
                                  {loading ? (
                                      <div className="flex items-center gap-2 text-purple-400">
                                          <LoadingSpinner /> جاري تحليل بيانات الأسطول...
                                      </div>
                                  ) : aiAnalysis ? (
                                      <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                                  ) : (
                                      "النظام يراقب 170 وحدة. لا توجد تنبيهات حرجة. هل تريد تحليل الكفاءة؟"
                                  )}
                              </div>

                              <div className="flex gap-2">
                                  <button onClick={runPrivateAgent} disabled={loading} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2">
                                      <BoltIcon className="w-4 h-4" /> تحليل الكفاءة
                                  </button>
                                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300">
                                      <CogIcon className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </>
                  )}
              </div>
          </div>
      </div>
  );

  return view === 'landing' ? renderLanding() : renderDashboard();
};

export default GeoCommander;