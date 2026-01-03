import React, { useState, useEffect } from 'react';
import { 
  ServerStackIcon, 
  CommandLineIcon, 
  BoltIcon, 
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  WifiIcon
} from '@heroicons/react/24/solid';

const SystemCore: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [uptime, setUptime] = useState(0);

  // Helper to add log
  const logEvent = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  useEffect(() => {
      // 1. Check Connectivity
      window.addEventListener('online', () => { setIsOnline(true); logEvent("Network Status: ONLINE"); });
      window.addEventListener('offline', () => { setIsOnline(false); logEvent("Network Status: OFFLINE"); });

      // 2. Check API Key
      const key = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
      if (key) {
          setHasApiKey(true);
          logEvent("API Key detected in secure storage.");
      } else {
          setHasApiKey(false);
          logEvent("WARNING: No API Key found. AI features will be limited.");
      }

      // 3. Start Uptime Timer
      const interval = setInterval(() => setUptime(u => u + 1), 1000);
      
      logEvent("System Core Initialized.");
      
      return () => clearInterval(interval);
  }, []);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-black min-h-screen font-mono text-green-400 relative overflow-hidden rounded-xl border border-gray-800">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <ServerStackIcon className="w-10 h-10 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">نواة النظام (SYSTEM CORE)</h1>
            <p className="text-xs text-gray-500">REAL-TIME DIAGNOSTICS</p>
          </div>
        </div>
        <div className="text-right">
            <div className="text-xs text-gray-500">UPTIME</div>
            <div className="text-white font-bold">{formatUptime(uptime)}</div>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Connectivity */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
              <div>
                  <h3 className="text-gray-400 text-sm mb-1">حالة الاتصال</h3>
                  <div className={`text-xl font-bold ${isOnline ? 'text-green-400' : 'text-red-500'}`}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </div>
              </div>
              <WifiIcon className={`w-8 h-8 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
          </div>

          {/* API Status */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
              <div>
                  <h3 className="text-gray-400 text-sm mb-1">ترخيص الذكاء (API)</h3>
                  <div className={`text-xl font-bold ${hasApiKey ? 'text-blue-400' : 'text-yellow-500'}`}>
                      {hasApiKey ? 'ACTIVE' : 'MISSING'}
                  </div>
              </div>
              {hasApiKey ? <CheckCircleIcon className="w-8 h-8 text-blue-500" /> : <BoltIcon className="w-8 h-8 text-yellow-500" />}
          </div>

          {/* System Load (Browser) */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
              <div>
                  <h3 className="text-gray-400 text-sm mb-1">منصة التشغيل</h3>
                  <div className="text-xl font-bold text-purple-400">BROWSER</div>
              </div>
              <CpuChipIcon className="w-8 h-8 text-purple-500" />
          </div>
      </div>

      {/* Real-time Logs */}
      <div className="bg-gray-900/50 border border-green-900 rounded-xl p-4 flex-1 flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-2">
              <span className="flex items-center gap-2 text-xs text-green-600">
                <CommandLineIcon className="w-4 h-4" /> SYSTEM LOGS
              </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-green-900 text-xs">
              {logs.map((log, i) => (
                <div key={i} className="break-all border-b border-gray-800/30 pb-1">
                    <span className="text-green-600 mr-2">➜</span>
                    <span className={log.includes('WARNING') ? 'text-yellow-500' : 'text-gray-300'}>
                      {log}
                    </span>
                </div>
              ))}
          </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-600">
          NOTE: This dashboard reflects the actual client-side state. Backend metrics will appear here once connected.
      </div>

    </div>
  );
};

export default SystemCore;