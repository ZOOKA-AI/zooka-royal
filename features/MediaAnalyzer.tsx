
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { blobToBase64 } from '../utils';

type Mode = "image" | "video";

const MediaAnalyzer: React.FC = () => {
    const [mode, setMode] = useState<Mode>('image');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyze = useCallback(async () => {
        if (!prompt.trim() || !imageFile) {
            setError("يرجى رفع صورة وإدخال وصف.");
            return;
        }

        setLoading(true);
        setError('');
        setResponse('');

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const base64Data = await blobToBase64(imageFile);
            
            const result = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: imageFile.type } },
                        { text: prompt },
                    ],
                },
            });

            setResponse(result.text ?? "لم يتم استلام استجابة نصية.");

        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير معروف.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [prompt, imageFile]);

    const renderImageAnalyzer = () => (
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الصورة المراد تحليلها</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-lg object-contain" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <div className="flex text-sm text-gray-400 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-purple-500">
                        <span>{imageFile ? 'تغيير الصورة' : 'رفع صورة'}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">السؤال</label>
                <textarea id="prompt-input" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="مثال: ماذا يوجد في هذه الصورة؟ صفها بالتفصيل." className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500" />
            </div>
             <button onClick={handleAnalyze} disabled={loading || !prompt.trim() || !imageFile} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 transition-colors flex items-center justify-center">
                {loading ? <LoadingSpinner /> : 'تحليل الصورة'}
            </button>
        </div>
    );
    
    const renderVideoAnalyzer = () => (
        <div className="text-center p-8 bg-gray-900 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">تحليل الفيديو</h3>
            <p className="text-gray-400">هذه الميزة قادمة قريباً! يدعم Gemini API فهم الفيديو، وسيتم تحديث هذا القسم للسماح برفع الفيديوهات وتحليلها.</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">محلل الوسائط</h2>
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setMode('image')} className={`px-4 py-2 ${mode === 'image' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>صور</button>
                <button onClick={() => setMode('video')} className={`px-4 py-2 ${mode === 'video' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}>فيديو (قريباً)</button>
            </div>
            
            {mode === 'image' ? renderImageAnalyzer() : renderVideoAnalyzer()}

            {(response || error) && mode === 'image' && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">التحليل</h3>
                    {error && <p className="text-red-400">{error}</p>}
                    {response && <p className="whitespace-pre-wrap">{response}</p>}
                </div>
            )}
        </div>
    );
};

export default MediaAnalyzer;
