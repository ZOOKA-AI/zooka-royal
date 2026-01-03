
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  ArrowDownTrayIcon, 
  PhotoIcon, 
  SparklesIcon, 
  PaintBrushIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

type Mode = "generate" | "edit";

export const ImageSuite: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processLog, setProcessLog] = useState('');
  const [copying, setCopying] = useState(false);

  const handleProcess = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setProcessLog(mode === 'generate' ? 'جاري استدعاء محرك التوليد...' : 'جاري حقن التعديلات في ذرات الصورة...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      let response;

      if (mode === 'generate') {
        response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
        });
      } else {
        if (!sourceImageFile) throw new Error("يرجى رفع الصورة المراد تعديلها");
        const base64Data = await blobToBase64(sourceImageFile);
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: sourceImageFile.type } },
              { text: prompt }
            ]
          }
        });
      }

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
      setProcessLog('');
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `zooka-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    if (!generatedImage) return;
    setCopying(true);
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      alert("تم نسخ الصورة إلى الحافظة بنجاح!");
    } catch (err) {
      console.error("Clipboard Error:", err);
      alert("عذراً، لا يدعم متصفحك نسخ الصور المباشر.");
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 pb-32 font-sans" dir="rtl">
        {/* Header Micro-Site */}
        <header className="relative bg-gradient-to-br from-pink-900/40 to-black p-12 md:p-20 rounded-[4rem] border border-gray-800 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
            <div className="relative z-10 space-y-6">
                <div className="bg-pink-600/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                    <PhotoIcon className="w-12 h-12 text-pink-500" />
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter">استوديو الصور <span className="text-pink-600">السيادي</span></h1>
                <p className="text-gray-400 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                    من هنا تبدأ صناعة الهوية البصرية لإمبراطوريتك. اختر التوليد من الصفر أو التعديل الاستراتيجي.
                </p>
                <div className="flex justify-center gap-4 pt-10">
                    <button onClick={() => setMode('generate')} className={`px-10 py-4 rounded-2xl font-black transition-all ${mode === 'generate' ? 'bg-pink-600 text-white shadow-xl scale-105' : 'bg-gray-900 text-gray-500 hover:text-white'}`}>توليد أصلي</button>
                    <button onClick={() => setMode('edit')} className={`px-10 py-4 rounded-2xl font-black transition-all ${mode === 'edit' ? 'bg-pink-600 text-white shadow-xl scale-105' : 'bg-gray-900 text-gray-500 hover:text-white'}`}>تعديل ذكي</button>
                </div>
            </div>
        </header>

        {/* Tool Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-900/60 p-10 rounded-[4rem] border border-gray-800 space-y-8 shadow-2xl">
                {mode === 'edit' && (
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">رفع الصورة المصدر</label>
                        <div className="relative h-64 bg-black/40 border-2 border-dashed border-gray-700 rounded-[3rem] overflow-hidden flex items-center justify-center group cursor-pointer">
                            <input type="file" onChange={e => {
                                const f = e.target.files?.[0];
                                if(f) { setSourceImageFile(f); setSourcePreview(URL.createObjectURL(f)); }
                            }} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                            {sourcePreview ? <img src={sourcePreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" /> : <PaintBrushIcon className="w-16 h-16 text-gray-700" />}
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">الأوامر التنفيذية</label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-black/40 border-2 border-gray-800 rounded-[2.5rem] p-8 text-white text-xl outline-none focus:border-pink-600 transition-all h-48" placeholder={mode === 'generate' ? "صف اللوحة التي تريد خلقها..." : "ما هي التعديلات المطلوبة على هذه الصورة؟"} />
                </div>
                <button onClick={handleProcess} disabled={loading} className="w-full py-6 bg-pink-600 hover:bg-pink-500 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all">
                    {loading ? <LoadingSpinner /> : <><SparklesIcon className="w-8 h-8"/> {mode === 'generate' ? 'توليد الملحمة' : 'تطبيق التعديل'}</>}
                </button>
            </div>

            <div className="bg-black border border-gray-800 rounded-[4rem] min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-2xl group">
                {loading ? (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 border-t-4 border-pink-600 rounded-full animate-spin mx-auto"></div>
                        <p className="text-pink-500 font-black tracking-widest animate-pulse uppercase">{processLog}</p>
                    </div>
                ) : generatedImage ? (
                    <div className="p-8 w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-full h-full max-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group/img">
                            <img src={generatedImage} className="w-full h-full object-contain bg-gray-950" alt="Generated result" />
                            
                            {/* Action Bar Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover/img:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                                <button 
                                    onClick={handleDownload}
                                    className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5"/> تحميل الصورة
                                </button>
                                <button 
                                    onClick={handleCopyToClipboard}
                                    disabled={copying}
                                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {copying ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <ClipboardDocumentIcon className="w-5 h-5"/>}
                                    نسخ
                                </button>
                            </div>
                        </div>
                        
                        {/* Static buttons below for mobile/better visibility */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button onClick={handleDownload} className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black flex items-center gap-4 transition-all shadow-xl">
                                <ArrowDownTrayIcon className="w-6 h-6"/> تحميل الصورة النهائية
                            </button>
                            <button onClick={() => setGeneratedImage(null)} className="px-12 py-4 bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-white rounded-2xl font-black flex items-center gap-4 transition-all border border-gray-800">
                                <XMarkIcon className="w-6 h-6"/> مسح المعاينة
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-20 space-y-4">
                        <PhotoIcon className="w-32 h-32 mx-auto text-gray-700" />
                        <p className="text-gray-500 font-black uppercase tracking-widest">انتظار البيانات البصرية...</p>
                    </div>
                )}
            </div>
        </div>

        {/* Documentation Section */}
        <section className="bg-gray-900/40 p-12 md:p-20 rounded-[5rem] border border-gray-800 space-y-12">
            <h2 className="text-4xl md:text-6xl font-black text-white italic text-center">دليل الاستوديو <span className="text-pink-600">السيادي</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { t: "التوليد الأصلي", d: "استخدم هذا النمط لخلق صور غير موجودة في الواقع بمجرد وصفها نصياً." },
                    { t: "التعديل الذكي", d: "ارفع صورتك الخاصة واطلب من الذكاء تغيير ألوانها، خلفيتها، أو إضافة عناصر لها." },
                    { t: "دقة الـ 4K", d: "النظام مبرمج لإنتاج أعلى دقة بصرية ممكنة لتناسب مطبوعاتك وتصميماتك العالمية." }
                ].map((step, i) => (
                    <div key={i} className="bg-black/60 p-8 rounded-[3rem] border border-gray-800 space-y-4">
                        <div className="text-pink-500 font-black text-xs uppercase tracking-widest">{step.t}</div>
                        <p className="text-gray-400 font-bold leading-relaxed">{step.d}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default ImageSuite;
