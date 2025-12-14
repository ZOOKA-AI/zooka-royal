import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';

type Model = 'gemini-3-pro-preview' | 'gemini-2.5-flash' | 'gemini-flash-lite-latest';

const TextPlayground: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<Model>('gemini-2.5-flash');
  const [useThinking, setUseThinking] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      const config: any = {};
      if (model === 'gemini-3-pro-preview' && useThinking) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      const result = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      setResponse(result.text ?? "لم يتم استلام أي نص.");

    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير معروف.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">ملعب النصوص</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-300 mb-1">النموذج</label>
          <select 
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value as Model)}
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="gemini-flash-lite-latest">Flash Lite (الأسرع)</option>
            <option value="gemini-2.5-flash">Flash (سريع وذكي)</option>
            <option value="gemini-3-pro-preview">Pro (الأكثر قوة)</option>
          </select>
        </div>
        
        {model === 'gemini-3-pro-preview' && (
          <div className="flex items-center">
            <input 
              id="thinking-mode"
              type="checkbox"
              checked={useThinking}
              onChange={(e) => setUseThinking(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="thinking-mode" className="mr-2 block text-sm text-gray-300">تفعيل وضع التفكير (للاستعلامات المعقدة)</label>
          </div>
        )}

        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">الوصف (Prompt)</label>
          <textarea
            id="prompt-input"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="أدخل النص هنا..."
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
        >
          {loading ? <LoadingSpinner /> : 'توليد'}
        </button>
      </div>

      {(response || error) && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">الاستجابة</h3>
          {error && <p className="text-red-400">{error}</p>}
          {response && <p className="whitespace-pre-wrap">{response}</p>}
        </div>
      )}
    </div>
  );
};

export default TextPlayground;