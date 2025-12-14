import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { 
  PaperAirplaneIcon, 
  TrashIcon, 
  CpuChipIcon, 
  UserIcon, 
  SparklesIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/solid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      // Memory Load
      const mem = localStorage.getItem('zooka_core_memory');
      if(mem) setHistory(JSON.parse(mem));
  }, []);

  useEffect(() => {
      if(history.length > 0) localStorage.setItem('zooka_core_memory', JSON.stringify(history));
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const startChat = useCallback(() => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
    if (!apiKey) return;

    const ai = new GoogleGenAI({ apiKey });
    chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: "أنت الوكيل التنفيذي لنظام ZOOKA OS. المالك هو السيد رويال هارون (@3219). كن صادقاً تماماً. لا تخترع معلومات. نفذ الأوامر بدقة وبدون مقدمات طويلة. إذا طلب منك تطوير النظام، وجهه إلى 'المهندس المعماري' أو أخبره أنك تقوم بتسجيل الطلب."
        },
        history: history.map(msg => ({ role: msg.role, parts: msg.parts.map(p => ({ text: p.text })) }))
    });
  }, [history]);

  useEffect(() => { startChat(); }, [startChat]);

  const handleSend = async () => {
      if (!input.trim() || loading) return;
      
      if (!chatRef.current) {
          // Retry initialization if key was missing previously
          startChat();
          if (!chatRef.current) {
              setHistory(prev => [...prev, { role: 'model', parts: [{ text: "عذرًا، مفتاح API مفقود. يرجى إضافته في الإعدادات." }] }]);
              return;
          }
      }

      const userMsg = input;
      setInput('');
      setHistory(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
      setLoading(true);

      try {
          const stream = await chatRef.current.sendMessageStream({ message: userMsg });
          setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);
          
          let fullText = '';
          for await (const chunk of stream) {
              const text = (chunk as GenerateContentResponse).text;
              if (text) {
                  fullText += text;
                  setHistory(prev => {
                      const newH = [...prev];
                      newH[newH.length - 1].parts[0].text = fullText;
                      return newH;
                  });
              }
          }
      } catch (e: any) {
          console.error(e);
          setHistory(prev => [...prev, { role: 'model', parts: [{ text: `خطأ في الاتصال: ${e.message}` }] }]);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-800 relative">
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <CpuChipIcon className="w-6 h-6 text-green-500" />
                <h2 className="font-bold text-white">الوكيل التنفيذي (ZOOKA CORE)</h2>
            </div>
            <button onClick={() => {setHistory([]); localStorage.removeItem('zooka_core_memory'); window.location.reload();}} className="text-gray-400 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {history.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>أنا جاهز لتلقي الأوامر يا سيدي.</p>
                </div>
            )}
            {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                        <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                    </div>
                </div>
            ))}
            {loading && <div className="text-center"><LoadingSpinner /></div>}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="أدخل أمرك هنا..." 
                className="flex-1 bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
            />
            <button onClick={handleSend} disabled={loading} className="bg-green-600 p-3 rounded-xl hover:bg-green-500 text-white"><PaperAirplaneIcon className="w-6 h-6 transform rotate-180"/></button>
        </div>
    </div>
  );
};

export default Chatbot;