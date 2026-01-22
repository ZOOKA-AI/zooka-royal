
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  CreditCardIcon, 
  BoltIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';

const CloudBillingManager: React.FC = () => {
    const [prompt, setPrompt] = useState('حساب الدفع الخاص بي (Firebase Payment) تم إغلاقه. ما هو السبب وما هي خطوات الحل؟');
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setReport('');
        
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("مفتاح API غير موجود في الخزنة.");

            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = `
                أنت خبير مالي وتقني متخصص في فوترة Google Cloud.
                مهمتك هي تحليل المشاكل التي يصفها المستخدم وتقديم حلول واضحة وقابلة للتنفيذ.
                1.  اشرح المشكلة بلغة بسيطة ومهنية.
                2.  قدم قائمة خطوات الحل بالترتيب.
                3.  أضف روابط مباشرة إلى Google Cloud Console حيثما أمكن.
                4.  استخدم تنسيق Markdown لجعل الإجابة سهلة القراءة.
            `;
            
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { systemInstruction }
            });

            setReport(result.text || "لم يتمكن المحلل من توليد تقرير.");
        } catch (e: any) {
            setReport(`❌ فشل التحليل: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-900/50 backdrop-blur-sm rounded-[3rem] border border-gray-800 min-h-[85vh] flex flex-col shadow-2xl font-sans" dir="rtl">
            
            <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-900/50">
                    <CreditCardIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">مدير الفوترة السحابية</h1>
                    <p className="text-gray-400">تشخيص وحل مشاكل فوترة Google Cloud بالذكاء الاصطناعي.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="حالة الحساب" value="مغلق" icon={<ExclamationTriangleIcon />} color="text-red-400" />
                <StatCard label="الرصيد الحالي" value="$0.00" icon={<CreditCardIcon />} color="text-yellow-400" />
                <StatCard label="التكلفة المتوقعة" value="$75.00" icon={<CheckCircleIcon />} color="text-green-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* AI Analyst */}
                <div className="lg:col-span-5 bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col space-y-4 shadow-inner">
                    <label className="text-sm font-bold text-gray-300">المحلل المالي الذكي</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="صف مشكلة الفوترة هنا أو الصق التقرير..."
                        className="w-full flex-1 p-4 bg-black/40 rounded-xl border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white resize-none outline-none transition-all"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-lg shadow-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading ? <LoadingSpinner /> : <><BoltIcon className="w-6 h-6"/> بدء التحليل المالي</>}
                    </button>
                </div>

                {/* Report and Actions */}
                <div className="lg:col-span-7 bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col shadow-inner">
                    <h3 className="text-xl font-bold text-white mb-4">تقرير المحلل وخطة العمل</h3>
                    <div className="flex-1 overflow-y-auto bg-black/40 rounded-xl p-4 custom-scrollbar">
                        {report ? (
                            <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-gray-300" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }}></div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 italic">التقرير سيظهر هنا...</div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <QuickLink href="https://console.cloud.google.com/billing" label="لوحة تحكم الفوترة" />
                        <QuickLink href="https://console.cloud.google.com/billing/payment/manage" label="إدارة حسابات الدفع" />
                        <QuickLink href="https://console.cloud.google.com/billing/reports" label="تقارير التكلفة" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{label: string, value: string, icon: React.ReactNode, color: string}> = ({label, value, icon, color}) => (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
        <div className={`p-3 bg-gray-900 rounded-lg ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <div>
            <p className="text-xs text-gray-400 uppercase">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

const QuickLink: React.FC<{href: string, label: string}> = ({href, label}) => (
     <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-center"
    >
        <span>{label}</span>
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
    </a>
);

export default CloudBillingManager;
