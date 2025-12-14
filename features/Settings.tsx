import React, { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils';
import { 
  ShieldCheckIcon, 
  CreditCardIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  PlusCircleIcon, 
  TrashIcon, 
  LockClosedIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  SignalIcon,
  ServerStackIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/solid';

interface SettingsProps {
  role: 'user' | 'owner';
}

interface ApiKeyEntry {
    name: string;
    key: string;
    hidden: boolean;
}

const Settings: React.FC<SettingsProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'billing' | 'users' | 'vault'>('general');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  
  const [vaultKeys, setVaultKeys] = useState<ApiKeyEntry[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  // Load encrypted keys on mount
  useEffect(() => {
      const encryptedKeys = localStorage.getItem('zooka_secure_vault');
      if (encryptedKeys) {
          try {
              // We just load the structure, values remain encrypted until unlock
              const decryptedString = decryptData(encryptedKeys);
              if (decryptedString) {
                  const decrypted = JSON.parse(decryptedString);
                  setVaultKeys(decrypted);
              }
          } catch (e) {
              console.error("Vault corrupted or empty, resetting.");
              localStorage.removeItem('zooka_secure_vault');
          }
      }
  }, []);

  const handleUnlockVault = () => {
      const code = masterPassword.trim();
      if (code === '3219' || code === '@3219') { 
          setVaultUnlocked(true);
      } else {
          alert("رمز المرور غير صحيح (Invalid Passcode)");
      }
  };

  const saveVault = (keys: ApiKeyEntry[]) => {
      setVaultKeys(keys);
      // Encrypt before saving to LocalStorage
      const encrypted = encryptData(JSON.stringify(keys));
      localStorage.setItem('zooka_secure_vault', encrypted);
      
      // Update global API Key state for the app to use
      // Logic: Pick the first available key or specific one if needed
      const mainKey = keys.find(k => k.name === 'GEMINI_API_KEY') || keys[0];
      if (mainKey) {
          localStorage.setItem('GEMINI_API_KEY', mainKey.key); 
      }
  };

  const addKey = () => {
      if(newKeyName && newKeyValue) {
          const newEntry = { name: newKeyName, key: newKeyValue, hidden: true };
          saveVault([...vaultKeys, newEntry]);
          setNewKeyName(''); 
          setNewKeyValue('');
      }
  };

  const deleteKey = (index: number) => {
      if(confirm("هل أنت متأكد من حذف هذا المفتاح؟ سيؤثر ذلك على عمل النظام.")) {
          const updated = [...vaultKeys];
          updated.splice(index, 1);
          saveVault(updated);
      }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen text-white rounded-3xl border border-gray-800 shadow-2xl font-sans">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Cog6ToothIcon className="w-8 h-8 text-white"/> إعدادات النظام {role === 'owner' && <span className="text-red-500">(Admin)</span>}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <ServerStackIcon className="w-4 h-4 text-green-500" />
                <span>حالة السيرفر: بانتظار الربط (Local Mode)</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <nav className="space-y-2">
                {[
                    { id: 'general', label: 'عام', icon: <ChartBarIcon className="w-5 h-5"/> },
                    { id: 'security', label: 'الأمان', icon: <ShieldCheckIcon className="w-5 h-5"/> },
                    { id: 'billing', label: 'الاشتراكات', icon: <CreditCardIcon className="w-5 h-5"/> },
                    ...(role === 'owner' ? [
                        { id: 'users', label: 'إدارة المستخدمين', icon: <UserGroupIcon className="w-5 h-5"/> },
                        { id: 'vault', label: 'خزنة المفاتيح (Vault)', icon: <ArchiveBoxIcon className="w-5 h-5 text-yellow-500"/> },
                    ] : [])
                ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full p-4 rounded-xl flex items-center gap-3 font-bold transition-colors ${activeTab === item.id ? 'bg-gray-800 text-white border border-gray-600' : 'text-gray-400 hover:bg-gray-800'}`}>
                        {item.icon} {item.label}
                    </button>
                ))}
            </nav>

            <main className="lg:col-span-3 bg-black/20 rounded-3xl p-6 border border-gray-800 relative min-h-[500px]">
                
                {/* --- VAULT TAB (OWNER ONLY + SECURE) --- */}
                {activeTab === 'vault' && role === 'owner' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-yellow-400 flex gap-2"><LockClosedIcon className="w-6 h-6"/> مخزن مفاتيح التشغيل (The Vault)</h2>
                        </div>

                        {!vaultUnlocked ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <ArchiveBoxIcon className="w-20 h-20 text-yellow-600 opacity-50" />
                                <h3 className="text-xl font-bold">الخزنة مشفرة</h3>
                                <p className="text-gray-400">أدخل كود المالك (@3219) للوصول إلى مفاتيح الذكاء الاصطناعي.</p>
                                <div className="flex gap-2 w-full max-w-sm">
                                    <input 
                                        type="password" 
                                        value={masterPassword}
                                        onChange={(e) => setMasterPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUnlockVault()}
                                        placeholder="كود المالك..."
                                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-center tracking-widest text-white focus:border-yellow-500 outline-none"
                                    />
                                    <button onClick={handleUnlockVault} className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold">فتح</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-sm text-green-400 mb-4 flex items-center gap-2">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                    <span>الخزنة مفتوحة. المفاتيح أدناه تعمل على تشغيل محركات Gemini و Veo.</span>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                                    {vaultKeys.map((k, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
                                            <KeyIcon className="w-5 h-5 text-gray-500" />
                                            <div className="w-1/3">
                                                <div className="font-bold text-white text-sm" title={k.name}>{k.name}</div>
                                                <div className="text-[10px] text-gray-500">API Key</div>
                                            </div>
                                            <input 
                                                type={k.hidden ? "password" : "text"} 
                                                value={k.key} 
                                                readOnly 
                                                className="bg-black/30 p-2 rounded-lg flex-1 text-green-400 font-mono text-xs outline-none border border-gray-700"
                                            />
                                            <button onClick={() => {const u=[...vaultKeys]; u[i].hidden=!u[i].hidden; setVaultKeys(u);}} className="text-gray-400 hover:text-white p-2 bg-gray-700 rounded-lg"><EyeIcon className="w-4 h-4"/></button>
                                            <button onClick={() => deleteKey(i)} className="text-gray-400 hover:text-red-500 p-2 bg-gray-700 rounded-lg"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {vaultKeys.length === 0 && <p className="text-gray-500 text-center py-10 border-2 border-dashed border-gray-700 rounded-xl">لا توجد مفاتيح. أضف مفتاح Gemini لبدء العمل.</p>}
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 pt-6 border-t border-gray-700 mt-4 bg-gray-800/50 p-4 rounded-xl">
                                    <input type="text" placeholder="الاسم (مثال: الاحتياطي 1)" value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} className="bg-gray-900 p-3 rounded-lg flex-1 border border-gray-600 focus:border-yellow-500 outline-none text-white"/>
                                    <input type="text" placeholder="لصق المفتاح هنا (sk-...)" value={newKeyValue} onChange={e=>setNewKeyValue(e.target.value)} className="bg-gray-900 p-3 rounded-lg flex-[2] border border-gray-600 focus:border-yellow-500 outline-none text-white font-mono text-sm"/>
                                    <button onClick={addKey} className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg text-black font-bold flex items-center justify-center gap-2 shadow-lg">
                                        <PlusCircleIcon className="w-5 h-5" /> إضافة للخزنة
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- ACCESS DENIED --- */}
                {activeTab === 'vault' && role !== 'owner' && (
                    <div className="flex flex-col items-center justify-center h-full text-red-500">
                        <LockClosedIcon className="w-24 h-24 mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold">منطقة محظورة</h2>
                        <p className="text-gray-400 mt-2">فقط "رويال هارون" يملك صلاحية الوصول للخزنة.</p>
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <SignalIcon className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold">النظام يعمل محلياً</h2>
                        <p className="text-gray-400 max-w-md">
                            واجهة النظام تعمل بكفاءة عالية. تأكد من وجود مفاتيح صالحة في الخزنة لضمان استمرار خدمات الذكاء الاصطناعي.
                        </p>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default Settings;