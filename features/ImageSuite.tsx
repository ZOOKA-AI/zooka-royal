
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { 
  ArrowDownTrayIcon, 
  PhotoIcon, 
  SparklesIcon, 
  PaintBrushIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/solid';

type Mode = "generate" | "edit";

const ImageSuite: React.FC = () => {
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

      const parts = response.candidates?.[0]?.content?.parts || [];
      const part = parts.find(p => p.inlineData);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSourceImageFile(f);
      setSourcePreview(URL.createObjectURL(f));
    }
  };

  const clearSourceImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSourceImageFile(null);
    setSourcePreview(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 pb-32 font-sans" dir="rtl">
        <header className="relative bg-gradient-to-br from-pink-900/40 to-black p-12 md:p-20 rounded-[4rem] border border-gray-800 text-center overflow-hidden shadow-2xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-900/60 p-8 md:p-12 rounded-[4rem] border border-gray-800 space-y-10 shadow-2xl">
                {mode === 'edit' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-6">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">الصورة المراد تعديلها</label>
                            {sourcePreview && (
                                <button onClick={clearSourceImage} className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 text-[10px] font-black uppercase">
                                    <XMarkIcon className="w-4 h-4"/> مسح الصورة
                                </button>
                            )}
                        </div>
                        
                        <div className="relative min-h-[350px] bg-black/40 border-2 border-dashed border-gray-700 rounded-[3.5rem] overflow-hidden flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-pink-600/50">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 opacity-0 z-20 cursor-pointer" 
                                accept="image/*"
                            />
                            
                            {sourcePreview ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <img src={sourcePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Source preview" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                        <div className="p-4 bg-pink-600 rounded-full shadow-2xl">
                                            <ArrowPathIcon className="w-8 h-8 text-white"/>
                                        </div>
                                        <span className="text-white font-black text-sm uppercase tracking-widest">تغيير الصورة</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 p-10">
                                    <div className="p-8 bg-gray-800/50 rounded-[2.5rem] inline-block border border-gray-700 group-hover:scale-110 transition-transform shadow-inner">
                                        <ArrowUpTrayIcon className="w-16 h-16 text-gray-600 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg">اسحب الصورة أو انقر للرفع</p>
                                        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-2">JPG, PNG, WebP (Max 10MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="space-y-6">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] px-6">الأوامر الاستراتيجية</label>
                    <textarea 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)} 
                        className="w-full bg-black/40 border-2 border-gray-800 rounded-[3rem] p-10 text-white text-xl outline-none focus:border-pink-600 transition-all h-56 resize-none shadow-inner leading-relaxed placeholder:text-gray-800" 
                        placeholder={mode === 'generate' ? "صف اللوحة التي تريد خلقها في عالم زوكا..." : "ما هي التحولات المطلوبة على ذرات هذه الصورة؟"} 
                    />
                </div>
                
                <button onClick={handleProcess} disabled={loading} className="w-full py-8 bg-pink-600 hover:bg-pink-500 text-white rounded-[3rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-6 transition-all active:scale-95 disabled:opacity-50">
                    {loading ? <LoadingSpinner /> : <><SparklesIcon className="w-10 h-10"/> {mode === 'generate' ? 'توليد الملحمة البصرية' : 'حقن التعديلات الذكية'}</>}
                </button>
            </div>

            <div className="bg-black border border-gray-800 rounded-[4rem] min-h-[600px] flex items-center justify-center relative overflow-hidden shadow-2xl group">
                {loading ? (
                    <div className="text-center space-y-8 animate-pulse">
                        <div className="w-24 h-24 border-t-4 border-pink-600 rounded-full animate-spin mx-auto shadow-[0_0_30px_rgba(219,39,119,0.3)]"></div>
                        <div className="space-y-2">
                            <p className="text-pink-500 font-black tracking-[0.3em] uppercase text-sm">{processLog}</p>
                            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.5em]">Quantum Image Synthesis Active</p>
                        </div>
                    </div>
                ) : generatedImage ? (
                    <div className="p-10 w-full h-full flex flex-col items-center justify-center">
                        <div className="relative w-full h-full max-h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group/img border border-white/5">
                            <img src={generatedImage} className="w-full h-full object-contain bg-gray-950" alt="Generated result" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                                <div className="flex flex-wrap justify-center gap-6">
                                    <button 
                                        onClick={handleDownload}
                                        className="px-12 py-5 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black flex items-center gap-4 shadow-2xl transition-all active:scale-95"
                                    >
                                        <ArrowDownTrayIcon className="w-6 h-6"/> تحميل النتيجة
                                    </button>
                                    <button 
                                        onClick={handleCopyToClipboard}
                                        disabled={copying}
                                        className="px-12 py-5 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:border-pink-500 text-white rounded-2xl font-black flex items-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {copying ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <ClipboardDocumentIcon className="w-6 h-6"/>}
                                        نسخ للحافظة
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12 flex flex-wrap justify-center gap-6 lg:hidden">
                            <button onClick={handleDownload} className="px-10 py-5 bg-pink-600 text-white rounded-2xl font-black flex items-center gap-4 shadow-xl">
                                <ArrowDownTrayIcon className="w-5 h-5"/> تحميل
                            </button>
                            <button onClick={() => setGeneratedImage(null)} className="px-10 py-5 bg-gray-900 text-gray-500 rounded-2xl font-black flex items-center gap-4 border border-gray-800">
                                <XMarkIcon className="w-5 h-5"/> مسح
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-10 space-y-8">
                        <PhotoIcon className="w-48 h-48 mx-auto text-gray-700" />
                        <div className="space-y-2">
                            <p className="text-gray-500 font-black uppercase tracking-[0.5em] text-lg italic">Waiting for Visual Data</p>
                            <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.8em]">Sovereign Production Pipeline Ready</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <section className="bg-gray-900/40 p-12 md:p-24 rounded-[5rem] border border-gray-800 space-y-16">
            <h2 className="text-4xl md:text-7xl font-black text-white italic text-center tracking-tighter">دليل الاستوديو <span className="text-pink-600">السيادي</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { t: "التوليد الأصلي", d: "استخدم هذا النمط لخلق صور غير موجودة في الواقع بمجرد وصفها نصياً بأسلوب استراتيجي." },
                    { t: "التعديل الذكي", d: "ارفع صورتك الخاصة واطلب من الذكاء تغيير ألوانها، خلفيتها، أو إضافة عناصر لها بدقة بكسلية." },
                    { t: "دقة الـ 4K", d: "النظام مبرمج لإنتاج أعلى دقة بصرية ممكنة لتناسب مطبوعاتك وتصميماتك العالمية الفاخرة." }
                ].map((step, i) => (
                    <div key={i} className="bg-black/60 p-12 rounded-[4rem] border border-gray-800 space-y-6 shadow-inner hover:border-pink-500/30 transition-all">
                        <div className="text-pink-500 font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-pink-600"></span> {step.t}
                        </div>
                        <p className="text-gray-400 font-bold leading-relaxed text-lg">{step.d}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default ImageSuite;
