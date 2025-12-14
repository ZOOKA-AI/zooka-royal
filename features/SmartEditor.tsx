import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ClipboardDocumentCheckIcon, 
  LanguageIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  Bars3BottomRightIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/solid';

type ActionType = 'summarize' | 'improve' | 'fix_grammar' | 'translate_en' | 'translate_ar' | 'extract_points';

const SmartEditor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');

  const actions = [
    { id: 'improve', label: 'تحسين الصياغة', icon: <SparklesIcon className="w-5 h-5" />, prompt: "Rewrite the following text to be more professional, eloquent, and clear. Maintain the original meaning but enhance the style:" },
    { id: 'fix_grammar', label: 'تدقيق لغوي', icon: <CheckBadgeIcon className="w-5 h-5" />, prompt: "Fix all grammar, spelling, and punctuation errors in the following text. Provide only the corrected text:" },
    { id: 'summarize', label: 'تلخيص', icon: <Bars3BottomRightIcon className="w-5 h-5" />, prompt: "Summarize the following text into a concise paragraph, capturing the main points:" },
    { id: 'extract_points', label: 'استخراج النقاط', icon: <DocumentTextIcon className="w-5 h-5" />, prompt: "Extract the key points and action items from the following text as a bulleted list:" },
    { id: 'translate_en', label: 'ترجمة للإنجليزية', icon: <LanguageIcon className="w-5 h-5" />, prompt: "Translate the following text to fluent, professional English:" },
    { id: 'translate_ar', label: 'ترجمة للعربية', icon: <LanguageIcon className="w-5 h-5" />, prompt: "Translate the following text to fluent, professional Arabic:" },
  ];

  const handleAction = async (actionId: string, promptPrefix: string) => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setCurrentAction(actionId);
    setOutputText('');

    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
      const fullPrompt = `${promptPrefix}\n\n---\n${inputText}\n---`;
      
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      setOutputText(result.text || 'لم يتم استلام نص.');
    } catch (error) {
      console.error(error);
      setOutputText('حدث خطأ أثناء المعالجة. يرجى التأكد من مفتاح API.');
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-800 rounded-lg min-h-[85vh] flex flex-col">
      <div className="flex items-center space-x-3 space-x-reverse mb-6 border-b border-gray-700 pb-4">
        <PencilSquareIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold">المحرر الذكي</h2>
          <p className="text-gray-400 text-sm">مساعدك الشخصي لصياغة، تدقيق، وترجمة النصوص.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input Section */}
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex-1 flex flex-col">
             <label className="text-gray-300 font-semibold mb-2 flex justify-between">
               <span>النص الأصلي</span>
               <span className="text-xs text-gray-500 font-normal">{inputText.length} حرف</span>
             </label>
             <textarea
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="الصق النص هنا أو اكتب ما تريد..."
               className="w-full flex-1 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
             />
          </div>

          {/* Quick Actions Toolbar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id, action.prompt)}
                disabled={loading || !inputText.trim()}
                className={`flex items-center justify-center space-x-2 space-x-reverse p-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] ${
                   loading && currentAction === action.id 
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && currentAction === action.id ? <LoadingSpinner /> : action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col">
           <div className={`bg-gray-900 p-4 rounded-lg border border-gray-700 flex-1 flex flex-col transition-all duration-300 ${outputText ? 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : ''}`}>
             <div className="flex justify-between items-center mb-2">
               <label className="text-gray-300 font-semibold">النتيجة</label>
               {outputText && (
                 <button 
                   onClick={handleCopy}
                   className="flex items-center space-x-1 space-x-reverse text-xs text-green-400 hover:text-green-300 bg-green-900/30 px-2 py-1 rounded transition-colors"
                 >
                   <ClipboardDocumentCheckIcon className="w-4 h-4" />
                   <span>نسخ النص</span>
                 </button>
               )}
             </div>
             
             <div className="flex-1 bg-black/20 rounded-md p-4 overflow-y-auto border border-gray-800 relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center flex-col space-y-3">
                    <LoadingSpinner />
                    <p className="text-gray-500 text-sm animate-pulse">جاري المعالجة باستخدام Gemini...</p>
                  </div>
                ) : outputText ? (
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-200">{outputText}</p>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600">
                    <p>ستظهر النتيجة هنا...</p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon component since it was missing in imports
const PencilSquareIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
  </svg>
);

export default SmartEditor;