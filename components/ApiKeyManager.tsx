import React, { useState, useEffect, useCallback } from 'react';

interface ApiKeyManagerProps {
  onKeyReady: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeyReady }) => {
  const [keySelected, setKeySelected] = useState(false);

  const checkAndSetKey = useCallback(async () => {
    // Access aistudio safely via type assertion to avoid global type conflicts
    const win = window as any;
    if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (hasKey) {
        setKeySelected(true);
        onKeyReady();
      }
    }
  }, [onKeyReady]);

  useEffect(() => {
    checkAndSetKey();
  }, [checkAndSetKey]);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio && typeof win.aistudio.openSelectKey === 'function') {
      try {
        await win.aistudio.openSelectKey();
        // Assume success and proceed to avoid race conditions
        setKeySelected(true);
        onKeyReady();
      } catch (error) {
        console.error("Error opening API key selection:", error);
      }
    }
  };
  
  if (keySelected) {
    return null; // Key is ready, component can be unmounted or hidden
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">مطلوب مفتاح API</h2>
      <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
        تتطلب هذه الميزة مشروع Google Cloud مدفوع. يرجى اختيار مفتاح API للمتابعة.
        يمكنك العثور على مزيد من المعلومات حول الفوترة على{' '}
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline" dir="ltr">
          ai.google.dev/gemini-api/docs/billing
        </a>.
      </p>
      <button
        onClick={handleSelectKey}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
      >
        اختر مفتاح API
      </button>
    </div>
  );
};