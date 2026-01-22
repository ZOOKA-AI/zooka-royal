
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  BanknotesIcon, 
  DocumentTextIcon, 
  CameraIcon, 
  CloudArrowUpIcon,
  PrinterIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

interface Expense {
    id: string;
    merchant: string;
    amount: number | string;
    date: string;
    currency: string;
    items?: any[];
}

export const FinanceManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'expenses' | 'invoices'>('expenses');
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [invoicePrompt, setInvoicePrompt] = useState('');
    const [generatedInvoice, setGeneratedInvoice] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) {
                alert("مفتاح API مفقود. يرجى إعداده من الخزنة.");
                setLoading(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
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
            const newExpense: Expense = { ...data, id: `exp-${Date.now()}` };
            setExpenses(prev => [newExpense, ...prev]);
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
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) {
                alert("مفتاح API مفقود. يرجى إعداده من الخزنة.");
                setLoading(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Create a professional HTML Invoice for Royal Clean UAE. Details: ${invoicePrompt}. Use Tailwind CSS classes. Direction RTL. Return ONLY the HTML code.`;
            const result = await ai.models.generateContent({
              model: 'gem-ini-3-pro-preview',
              contents: prompt
            });
            setGeneratedInvoice(result.text || '');
        } catch (e) {
            alert("فشل إنشاء الفاتورة.");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (expense: Expense) => {
        setEditingExpense({ ...expense });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingExpense(null);
        setIsEditModalOpen(false);
    };

    const handleSaveExpense = () => {
        if (!editingExpense) return;
        setExpenses(prevExpenses => 
            prevExpenses.map(exp => 
                exp.id === editingExpense.id ? editingExpense : exp
            )
        );
        closeEditModal();
    };
    
    const handleExpenseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingExpense) return;
        const { name, value } = e.target;
        setEditingExpense({
            ...editingExpense,
            [name]: name === 'amount' ? parseFloat(value) || value : value,
        });
    };

    const handleDeleteExpense = (id: string) => {
        if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
            setExpenses(prev => prev.filter(exp => exp.id !== id));
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
                            {expenses.map((exp) => (
                                <div key={exp.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex justify-between items-center group hover:border-emerald-500 transition-all">
                                    <div>
                                        <h3 className="font-black text-xl text-white">{exp.merchant || 'إيصال غير معروف'}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{exp.date || 'التاريخ مفقود'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-black text-emerald-400 font-mono">{exp.amount} {exp.currency}</div>
                                        <button onClick={() => openEditModal(exp)} className="p-3 bg-gray-700 hover:bg-blue-600 rounded-xl text-gray-400 hover:text-white transition-colors" title="تعديل">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteExpense(exp.id)} className="p-3 bg-gray-700 hover:bg-red-600 rounded-xl text-gray-400 hover:text-white transition-colors" title="حذف">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
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
                                className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32 text-lg"
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

            {isEditModalOpen && editingExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" dir="rtl">
                    <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-white">تعديل المصروف</h3>
                            <button onClick={closeEditModal} className="p-2 text-gray-500 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400">التاجر</label>
                                <input type="text" name="merchant" value={editingExpense.merchant} onChange={handleExpenseInputChange} className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400">المبلغ</label>
                                <input type="text" name="amount" value={editingExpense.amount} onChange={handleExpenseInputChange} className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400">التاريخ</label>
                                <input type="text" name="date" value={editingExpense.date} onChange={handleExpenseInputChange} className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                        </div>
                         <div className="flex gap-4 pt-4">
                            <button onClick={closeEditModal} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold">إلغاء</button>
                            <button onClick={handleSaveExpense} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold">حفظ التعديلات</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceManager;
