
import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';

interface GroundingChunk {
    web?: { uri: string; title: string };
    maps?: { uri: string; title: string };
}

const GroundedSearch: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [useLocation, setUseLocation] = useState(false);
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError('');
        setResponse(null);

        try {
            const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            const config: any = {
                tools: [{ googleSearch: {} }],
            };

            if (useLocation) {
                config.tools.push({ googleMaps: {} });
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    config.toolConfig = {
                        retrievalConfig: {
                            latLng: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            }
                        }
                    };
                } catch (locationError) {
                    setError("لا يمكن الحصول على الموقع. يرجى السماح بالوصول للموقع.");
                    setLoading(false);
                    return;
                }
            }

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config,
            });
            
            setResponse(result);

        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير معروف.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const sources = response?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">البحث الموثق</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">استعلام البحث</label>
                    <textarea
                        id="prompt-input"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="مثال: من فاز بآخر كأس عالم؟"
                        className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                 <div className="flex items-center">
                    <input 
                        id="location-mode"
                        type="checkbox"
                        checked={useLocation}
                        onChange={(e) => setUseLocation(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="location-mode" className="mr-2 block text-sm text-gray-300">استخدام الموقع الحالي (لاستعلامات الخرائط)</label>
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading || !prompt.trim()}
                    className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                    {loading ? <LoadingSpinner /> : 'بحث'}
                </button>
            </div>

            <div className="mt-6">
                {loading && <div className="text-center"><LoadingSpinner /></div>}
                {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                {response && (
                    <div className="p-4 bg-gray-900 rounded-lg space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">الاستجابة</h3>
                            <p className="whitespace-pre-wrap">{response.text}</p>
                        </div>
                        {sources.length > 0 && (
                             <div>
                                <h3 className="text-lg font-semibold mb-2 border-t border-gray-700 pt-4">المصادر</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {sources.map((chunk: GroundingChunk, index: number) => {
                                        const source = chunk.web || chunk.maps;
                                        if (!source || !source.uri) return null;
                                        return (
                                            <li key={index}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                                                    {source.title || source.uri}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroundedSearch;
