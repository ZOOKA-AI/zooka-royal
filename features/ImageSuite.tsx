import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';
import { ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/solid';

type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
type ImageSize = "1K" | "2K" | "4K" | "8K";
type Mode = "generate" | "edit";

const generateLoadingMessages = [
    "جاري الاتصال بنموذج الصور...",
    "تفسير الوصف...",
    "تخيل المشهد...",
    "رسم التفاصيل الأولية...",
    "إضافة الألوان والظلال...",
    "تحسين الجودة والدقة...",
    "وضع اللمسات الأخيرة..."
];

const editLoadingMessages = [
    "جاري رفع الصورة الأصلية...",
    "تحليل محتوى الصورة...",
    "فهم التعديلات المطلوبة...",
    "تطبيق التغييرات...",
    "دمج التعديلات بسلاسة...",
    "تحسين النتيجة النهائية..."
];

const ImageSuite: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");
  const messageIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
        const messages = mode === 'generate' ? generateLoadingMessages : editLoadingMessages;
        let i = 0;
        setCurrentLoadingMessage(messages[0]);
        messageIntervalRef.current = window.setInterval(() => {
            i = (i + 1) % messages.length;
            setCurrentLoadingMessage(messages[i]);
        }, 2500);
    } else {
        if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }
    }
    return () => {
        if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
        }
    };
  }, [loading, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setError(''); // Clear previous errors
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditImagePreview(reader.result);
        } else {
          setEditImagePreview(null);
          setError('Could not generate a preview for this file.');
        }
      };
      reader.onerror = () => {
        setEditImagePreview(null);
        setError('An error occurred while reading the file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim()) return;
    if (mode === 'edit' && !editImageFile) {
        setError('يرجى رفع صورة للتعديل.');
        return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
        const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey as string });
        
        let response;
        if (mode === 'generate') {
            response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: prompt }] },
                config: { imageConfig: { aspectRatio, imageSize } },
            });
        } else { // edit mode
            const base64Data = await blobToBase64(editImageFile!);
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: editImageFile!.type } },
                        { text: prompt },
                    ],
                },
            });
        }

        let imageFound = false;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64String = part.inlineData.data;
                    setGeneratedImage(`data:${part.inlineData.mimeType};base64,${base64String}`);
                    imageFound = true;
                    break;
                }
            }
        }
        
        if (!imageFound) {
            setError("لم يرجع النموذج صورة. ربما رفض الطلب.");
        }

    } catch (err: any) {
        setError(err.message || 'حدث خطأ غير معروف.');
        if (err.message?.includes('entity was not found')) {
            setError('خطأ في مفتاح API. يرجى إعادة اختيار مفتاح صالح من مشروع مدفوع.');
        }
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [prompt, mode, aspectRatio, imageSize, editImageFile]);

  const handleDownload = () => {
      if (generatedImage) {
          const link = document.createElement('a');
          link.href = generatedImage;
          link.download = `gemini-image-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">استوديو الصور</h2>
        <div className="flex border-b border-gray-700 mb-4">
            <button onClick={() => setMode('generate')} className={`px-4 py-2 ${mode === 'generate' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>توليد</button>
            <button onClick={() => setMode('edit')} className={`px-4 py-2 ${mode === 'edit' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>تعديل</button>
        </div>

        <div className="space-y-4">
            {mode === 'edit' && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الصورة المراد تعديلها</label>
                    <div className="relative group mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-600 border-dashed rounded-xl hover:border-purple-500 transition-colors cursor-pointer bg-gray-700/30">
                        <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                        
                        <div className="space-y-2 text-center w-full">
                        {editImagePreview ? (
                            <div className="relative w-full flex justify-center">
                                <img 
                                    id="preview-image"
                                    src={editImagePreview} 
                                    alt="Preview" 
                                    className="max-h-96 w-auto rounded-lg object-contain shadow-2xl border border-gray-700" 
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                                    <div className="bg-gray-900/90 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                                        <PhotoIcon className="w-5 h-5 text-purple-400" />
                                        <span>انقر لتغيير الصورة</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 flex flex-col items-center">
                                <PhotoIcon className="mx-auto h-20 w-20 text-gray-500 mb-4 group-hover:text-purple-400 transition-colors" />
                                <div className="text-lg text-gray-300 font-medium">
                                    <span>انقر لرفع صورة</span>
                                    <span className="mx-1 text-gray-500 text-sm">أو اسحبها هنا</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP حتى 10MB</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">الوصف</label>
                <textarea
                    id="prompt-input"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'generate' ? 'مثال: صورة لقطة رائد فضاء على القمر' : 'مثال: أضف قبعة احتفال للقطة'}
                    className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            {mode === 'generate' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-1">نسبة العرض إلى الارتفاع</label>
                        <select id="aspect-ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                            <option value="1:1">1:1 (مربع)</option>
                            <option value="16:9">16:9 (أفقي)</option>
                            <option value="9:16">9:16 (عمودي)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="image-size" className="block text-sm font-medium text-gray-300 mb-1">دقة الصورة</label>
                        <select id="image-size" value={imageSize} onChange={e => setImageSize(e.target.value as ImageSize)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                            <option value="8K">8K</option>
                        </select>
                    </div>
                 </div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              {loading ? <LoadingSpinner /> : (mode === 'generate' ? 'توليد الصورة' : 'تعديل الصورة')}
            </button>
        </div>
        
        <div className="mt-6">
            {loading && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-300 text-lg animate-pulse">{currentLoadingMessage}</p>
                </div>
            )}
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            {generatedImage && (
                <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">النتيجة</h3>
                    <img id="generated-image" src={generatedImage} alt="Generated" className="rounded-lg w-full" />
                    <button
                        onClick={handleDownload}
                        className="mt-4 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>تحميل الصورة</span>
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default ImageSuite;