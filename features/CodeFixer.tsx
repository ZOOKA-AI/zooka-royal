
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  WrenchScrewdriverIcon, 
  BoltIcon, 
  CodeBracketSquareIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/solid';

const CodeFixer: React.FC = () => {
    const [inputCode, setInputCode] = useState('');
    const [analysisReport, setAnalysisReport] = useState('');
    const [fixedCode, setFixedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'report' | 'code'>('report');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInputCode(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyzeAndFix = async () => {
        if (!inputCode.trim()) return;
        setLoading(true);
        setAnalysisReport('');
        setFixedCode('');
        setActiveTab('report');

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            if (!apiKey) throw new Error("API Key not found in Sovereign Vault.");

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
              You are a world-class senior software engineer and code optimizer, acting as the "Sovereign Fixer" for ZOOKA OS.
              Your task is to analyze the following code, identify all errors, potential bugs, style issues, and performance bottlenecks, and then provide a fixed, optimized, and cleaner version of the code.

              Analyze this code:
              \`\`\`
              ${inputCode}
              \`\`\`

              Provide your response in a single, clean JSON object with the following structure. Do NOT include any text outside of this JSON object.
              {
                "analysisReport": "A detailed but concise report in Markdown format, in Arabic. List the issues found (e.g., 'خطأ في الصياغة', 'مشكلة أداء', 'نمط غير متسق') and explain the fixes you applied for each.",
                "fixedCode": "The complete, corrected, and optimized version of the code as a single string."
              }
            `;
            
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            const data = JSON.parse(result.text || '{}');
            setAnalysisReport(data.analysisReport || "لم يتمكن الذكاء الاصطناعي من توليد تقرير.");
            setFixedCode(data.fixedCode || "لم يتمكن الذكاء الاصطناعي من إصلاح الكود.");

        } catch (e: any) {
            console.error(e);
            setAnalysisReport(`❌ حدث خطأ فادح أثناء عملية الإصلاح: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-900/50 backdrop-blur-sm rounded-[3rem] border border-gray-800 min-h-[85vh] flex flex-col shadow-2xl font-sans" dir="rtl">
            <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                <div className="p-4 bg-yellow-600 rounded-2xl shadow-lg shadow-yellow-900/50">
                    <WrenchScrewdriverIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">المُصلح السيادي (Code Fixer)</h1>
                    <p className="text-gray-400">مهندس الصيانة الآلي لتحسين وأمان الشيفرة البرمجية.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Input Panel */}
                <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col space-y-4 shadow-inner">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-300">الشيفرة المصدرية</label>
                        <label htmlFor="file-upload" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-bold">
                            <CloudArrowUpIcon className="w-5 h-5"/>
                            <span>رفع ملف</span>
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    <textarea 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="الصق الكود هنا أو ارفع ملفًا..."
                        className="w-full flex-1 p-4 bg-black/40 rounded-xl border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white font-mono text-sm resize-none outline-none transition-all"
                    />
                    <button
                        onClick={handleAnalyzeAndFix}
                        disabled={loading || !inputCode.trim()}
                        className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black rounded-xl font-black text-lg shadow-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading ? <LoadingSpinner /> : <><BoltIcon className="w-6 h-6"/> تحليل وإصلاح</>}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="bg-gray-800/60 p-6 rounded-3xl border border-gray-700 flex flex-col shadow-inner">
                    <div className="flex border-b border-gray-700 mb-4">
                        <button onClick={() => setActiveTab('report')} className={`px-4 py-2 font-bold flex items-center gap-2 ${activeTab === 'report' ? 'border-b-2 border-yellow-500 text-white' : 'text-gray-400'}`}><DocumentTextIcon className="w-5 h-5"/> تقرير التحليل</button>
                        <button onClick={() => setActiveTab('code')} className={`px-4 py-2 font-bold flex items-center gap-2 ${activeTab === 'code' ? 'border-b-2 border-yellow-500 text-white' : 'text-gray-400'}`}><CodeBracketSquareIcon className="w-5 h-5"/> الكود المُصلح</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto relative bg-black/40 rounded-xl p-4">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-yellow-400 animate-pulse">
                                <WrenchScrewdriverIcon className="w-16 h-16 mb-4" />
                                <p className="font-bold">جاري تطبيق الإصلاحات السيادية...</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'report' && (
                                    <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-gray-300">
                                       {analysisReport || "التقرير سيظهر هنا بعد التحليل."}
                                    </div>
                                )}
                                {activeTab === 'code' && (
                                    <>
                                        {fixedCode && (
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(fixedCode)}
                                                className="absolute top-4 left-4 z-10 bg-gray-700 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <ClipboardDocumentCheckIcon className="w-4 h-4" /> نسخ
                                            </button>
                                        )}
                                        <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                                            {fixedCode || "الشيفرة البرمجية المُحسنة ستظهر هنا."}
                                        </pre>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeFixer;
