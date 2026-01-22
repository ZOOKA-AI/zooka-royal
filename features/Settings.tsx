
import React, { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils';
import { 
  ShieldCheckIcon, 
  Cog6ToothIcon, 
  LockClosedIcon,
  CheckBadgeIcon,
  KeyIcon,
  PlusCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  BoltIcon,
  StarIcon,
  ArchiveBoxIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

interface SettingsProps {
  role: 'owner';
}

interface ApiKeyEntry {
    id: string;
    name: string;
    key: string;
    hidden: boolean;
    provider: 'gemini' | 'gcp' | 'custom';
}

const Settings: React.FC<SettingsProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'vault'>('general');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [vaultKeys, setVaultKeys] = useState<ApiKeyEntry[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [primaryKeyId, setPrimaryKeyId] = useState(localStorage.getItem('zooka_primary_key_id') || '');

  useEffect(() => { loadVault(); }, []);

  const loadVault = () => {
    const encryptedKeys = localStorage.getItem('zooka_secure_vault_v4');
    if (encryptedKeys) {
        try {
            const keys = JSON.parse(decryptData(encryptedKeys));
            setVaultKeys(keys);
        } catch (e) { console.error(e); }
    }
  };

  const handleUnlockVault = () => {
      const sovCode = localStorage.getItem('zooka_sovereign_code') || '@3219';
      if (masterPassword === sovCode || masterPassword === sovCode.replace('@', '')) { 
          setVaultUnlocked(true);
      } else { alert("❌ الكود السيادي خاطئ."); }
  };

  const addKey = () => {
      if(!newKeyName || !newKeyValue) return;
      const newEntry: ApiKeyEntry = { id: `key-${Date.now()}`, name: newKeyName, key: newKeyValue, hidden: true, provider: 'custom' };
      const updated = [...vaultKeys, newEntry];
      setVaultKeys(updated);
      localStorage.setItem('zooka_secure_vault_v4', encryptData(JSON.stringify(updated)));
      setNewKeyName(''); setNewKeyValue('');
  };

  const setAsPrimary = (entry: ApiKeyEntry) => {
      setPrimaryKeyId(entry.id);
      localStorage.setItem('zooka_primary_key_id', entry.id);
      localStorage.setItem('GEMINI_API_KEY', entry.key);
      alert("تم تفعيل المفتاح كقاعدة بيانات رئيسية للنظام.");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-900/40 backdrop-blur-3xl min-h-[85vh] text-white rounded-[4rem] border border-gray-800 shadow-2xl font-sans" dir="rtl">
        <div className="flex justify-between items-center mb-12 pb-10 border-b border-gray-800 px-8 pt-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl"><Cog6ToothIcon className="w-12 h-12 text-blue-500 animate-spin-slow"/></div>
              <h1 className="text-4xl font-black tracking-tighter">إعدادات الكيان</h1>
            </div>
            <nav className="flex gap-4">
                <button onClick={() => setActiveTab('general')} className={`px-8 py-3 rounded-2xl font-black ${activeTab === 'general' ? 'bg-blue-600' : 'bg-gray-800'}`}>عام</button>
                <button onClick={() => setActiveTab('vault')} className={`px-8 py-3 rounded-2xl font-black ${activeTab === 'vault' ? 'bg-blue-600' : 'bg-gray-800'}`}>الخزنة (API)</button>
            </nav>
        </div>

        <main className="p-8">
            {activeTab === 'general' && (
                <div className="space-y-12">
                    <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl flex gap-6 items-center">
                        <InformationCircleIcon className="w-12 h-12 text-blue-500" />
                        <div>
                            <h3 className="text-xl font-bold">تلميح لمسؤولي الـ Cloud</h3>
                            <p className="text-sm text-gray-400">عند إنشاء حساب خدمة (Service Account)، تأكد من أن المعرف يتراوح بين 6 و30 حرفاً صغيراً مع شرطات فقط. مثال: <code className="text-white">zooka-master-agent</code>.</p>
                        </div>
                    </div>
                    <div className="text-center py-20 opacity-20">
                        <BoltIcon className="w-40 h-40 mx-auto text-blue-500 mb-6" />
                        <h2 className="text-4xl font-black italic">النظام في حالة استقرار قصوى</h2>
                    </div>
                </div>
            )}

            {activeTab === 'vault' && (
                <div className="space-y-10">
                    {!vaultUnlocked ? (
                        <div className="flex flex-col items-center py-24 space-y-8">
                            <LockClosedIcon className="w-20 h-20 text-gray-700" />
                            <h3 className="text-2xl font-black text-gray-500 uppercase tracking-widest">مصادقة المالك مطلوبة</h3>
                            <input type="password" value={masterPassword} onChange={e=>setMasterPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleUnlockVault()} className="bg-black border-2 border-gray-800 p-6 rounded-3xl text-center text-3xl font-mono text-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 outline-none w-full max-w-sm transition-colors" placeholder="أدخل الكود السيادي" />
                            <button onClick={handleUnlockVault} className="px-12 py-4 bg-yellow-600 text-black font-black rounded-2xl">فتح الخزنة</button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-gray-800/40 p-10 rounded-[3rem] border border-gray-700 space-y-6">
                                <h4 className="font-black text-gray-500 uppercase tracking-widest">إضافة مفتاح جديد</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} className="bg-black p-5 rounded-2xl border border-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="اسم المفتاح (مثال: Gemini)" />
                                    <input value={newKeyValue} onChange={e=>setNewKeyValue(e.target.value)} className="bg-black p-5 rounded-2xl border border-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono" placeholder="API Key" />
                                </div>
                                <button onClick={addKey} className="w-full bg-blue-600 p-5 rounded-2xl font-black flex items-center justify-center gap-4"><PlusCircleIcon className="w-6 h-6"/> حفظ في الخزنة</button>
                            </div>
                            <div className="space-y-4">
                                {vaultKeys.map(k => (
                                    <div key={k.id} className={`flex items-center justify-between p-6 rounded-2xl border ${primaryKeyId === k.id ? 'border-blue-500 bg-blue-600/10' : 'border-gray-800 bg-gray-900/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <KeyIcon className={`w-8 h-8 ${primaryKeyId === k.id ? 'text-blue-500' : 'text-gray-600'}`} />
                                            <div>
                                                <div className="font-black">{k.name}</div>
                                                <div className="text-[10px] text-gray-600 font-mono">{k.hidden ? '••••••••••••••••' : k.key}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {primaryKeyId !== k.id && <button onClick={()=>setAsPrimary(k)} className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-black">تفعيل</button>}
                                            <button onClick={()=>{
                                                const updated = vaultKeys.filter(i => i.id !== k.id);
                                                setVaultKeys(updated);
                                                localStorage.setItem('zooka_secure_vault_v4', encryptData(JSON.stringify(updated)));
                                            }} className="p-2 text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
  );
};

export default Settings;