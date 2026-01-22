
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  CloudIcon, 
  GlobeAltIcon, 
  ServerStackIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

interface DomainResult {
    name: string;
    price: string;
    available: boolean;
    extension: string;
}

const CloudManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'domains' | 'hosting' | 'reseller'>('domains');
  
  // Domain Search State
  const [domainQuery, setDomainQuery] = useState('');
  const [domainResults, setDomainResults] = useState<DomainResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Stats State
  const [revenue, setRevenue] = useState(12500); // Fake revenue
  const [activeClients, setActiveClients] = useState(42);

  const handleDomainSearch = async () => {
    if (!domainQuery.trim()) return;
    setSearching(true);
    setDomainResults([]);

    try {
        const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey as string });
        
        // Use AI to generate realistic domain suggestions and pricing
        const prompt = `
            Act as a Domain Name Registrar API.
            User is searching for: "${domainQuery}".
            
            Task:
            1. Check if "${domainQuery}" (with common extensions like .com, .ae, .tech, .io) sounds available.
            2. Suggest 5 creative variations or related available domains.
            3. Assign realistic prices in USD.

            Output JSON Format:
            [
                { "name": "example.com", "price": "12.99", "available": true, "extension": ".com" },
                { "name": "example.ae", "price": "45.00", "available": true, "extension": ".ae" }
            ]
        `;

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const domains = JSON.parse(result.text || '[]');
        setDomainResults(domains);

    } catch (e) {
        console.error(e);
    } finally {
        setSearching(false);
    }
  };

  const buyItem = (price: string) => {
      const amount = parseFloat(price);
      setRevenue(prev => prev + amount);
      setActiveClients(prev => prev + 1);
      alert(`تمت عملية الشراء بنجاح! تمت إضافة ${price}$ إلى رصيد الشركة.`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 min-h-screen text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-900/50">
                    <CloudIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">سحابة زوكا (ZOOKA CLOUD)</h1>
                    <p className="text-gray-400">منصة الاستضافة وتسجيل النطاقات المتكاملة.</p>
                </div>
            </div>
            
            {/* Live Stats */}
            <div className="flex gap-4">
                <div className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700 text-center">
                    <div className="text-xs text-gray-400 uppercase">إجمالي المبيعات</div>
                    <div className="text-xl font-bold text-green-400 font-mono">${revenue.toLocaleString()}</div>
                </div>
                <div className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700 text-center">
                    <div className="text-xs text-gray-400 uppercase">العملاء النشطون</div>
                    <div className="text-xl font-bold text-blue-400 font-mono">{activeClients}</div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('domains')}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'domains' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
                <GlobeAltIcon className="w-6 h-6" /> تسجيل النطاقات
            </button>
            <button 
                onClick={() => setActiveTab('hosting')}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'hosting' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
                <ServerStackIcon className="w-6 h-6" /> الاستضافة والسيرفرات
            </button>
        </div>

        {/* CONTENT: Domains */}
        {activeTab === 'domains' && (
            <div className="space-y-6 animate-fade-in-up">
                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
                    <h2 className="text-2xl font-bold mb-6">ابحث عن اسم نطاقك المثالي</h2>
                    <div className="flex max-w-2xl mx-auto relative">
                        <input 
                            type="text" 
                            value={domainQuery}
                            onChange={(e) => setDomainQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDomainSearch()}
                            placeholder="اكتب اسم النطاق (مثال: royalclean)"
                            className="w-full p-4 pl-12 rounded-l-xl bg-gray-900 border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-lg"
                        />
                        <GlobeAltIcon className="w-6 h-6 text-gray-500 absolute left-4 top-4" />
                        <button 
                            onClick={handleDomainSearch}
                            disabled={searching}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded-r-xl font-bold flex items-center gap-2"
                        >
                            {searching ? <LoadingSpinner /> : <MagnifyingGlassIcon className="w-5 h-5" />}
                            بحث
                        </button>
                    </div>
                </div>

                {domainResults.length > 0 && (
                    <div className="grid gap-4">
                        {domainResults.map((domain, i) => (
                            <div key={i} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between hover:border-cyan-500 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${domain.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                        <CheckBadgeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-mono">{domain.name}</h3>
                                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{domain.available ? 'متاح للتسجيل' : 'غير متاح'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">${domain.price}</div>
                                        <div className="text-xs text-gray-500">سنوياً</div>
                                    </div>
                                    <button 
                                        onClick={() => buyItem(domain.price)}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2"
                                    >
                                        <ShoppingCartIcon className="w-4 h-4" /> شراء
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* CONTENT: Hosting */}
        {activeTab === 'hosting' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                {/* Plan 1 */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col hover:transform hover:scale-105 transition-all">
                    <div className="mb-4">
                        <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Starter</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">استضافة مشتركة</h3>
                    <div className="text-4xl font-bold mb-6">$4.99<span className="text-sm text-gray-500 font-normal">/شهرياً</span></div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> موقع واحد</li>
                        <li className="flex gap-2 text-sm text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> 10GB SSD مساحة</li>
                        <li className="flex gap-2 text-sm text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> شهادة SSL مجانية</li>
                    </ul>

                    <button onClick={() => buyItem("4.99")} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold">شراء الآن</button>
                </div>

                {/* Plan 2 (Featured) */}
                <div className="bg-gray-800 rounded-2xl border-2 border-purple-500 p-6 flex flex-col relative shadow-2xl shadow-purple-900/20 transform scale-105">
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">الأكثر مبيعاً</div>
                    <div className="mb-4">
                        <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Pro Cloud</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">سيرفر VPS</h3>
                    <div className="text-4xl font-bold mb-6">$19.99<span className="text-sm text-gray-500 font-normal">/شهرياً</span></div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-white"><CpuChipIcon className="w-5 h-5 text-purple-400"/> 2 Core CPU</li>
                        <li className="flex gap-2 text-sm text-white"><ServerStackIcon className="w-5 h-5 text-purple-400"/> 4GB RAM</li>
                        <li className="flex gap-2 text-sm text-white"><ShieldCheckIcon className="w-5 h-5 text-purple-400"/> حماية DDoS متقدمة</li>
                        <li className="flex gap-2 text-sm text-white"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> لوحة تحكم cPanel</li>
                    </ul>

                    <button onClick={() => buyItem("19.99")} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg">إطلاق السيرفر</button>
                </div>

                {/* Plan 3 */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col hover:transform hover:scale-105 transition-all">
                    <div className="mb-4">
                        <span className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Enterprise</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">سيرفر خاص (Dedicated)</h3>
                    <div className="text-4xl font-bold mb-6">$149.99<span className="text-sm text-gray-500 font-normal">/شهرياً</span></div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex gap-2 text-sm text-gray-300"><CpuChipIcon className="w-5 h-5 text-yellow-500"/> 16 Core CPU</li>
                        <li className="flex gap-2 text-sm text-gray-300"><ServerStackIcon className="w-5 h-5 text-yellow-500"/> 64GB RAM</li>
                        <li className="flex gap-2 text-sm text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> IP خاص</li>
                        <li className="flex gap-2 text-sm text-gray-300"><CheckBadgeIcon className="w-5 h-5 text-green-500"/> إدارة كاملة 24/7</li>
                    </ul>

                    <button onClick={() => buyItem("149.99")} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold">تواصل للمبيعات</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default CloudManager;
