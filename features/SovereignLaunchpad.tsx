
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ArrowUpOnSquareIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ListBulletIcon,
  CpuChipIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/solid';

const PreflightChecklist = () => {
    const checks = [
        { label: "حجم الحزمة أقل من 2GB", status: true },
        { label: "تكوين Info.plist صحيح (iOS)", status: true },
        { label: "نوع البناء (Release / Ad Hoc)", status: true },
        { label: "أذونات الرفع في Firebase", status: false },
        { label: "اتصال إنترنت مستقر", status: true },
    ];

    return (
        <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 shadow-inner">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ListBulletIcon className="w-5 h-5 text-teal-400" />
                قائمة فحص ما قبل الإطلاق
            </h3>
            <ul className="space-y-3">
                {checks.map((check, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        {check.status ? 
                            <CheckCircleIcon className="w-5 h-5 text-green-500" /> :
                            <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                        }
                        <span className={check.status ? 'text-gray-300' : 'text-yellow-400 font-bold'}>{check.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SovereignLaunchpad: React.FC = () => {
    const [errorLog, setErrorLog] = useState("فشل تحميل التطبيق. (تمت المحاولة مرة أخرى) (409)\n\nAn error occurred processing the upload. Please contact support.");
    const [analysisReport, setAnalysisReport] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDiagnose = async () => {
        if (!errorLog.trim()) return;
        setLoading(true);
        setAnalysisReport('');
        
        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("مفتاح API غير موجود في الخزنة.");

            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = `
                أنت خبير أول في Firebase App Distribution و Google Cloud.
                مهمتك هي تحليل رسائل الأخطاء المتعلقة بفشل رفع التطبيقات (IPA/APK) وتقديم حلول مفصلة وواضحة باللغة العربية.
                1.  ابدأ بتشخيص السبب المحتمل للخطأ.
                2.  قدم قائمة خطوات عملية ومرقمة لحل المشكلة.
                3.  اشرح كل خطوة بوضوح.
                4.  استخدم تنسيق Markdown لجعل التقرير سهل القراءة.
            `;
            
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `حلل رسالة الخطأ التالية: \n\n---\n${errorLog}\n---`,
                config: { systemInstruction }
            });

            setAnalysisReport(result.text || "لم يتمكن المحلل من توليد تقرير.");
        } catch (e: any) {
            setAnalysisReport(`❌ فشل التحليل: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 font-sans" dir="rtl">
            <div className="flex items-center gap-6 mb-12 border-b border-gray-700 pb-8">
                <div className="p-4 bg-teal-600 rounded-2xl shadow-lg shadow-teal-900/50">
                    <ArrowUpOnSquareIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">منصة الإطلاق السيادية</h1>
                    <p className="text-gray-400">تشخيص وحل مشاكل نشر التطبيقات في Firebase.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Inputs & Pre-flight */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col space-y-4 shadow-inner">
                        <label className="text-sm font-bold text-gray-300">المشخص الذكي</label>
                        <textarea 
                            value={errorLog}
                            onChange={(e) => setErrorLog(e.target.value)}
                            placeholder="الصق رسالة الخطأ من Firebase هنا..."
                            className="w-full h-40 p-4 bg-black/40 rounded-xl border border-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white resize-none outline-none transition-all font-mono text-sm"
                        />
                         <button
                            onClick={handleDiagnose}
                            disabled={loading || !errorLog.trim()}
                            className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-black text-lg shadow-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? <LoadingSpinner /> : <><BoltIcon className="w-6 h-6"/> تشخيص المشكلة</>}
                        </button>
                    </div>

                    <PreflightChecklist />
                    
                     <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col space-y-4 shadow-inner">
                        <label className="text-sm font-bold text-gray-300">محلل الحزم (IPA/APK)</label>
                         <label
                            htmlFor="package-upload"
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-teal-500 transition-colors"
                        >
                            {file ? (
                                <div className="text-center">
                                    <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-white">{file.name}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <DocumentArrowUpIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-gray-300">ارفع الحزمة للتحليل</p>
                                </div>
                            )}
                        </label>
                        <input id="package-upload" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".ipa,.apk" />
                    </div>
                </div>

                {/* Right Panel: Report */}
                <div className="lg:col-span-7 bg-gray-800/60 p-8 rounded-3xl border border-gray-700 flex flex-col shadow-inner min-h-[600px]">
                     <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CpuChipIcon className="w-6 h-6 text-teal-400" />
                        تقرير المحلل وخطة العمل
                    </h3>
                    <div className="flex-1 overflow-y-auto bg-black/40 rounded-xl p-6 custom-scrollbar">
                        {loading ? (
                             <div className="h-full flex flex-col items-center justify-center text-teal-400 animate-pulse">
                                <CpuChipIcon className="w-16 h-16 mb-4" />
                                <p className="font-bold">جاري تحليل الأسباب الجذرية...</p>
                            </div>
                        ) : analysisReport ? (
                            <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-gray-300" dangerouslySetInnerHTML={{ __html: analysisReport.replace(/\n/g, '<br/>') }}></div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 italic">التقرير سيظهر هنا...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SovereignLaunchpad;
