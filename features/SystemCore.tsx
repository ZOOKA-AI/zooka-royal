
import React, { useState, useEffect } from 'react';
import { 
  ServerStackIcon, 
  CommandLineIcon, 
  BoltIcon, 
  CheckCircleIcon,
  CpuChipIcon,
  WifiIcon
} from '@heroicons/react/24/solid';

const SystemCore: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [uptime, setUptime] = useState(0);

  const logEvent = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  useEffect(() => {
      window.addEventListener('online', () => { setIsOnline(true); logEvent("Network: ONLINE"); });
      window.addEventListener('offline', () => { setIsOnline(false); logEvent("Network: OFFLINE"); });

      const key = process.env.API_KEY;
      setHasApiKey(!!key);
      logEvent(key ? "API Key Active" : "API Key Missing");

      const interval = setInterval(() => setUptime(u => u + 1), 1000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-black min-h-screen font-mono text-green-400 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <ServerStackIcon className="w-10 h-10 text-green-500" />
          <h1 className="text-2xl font-bold text-white">SYSTEM CORE</h1>
        </div>
        <div className="text-white font-bold">UPTIME: {uptime}s</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl flex justify-between">
              <span>حالة الاتصال</span>
              <WifiIcon className={`w-8 h-8 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className="bg-gray-900 p-6 rounded-xl flex justify-between">
              <span>ترخيص API</span>
              <CheckCircleIcon className={`w-8 h-8 ${hasApiKey ? 'text-blue-500' : 'text-gray-600'}`} />
          </div>
          <div className="bg-gray-900 p-6 rounded-xl flex justify-between">
              <span>المنصة</span>
              <CpuChipIcon className="w-8 h-8 text-purple-500" />
          </div>
      </div>
      <div className="bg-gray-900/50 border border-green-900 rounded-xl p-4 h-[400px] overflow-y-auto">
          {logs.map((log, i) => <div key={i} className="text-xs mb-1">➜ {log}</div>)}
      </div>
    </div>
  );
};

export default SystemCore;
