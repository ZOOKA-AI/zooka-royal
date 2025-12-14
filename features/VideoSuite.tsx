import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';

type AspectRatio = "16:9" | "9:16";
type Mode = "generate" | "animate";

const loadingMessages = [
    "جاري الاتصال بنموذج الفيديو...",
    "إحماء البكسلات...",
    "توليد الإطارات الأولية...",
    "تحليل تفاصيل الوصف...",
    "تجميع مقاطع الفيديو...",
    "تطبيق السحر السينمائي...",
    "إنهاء عرض الفيديو...",
    "قد يستغرق هذا بضع دقائق..."
];

const VideoSuite: React.FC = () => {
    const [mode, setMode] = useState<Mode>('generate');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

    const [animateImageFile, setAnimateImageFile] = useState<File | null>(null);
    const [animateImagePreview, setAnimateImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
    
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (loading) {
            let i = 0;
            messageIntervalRef.current = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setCurrentLoadingMessage(loadingMessages[i]);
            }, 5000);
        } else {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
            setCurrentLoadingMessage(loadingMessages[0]);
        }
        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [loading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAnimateImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAnimateImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() && mode === 'generate') {
            setError('يرجى إدخال وصف.');
            return;
        }
         if (mode === 'animate' && !animateImageFile) {
            setError('يرجى رفع صورة لتحريكها.');
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedVideo(null);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });

            const generationConfig = {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            };

            const payload: any = {
                model: 'veo-3.1-fast-generate-preview',
                prompt,
                config: generationConfig,
            };

            if (mode === 'animate' && animateImageFile) {
                payload.image = {
                    imageBytes: await blobToBase64(animateImageFile),
                    mimeType: animateImageFile.type,
                };
            }
            
            let operation = await ai.models.generateVideos(payload);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${apiKey}`);
                const videoBlob = await response.blob();
                setGeneratedVideo(URL.createObjectURL(videoBlob));
            } else {
                setError("فشل توليد الفيديو أو لم يتم إرجاع أي نتيجة.");
            }

        } catch (err: any) {
            const message = err.message || 'حدث خطأ غير معروف أثناء توليد الفيديو.';
            setError(message);
             if (message?.includes('entity was not found')) {
                setError('خطأ في مفتاح API. يرجى إعادة اختيار مفتاح صالح من مشروع مدفوع.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [prompt, mode, aspectRatio, animateImageFile]);

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">استوديو الفيديو (Veo)</h2>
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setMode('generate')} className={`px-4 py-2 ${mode === 'generate' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>توليد</button>
                <button onClick={() => setMode('animate')} className={`px-4 py-2 ${mode === 'animate' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>تحريك</button>
            </div>

            <div className="space-y-4">
                {mode === 'animate' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">الصورة المراد تحريكها</label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {animateImagePreview ? (
                                     <img src={animateImagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg object-contain" />
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                                <div className="flex text-sm text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-purple-500">
                                    <span>{animateImageFile ? 'تغيير الصورة' : 'رفع صورة'}</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">الوصف</label>
                    <textarea id="prompt-input" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={mode === 'generate' ? "مثال: أسد مهيب يزأر على منحدر عند شروق الشمس" : "مثال: اجعل الغيوم تتحرك والشمس تلمع"} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-1">نسبة العرض إلى الارتفاع</label>
                    <select id="aspect-ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600">
                        <option value="16:9">16:9 (أفقي)</option>
                        <option value="9:16">9:16 (عمودي)</option>
                    </select>
                </div>
                <button onClick={handleSubmit} disabled={loading} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 transition-colors flex items-center justify-center">
                    {loading ? <LoadingSpinner /> : (mode === 'generate' ? 'توليد الفيديو' : 'تحريك الصورة')}
                </button>
            </div>

            <div className="mt-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-300 text-lg">{currentLoadingMessage}</p>
                    </div>
                )}
                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                {generatedVideo && (
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">النتيجة</h3>
                        <video src={generatedVideo} controls autoPlay loop className="rounded-lg w-full"></video>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoSuite;