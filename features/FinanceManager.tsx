
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  BanknotesIcon, 
  DocumentTextIcon, 
  CameraIcon, 
  CloudArrowUpIcon,
  PrinterIcon
} from '@heroicons/react/24/solid';

export const FinanceManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'expenses' | 'invoices'>('expenses');
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [invoicePrompt, setInvoicePrompt] = useState('');
    const [generatedInvoice, setGeneratedInvoice] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64 = await blobToBase64(file);
            const prompt = "Extract data from this receipt. Return JSON only: { merchant, amount, date, currency, items: [] }";
            const result = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: {
                parts: [
                  { inlineData: { data: base64, mimeType: file.type } },
                  { text: prompt }
                ]
              }
            });
            const data = JSON.parse(result.text || '{}');
            setExpenses(prev => [data, ...prev]);
        } catch (e) {
            console.error(e);
            alert("فشل تحليل الفاتورة.");
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = async () => {
        if (!invoicePrompt.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Create a professional HTML Invoice for Royal Clean UAE. Details: ${invoicePrompt}. Use Tailwind CSS classes. Direction RTL. Return ONLY the HTML code.`;
            const result = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt
            });
            setGeneratedInvoice(result.text || '');
        } catch (e) {
            alert("فشل إنشاء الفاتورة.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-900 min-h-screen text-white rounded-[3rem] border border-gray-800 shadow-2xl font-sans" dir="rtl">
            <div className="flex items-center gap-6 mb-10 border-b border-gray-700 pb-8">
                <div className="p-5 bg-emerald-600 rounded-3xl shadow-xl">
                    <BanknotesIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">المدير المالي السيادي</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Royal Finance & OCR Protocol</p>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab('expenses')} className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${activeTab === 'expenses' ? 'bg-emerald-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>
                    <CameraIcon className="w-6 h-6" /> مسح المصروفات
                </button>
                <button onClick={() => setActiveTab('invoices')} className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${activeTab === 'invoices' ? 'bg-blue-600 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>
                    <DocumentTextIcon className="w-6 h-6" /> منشئ الفواتير
                </button>
            </div>

            <div className="bg-black/20 rounded-[2.5rem] p-8 border border-gray-800 min-h-[500px]">
                {activeTab === 'expenses' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black">سجل المصروفات الممسوحة</h2>
                            <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black flex items-center gap-3 shadow-xl transition-all">
                                <CloudArrowUpIcon className="w-6 h-6"/> ارفع إيصال
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleScanReceipt} className="hidden" accept="image/*" />
                        </div>
                        {loading && <div className="text-center py-10 animate-pulse text-emerald-500 font-black">جاري تحليل البيانات...</div>}
                        <div className="grid gap-4">
                            {expenses.map((exp, i) => (
                                <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex justify-between items-center group hover:border-emerald-500 transition-all">
                                    <div>
                                        <h3 className="font-black text-xl text-white">{exp.merchant || 'إيصال غير معروف'}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{exp.date || 'التاريخ مفقود'}</p>
                                    </div>
                                    <div className="text-2xl font-black text-emerald-400 font-mono">{exp.amount} {exp.currency}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <textarea 
                                value={invoicePrompt} 
                                onChange={e => setInvoicePrompt(e.target.value)}
                                className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 text-white outline-none focus:border-blue-500 h-32 text-lg"
                                placeholder="صف الفاتورة (العميل، الخدمة، المبلغ)..."
                            />
                            <button onClick={generateInvoice} disabled={loading} className="px-10 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white shadow-xl transition-all">
                                {loading ? <LoadingSpinner /> : 'إنشاء'}
                            </button>
                        </div>
                        {generatedInvoice && (
                            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl p-10 animate-fade-in relative">
                                <button onClick={() => window.print()} className="absolute top-6 left-6 p-4 bg-gray-900 rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                                    <PrinterIcon className="w-6 h-6" />
                                </button>
                                <div className="text-black overflow-auto" dangerouslySetInnerHTML={{ __html: generatedInvoice }} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceManager;
