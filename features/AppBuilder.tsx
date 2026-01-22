import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  CommandLineIcon, 
  CodeBracketIcon, 
  BoltIcon,
  CpuChipIcon,
  PhotoIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

const AppBuilder: React.FC = () => {
  const [appDescription, setAppDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [buildLogs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBuild = async () => {
    if (!appDescription.trim()) return;
    setIsBuilding(true);
    setBuildLogs([]);
    setGeneratedCode('');

    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      if (!apiKey) throw new Error("مفتاح API غير موجود في الخزنة.");
      
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      const steps = [
          "تحليل المتطلبات النصية...",
          uploadedImage ? "تحليل المخطط البصري (Vision Core)..." : "تخطي التحليل البصري...",
          "فحص بيئة Google Cloud...",
          "تصحيح أخطاء تسمية الموارد (Naming Standards)...",
          "توليد البنية التحتية (Infrastructure as Code)...",
          "حقن واجهات الاستخدام (UI Injection)..."
      ];

      for (const step of steps) {
          setBuildLogs(prev => [...prev, step]);
          await new Promise(resolve => setTimeout(resolve, 800));
      }

      const parts: any[] = [{ text: `Create a professional React web application code based on this description: ${appDescription}. Use Tailwind CSS for styling.` }];
      if (uploadedImage) {
        const base64Data = await blobToBase64(uploadedImage);
        parts.unshift({
          inlineData: {
            mimeType: uploadedImage.type,
            data: base64Data,
          },
        });
        parts[1].text = `Analyze the provided image (likely a cloud architecture diagram or error screenshot) in conjunction with the text description. The image provides critical context. Based on BOTH, create a professional React web application. Text description: ${appDescription}. Use Tailwind CSS for styling.`;
      }
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
            systemInstruction: "You are the Senior Cloud Architect for ZOOKA OS. Your task is to analyze user requests, including any architectural diagrams or error screenshots, and generate sovereign, high-performance web application code. If you see an error in an uploaded image, explain the error and provide the corrected code or solution. Return only pure code, unless the user is asking for an explanation of an error."
        }
      });

      setGeneratedCode(response.text || '');
      setBuildLogs(prev => [...prev, "✅ اكتمل بناء النظام السيادي بنجاح."]);

    } catch (e: any) {
      setBuildLogs(prev => [...prev, `❌ فشل البناء: ${e.message}`]);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 min-h-screen text-white rounded-[3rem] border border-gray-800 shadow-2xl font-sans" dir="rtl">
        <div className="flex items-center gap-6 mb-10 border-b border-gray-700 pb-8">
            <div className="p-5 bg-blue-600 rounded-3xl shadow-xl">
                <CodeBracketIcon className="w-12 h-12 text-white" />
            </div>
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">المهندس المعماري (App Builder)</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Sovereign Software Engineering Protocol</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="bg-gray-800 p-8 rounded-[2.5rem] border border-gray-700 space-y-6">
                    <div>
                        <label className="block text-gray-400 font-black mb-4 uppercase tracking-widest text-xs">1. وصف المشروع / المتطلبات</label>
                        <textarea 
                            value={appDescription}
                            onChange={(e) => setAppDescription(e.target.value)}
                            placeholder="صف التطبيق أو اشرح المشكلة..."
                            className="w-full h-40 bg-black/40 border border-gray-700 rounded-2xl p-6 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-lg"
                        />
                    </div>
                     <div>
                        <label className="block text-gray-400 font-black mb-4 uppercase tracking-widest text-xs">2. المخطط البصري (اختياري)</label>
                        <div className="relative h-48 bg-black/40 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center group cursor-pointer">
                            <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
                                    <button onClick={() => { setUploadedImage(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full z-10">
                                        <XCircleIcon className="w-6 h-6"/>
                                    </button>
                                </>
                            ) : (
                                <div className="text-center text-gray-600">
                                    <PhotoIcon className="w-12 h-12 mx-auto mb-2"/>
                                    <p className="text-sm font-bold">ارفع مخططاً أو صورة خطأ</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleBuild}
                        disabled={isBuilding || !appDescription.trim()}
                        className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isBuilding ? <LoadingSpinner /> : <><BoltIcon className="w-6 h-6"/> بدء عملية البناء</>}
                    </button>
                </div>

                <div className="bg-black/60 p-8 rounded-[2.5rem] border border-gray-800 h-[280px] flex flex-col font-mono shadow-inner">
                    <h3 className="text-xs font-black text-blue-500 flex items-center gap-3 uppercase tracking-widest border-b border-gray-800 pb-4 mb-4">
                        <CommandLineIcon className="w-5 h-5"/> سجلات البناء (Build Logs)
                    </h3>
                    <div ref={logsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar text-[11px] space-y-2">
                        {buildLogs.map((log, i) => (
                            <div key={i} className="text-green-500/80">
                                <span className="text-blue-500 ml-2">➜</span> {log}
                            </div>
                        ))}
                        {isBuilding && <div className="text-white animate-pulse">...جاري المعالجة الرقمية</div>}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-[3rem] border border-gray-700 overflow-hidden flex flex-col min-h-[600px] shadow-2xl relative">
                <div className="p-6 bg-black/40 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">معاينة الكود المولد</span>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto bg-black/20 custom-scrollbar">
                    {generatedCode ? (
                        <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                            {generatedCode}
                        </pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-700 italic space-y-6 text-center">
                            <CpuChipIcon className="w-20 h-20 opacity-10" />
                            <p className="text-sm font-black uppercase tracking-widest">بانتظار تعليمات البناء من النواة المركزية</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AppBuilder;