import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  BanknotesIcon, 
  DocumentTextIcon, 
  PresentationChartLineIcon, 
  CameraIcon, 
  ArrowUpTrayIcon,
  PlusCircleIcon,
  CalculatorIcon,
  PrinterIcon
} from '@heroicons/react/24/solid';

type Tab = 'expenses' | 'invoices' | 'advisor';

interface Expense {
    id: number;
    merchant: string;
    amount: number;
    date: string;
    category: string;
}

const FinanceManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('expenses');
    const [loading, setLoading] = useState(false);
    
    // Expenses State
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, merchant: "أدنوك للتوزيع", amount: 150, date: "2024-05-20", category: "نقل" },
        { id: 2, merchant: "كارفور", amount: 320, date: "2024-05-19", category: "مستلزمات" },
    ]);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Invoice State
    const [invoicePrompt, setInvoicePrompt] = useState('');
    const [generatedInvoice, setGeneratedInvoice] = useState<string | null>(null);

    // Advisor State
    const [advisorChat, setAdvisorChat] = useState<{role: 'user'|'model', text: string}[]>([]);
    const [advisorInput, setAdvisorInput] = useState('');

    // --- Logic: Scan Expense ---
    const handleScanExpense = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const base64 = await blobToBase64(file);
        setScannedImage(URL.createObjectURL(file));

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const prompt = `
                Analyze this receipt image. Extract:
                1. Merchant Name.
                2. Total Amount (Number only).
                3. Date (YYYY-MM-DD).
                4. Category (e.g., Food, Transport, Utilities).
                
                Return JSON ONLY: { "merchant": "", "amount": 0, "date": "", "category": "" }
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: file.type, data: base64 } },
                        { text: prompt }
                    ]
                },
                config: { responseMimeType: "application/json" }
            });

            const data = JSON.parse(result.text || '{}');
            if (data.amount) {
                setExpenses(prev => [{ id: Date.now(), ...data }, ...prev]);
            }
        } catch (error) {
            console.error(error);
            alert("فشل قراءة الإيصال. حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    // --- Logic: Generate Invoice ---
    const handleGenerateInvoice = async () => {
        if (!invoicePrompt.trim()) return;
        setLoading(true);
        
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const prompt = `
                Create a professional HTML Invoice for "Royal Clean UAE".
                Details provided: "${invoicePrompt}".
                
                Style: Modern, clean, professional. Use Tailwind CSS classes.
                Include: Logo placeholder, Date, Bill To, Line Items, Total, Footer with "Thank you for your business".
                Direction: RTL (Arabic).
                Return ONLY the HTML code string.
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            setGeneratedInvoice(result.text || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Logic: Financial Advisor ---
    const handleAdvisorChat = async () => {
        if (!advisorInput.trim()) return;
        
        const msg = advisorInput;
        setAdvisorInput('');
        setAdvisorChat(prev => [...prev, { role: 'user', text: msg }]);
        setLoading(true);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            // Context from current expenses
            const context = `
                Current Financial Data:
                Total Expenses logged: ${expenses.reduce((sum, item) => sum + item.amount, 0)} AED.
                Recent transactions: ${JSON.stringify(expenses.slice(0, 3))}.
            `;

            const prompt = `
                Act as a CFO (Chief Financial Officer) for Royal Clean UAE.
                Context: ${context}
                User Question: ${msg}
                Provide brief, strategic financial advice.
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt
            });

            setAdvisorChat(prev => [...prev, { role: 'model', text: result.text || 'Error' }]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 min-h-[90vh] text-white">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6">
                <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/50">
                    <BanknotesIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">المدير المالي (Finance Manager)</h1>
                    <p className="text-gray-400">تحكم في أموالك: فواتير، مصروفات، واستشارات ذكية.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    <button 
                        onClick={() => setActiveTab('expenses')}
                        className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'expenses' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <CameraIcon className="w-5 h-5" /> ماسح المصروفات
                    </button>
                    <button 
                        onClick={() => setActiveTab('invoices')}
                        className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'invoices' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <DocumentTextIcon className="w-5 h-5" /> منشئ الفواتير
                    </button>
                    <button 
                        onClick={() => setActiveTab('advisor')}
                        className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'advisor' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <PresentationChartLineIcon className="w-5 h-5" /> المستشار المالي
                    </button>

                    {/* Quick Stats */}
                    <div className="mt-8 bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="text-gray-400 text-xs uppercase mb-2">إجمالي المصروفات</h3>
                        <p className="text-2xl font-bold text-red-400 font-mono">{totalExpenses.toLocaleString()} AED</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 bg-gray-800 rounded-2xl p-6 border border-gray-700 min-h-[500px]">
                    
                    {/* --- EXPENSES TAB --- */}
                    {activeTab === 'expenses' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <CameraIcon className="w-6 h-6 text-emerald-400" /> تسجيل المصروفات بالذكاء الاصطناعي
                                </h2>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 font-bold transition-colors"
                                >
                                    <PlusCircleIcon className="w-5 h-5" /> صور الإيصال
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleScanExpense} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>

                            {loading && (
                                <div className="bg-gray-900/50 p-8 rounded-xl flex flex-col items-center justify-center border border-emerald-500/30">
                                    <LoadingSpinner />
                                    <p className="mt-4 text-emerald-400 animate-pulse">جاري تحليل بيانات الفاتورة واستخراج الأرقام...</p>
                                </div>
                            )}

                            {/* Scanned Image Preview */}
                            {scannedImage && !loading && (
                                <div className="mb-4 p-4 bg-gray-900 rounded-xl border border-gray-700 flex items-center gap-4">
                                    <img src={scannedImage} alt="Receipt" className="h-20 w-20 object-cover rounded-lg" />
                                    <div className="text-sm text-gray-400">
                                        تم قراءة الصورة بنجاح. تحقق من الجدول أدناه.
                                    </div>
                                </div>
                            )}

                            {/* Expenses Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="bg-gray-900 text-gray-400 text-sm">
                                        <tr>
                                            <th className="p-3 rounded-r-lg">التاجر</th>
                                            <th className="p-3">التاريخ</th>
                                            <th className="p-3">الفئة</th>
                                            <th className="p-3 rounded-l-lg">المبلغ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {expenses.map(expense => (
                                            <tr key={expense.id} className="hover:bg-gray-700/50 transition-colors">
                                                <td className="p-3 font-bold">{expense.merchant}</td>
                                                <td className="p-3 text-gray-400 text-sm">{expense.date}</td>
                                                <td className="p-3"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{expense.category}</span></td>
                                                <td className="p-3 text-red-400 font-mono font-bold">-{expense.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* --- INVOICES TAB --- */}
                    {activeTab === 'invoices' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <DocumentTextIcon className="w-6 h-6 text-blue-400" /> مولد الفواتير الاحترافي
                            </h2>
                            
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <textarea 
                                        value={invoicePrompt}
                                        onChange={(e) => setInvoicePrompt(e.target.value)}
                                        placeholder="مثال: فاتورة لشركة إعمار، تنظيف واجهات برج رقم 4، المبلغ 5000 درهم، التاريخ اليوم."
                                        className="w-full h-32 p-4 bg-gray-900 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white resize-none"
                                    />
                                    <button 
                                        onClick={handleGenerateInvoice}
                                        disabled={loading || !invoicePrompt}
                                        className="absolute bottom-4 left-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2"
                                    >
                                        {loading ? <LoadingSpinner /> : <><CalculatorIcon className="w-4 h-4" /> إنشاء الفاتورة</>}
                                    </button>
                                </div>
                            </div>

                            {generatedInvoice && (
                                <div className="bg-white text-black rounded-xl overflow-hidden shadow-2xl relative">
                                    <div className="bg-gray-100 p-2 flex justify-end gap-2 border-b border-gray-300">
                                        <button className="text-gray-600 hover:text-black p-2"><PrinterIcon className="w-5 h-5"/></button>
                                        <button className="text-gray-600 hover:text-black p-2"><ArrowUpTrayIcon className="w-5 h-5"/></button>
                                    </div>
                                    <div className="p-8 overflow-auto max-h-[500px]">
                                        <div dangerouslySetInnerHTML={{ __html: generatedInvoice }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- ADVISOR TAB --- */}
                    {activeTab === 'advisor' && (
                        <div className="space-y-4 animate-fade-in-up flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                                    <PresentationChartLineIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">المستشار المالي (CFO)</h2>
                                    <p className="text-sm text-purple-300">تحليل الأداء، تقليل التكاليف، وزيادة الأرباح.</p>
                                </div>
                            </div>

                            <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-gray-700 h-[400px] overflow-y-auto space-y-4">
                                {advisorChat.length === 0 && (
                                    <div className="text-center text-gray-600 mt-20">
                                        <p>مرحباً بك، أنا المدير المالي لشركة Royal Clean.</p>
                                        <p className="text-sm">كيف يمكنني مساعدتك في اتخاذ قرارات مالية اليوم؟</p>
                                    </div>
                                )}
                                {advisorChat.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-600 rounded-bl-none'}`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {loading && <div className="text-purple-400 text-sm animate-pulse">جاري كتابة التقرير...</div>}
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={advisorInput}
                                    onChange={(e) => setAdvisorInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdvisorChat()}
                                    placeholder="اسأل المستشار... (مثال: هل مصاريف الوقود عالية هذا الشهر؟)"
                                    className="flex-1 p-4 bg-gray-900 border border-gray-600 rounded-xl focus:border-purple-500 text-white"
                                />
                                <button 
                                    onClick={handleAdvisorChat}
                                    disabled={loading}
                                    className="px-6 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold"
                                >
                                    إرسال
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FinanceManager;