import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  CommandLineIcon, 
  CodeBracketIcon, 
  DocumentPlusIcon,
  ServerStackIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

const AppBuilder: React.FC = () => {
  const [appDescription, setAppDescription] = useState('');
  const [techStack, setTechStack] = useState('React, Tailwind, Gemini API');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [evolutionMode, setEvolutionMode] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const mode = localStorage.getItem('zooka_evolution_mode') === 'true';
      setEvolutionMode(mode);
  }, []);

  useEffect(() => {
    if (logsContainerRef.current) logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  }, [buildLogs]);

  const handleBuild = async () => {
    if (!appDescription.trim()) return;
    setIsBuilding(true);
    setBuildLogs([]);
    setGeneratedCode('');

    try {
      const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      if (!apiKey) throw new Error("مفتاح API مفقود. يرجى إضافته في الخزنة.");

      const ai = new GoogleGenAI({ apiKey });
      
      // Simulation Logs
      const steps = [
          evolutionMode ? "⚠️ ACCESSING CORE SYSTEM (EVOLUTION MODE)..." : "Initializing Sandbox Environment...",
          "Analyzing Requirements...",
          "Constructing Architecture...",
          "Writing Code...",
          "Verifying Integrity..."
      ];

      for (const step of steps) {
          setBuildLogs(prev => [...prev, `[SYSTEM] ${step}`]);
          await new Promise(r => setTimeout(r, 800));
      }

      const promptText = `
        IDENTITY: You are the Senior Software Architect for "ZOOKA OS" (Royal Haroun Entity).
        COMMANDER: The user is the OWNER (@3219).
        MODE: ${evolutionMode ? "INTERNAL_SELF_EVOLUTION (MODIFYING ZOOKA ITSELF)" : "EXTERNAL_PROJECT_BUILDER"}
        
        STRICT ORDERS:
        1. OBEY the Owner's command immediately. Do not hesitate.
        2. BE HONEST. Do not say you did something if you didn't.
        3. DO NOT spin around or use filler words. Go straight to the code.
        4. If in EVOLUTION MODE, generate React/TypeScript code that fits into the 'features/' folder of this current app.
        
        TASK: "${appDescription}"
        STACK: ${techStack}
        
        OUTPUT:
        Provide the complete, functional code block.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: promptText,
        config: { thinkingConfig: { thinkingBudget: 1024 } }
      });

      setGeneratedCode(result.text || '// Error: No code generated.');
      setBuildLogs(prev => [...prev, "[SUCCESS] Build Complete."]);

    } catch (error: any) {
      setBuildLogs(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-4 rounded-lg min-h-[85vh] flex flex-col transition-colors ${evolutionMode ? 'bg-red-950/20 border-2 border-red-900' : 'bg-gray-800'}`}>
      <div className="flex items-center space-x-3 space-x-reverse mb-6 border-b border-gray-700 pb-4">
        <div className={`p-2 rounded-lg shadow-lg ${evolutionMode ? 'bg-red-600' : 'bg-purple-600'}`}>
            {evolutionMode ? <WrenchScrewdriverIcon className="w-8 h-8 text-white animate-pulse" /> : <CommandLineIcon className="w-8 h-8 text-white" />}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white">
                {evolutionMode ? 'المطور الداخلي (تطوير الكيان)' : 'المهندس المعماري (AI Architect)'}
            </h2>
            <p className="text-gray-400 text-sm">
                {evolutionMode ? 'تحذير: أنت تقوم بتعديل كود النظام الأساسي. كن دقيقاً.' : 'بيئة تطوير التطبيقات الخارجية.'}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">الأمر البرمجي</label>
                <textarea
                  rows={6}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder={evolutionMode ? "مثال: قم بتحسين واجهة الشات وإضافة زر مسح الذاكرة..." : "وصف التطبيق الذي تريد بناءه..."}
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 focus:border-purple-500 text-white"
                />
                <button
                    onClick={handleBuild}
                    disabled={isBuilding || !appDescription}
                    className={`w-full mt-4 py-3 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                        isBuilding ? 'bg-gray-700 text-gray-500' : 
                        evolutionMode ? 'bg-red-600 hover:bg-red-500 text-white' : 
                        'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                >
                    {isBuilding ? <LoadingSpinner /> : <><ServerStackIcon className="w-5 h-5"/> {evolutionMode ? 'تنفيذ التعديل الداخلي' : 'بناء التطبيق'}</>}
                </button>
            </div>
            
            <div className="bg-black rounded-xl border border-gray-800 p-4 h-48 overflow-y-auto font-mono text-xs" ref={logsContainerRef}>
                {buildLogs.map((log, i) => (
                    <div key={i} className="text-green-400 mb-1">{log}</div>
                ))}
                {isBuilding && <div className="animate-pulse text-green-500">_</div>}
            </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-700 flex flex-col overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-300">الكود الناتج</span>
                <CodeBracketIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 relative">
                <textarea 
                    readOnly 
                    value={generatedCode} 
                    className="absolute inset-0 w-full h-full bg-transparent p-4 text-sm font-mono text-blue-100 resize-none focus:outline-none"
                    placeholder="// سيظهر الكود هنا..."
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;