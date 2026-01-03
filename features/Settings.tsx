
import React, { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../utils';
// Fixed missing imports for ArchiveBoxIcon, FingerPrintIcon, and ServerStackIcon
import { 
  ShieldCheckIcon, 
  Cog6ToothIcon, 
  LockClosedIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  BoltIcon,
  CpuChipIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  FireIcon,
  SignalIcon,
  PlusCircleIcon,
  CommandLineIcon,
  LockOpenIcon,
  EyeSlashIcon,
  StarIcon,
  ArchiveBoxIcon,
  FingerPrintIcon,
  ServerStackIcon
} from '@heroicons/react/24/solid';

interface SettingsProps {
  role: 'user' | 'owner';
}

interface ApiKeyEntry {
    id: string;
    name: string;
    key: string;
    hidden: boolean;
    provider: 'gemini' | 'mapbox' | 'custom';
}

const Settings: React.FC<SettingsProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'vault' | 'evolution'>('general');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [evolutionMode, setEvolutionMode] = useState(false);
  
  const [sovereignCode, setSovereignCode] = useState(localStorage.getItem('zooka_sovereign_code') || '@3219');
  const [userCode, setUserCode] = useState(localStorage.getItem('zooka_user_code') || 'ROYAL2025');

  const [vaultKeys, setVaultKeys] = useState<ApiKeyEntry[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [primaryKeyId, setPrimaryKeyId] = useState(localStorage.getItem('zooka_primary_key_id') || '');

  useEffect(() => {
      loadVault();
      setEvolutionMode(localStorage.getItem('zooka_evolution_mode') === 'true');
  }, []);

  const loadVault = () => {
    const encryptedKeys = localStorage.getItem('zooka_secure_vault_v4');
    if (encryptedKeys) {
        try {
            const decryptedString = decryptData(encryptedKeys);
            if (decryptedString) {
                const keys = JSON.parse(decryptedString);
                setVaultKeys(keys);
            }
        } catch (e) {
            console.error("Vault Decryption Error", e);
        }
    }
  };

  const handleUnlockVault = () => {
      const currentSovCode = localStorage.getItem('zooka_sovereign_code') || '@3219';
      if (masterPassword.trim() === currentSovCode || masterPassword.trim() === currentSovCode.replace('@', '')) { 
          setVaultUnlocked(true);
          setMasterPassword('');
      } else {
          alert("❌ الرمز السيادي خاطئ. الدخول مرفوض.");
      }
  };

  const handleUpdateCodes = () => {
    if (sovereignCode.length < 4) {
      alert("⚠️ الرمز يجب أن يكون 4 حروف على الأقل.");
      return;
    }
    localStorage.setItem('zooka_sovereign_code', sovereignCode);
    localStorage.setItem('zooka_user_code', userCode);
    alert("✅ تم تحديث بروتوكولات الوصول بنجاح.");
  };

  const toggleEvolutionMode = () => {
      const next = !evolutionMode;
      setEvolutionMode(next);
      localStorage.setItem('zooka_evolution_mode', String(next));
      alert(next ? "⚠️ وضع التطور مفعل. النظام الآن قابل للتعديل الذاتي." : "✅ تم إغلاق وضع التطور.");
  };

  const saveVault = (keys: ApiKeyEntry[]) => {
      setVaultKeys(keys);
      const encrypted = encryptData(JSON.stringify(keys));
      localStorage.setItem('zooka_secure_vault_v4', encrypted);
  };

  const addKey = () => {
      if(!newKeyName || !newKeyValue) {
          alert("⚠️ يرجى إدخال اسم المفتاح وقيمته.");
          return;
      }
      const newId = `key-${Date.now()}`;
      const newEntry: ApiKeyEntry = { 
        id: newId,
        name: newKeyName, 
        key: newKeyValue, 
        hidden: true, 
        provider: newKeyName.toLowerCase().includes('gemini') ? 'gemini' : 'custom' 
      };
      saveVault([...vaultKeys, newEntry]);
      setNewKeyName(''); 
      setNewKeyValue('');
      alert("✅ تم إضافة المفتاح للخزنة المشفرة.");
  };

  const deleteKey = (id: string) => {
      if(confirm("❗ هل أنت متأكد من حذف هذا المفتاح؟ سيتوقف النظام المرتبط به.")) {
          const updated = vaultKeys.filter(k => k.id !== id);
          if (primaryKeyId === id) {
              setPrimaryKeyId('');
              localStorage.removeItem('GEMINI_API_KEY');
              localStorage.removeItem('zooka_primary_key_id');
          }
          saveVault(updated);
      }
  };

  const toggleKeyVisibility = (id: string) => {
      const updated = vaultKeys.map(k => k.id === id ? { ...k, hidden: !k.hidden } : k);
      setVaultKeys(updated);
  };

  const setAsPrimary = (id: string) => {
      const keyEntry = vaultKeys.find(k => k.id === id);
      if (keyEntry) {
          setPrimaryKeyId(id);
          localStorage.setItem('zooka_primary_key_id', id);
          localStorage.setItem('GEMINI_API_KEY', keyEntry.key);
          alert(`✅ تم تعيين "${keyEntry.name}" كمفتاح Gemini الرئيسي.`);
      }
  };

  const wipeAllData = () => {
    if(confirm("☢️ تحذير: سيتم تدمير كافة البيانات والمفاتيح محلياً. هل تود المتابعة؟")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-900/40 backdrop-blur-3xl min-h-[85vh] text-white rounded-[4rem] border border-gray-800 shadow-2xl font-sans" dir="rtl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-10 border-b border-gray-800 gap-8 px-8 pt-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
                <Cog6ToothIcon className="w-12 h-12 text-blue-500 animate-spin-slow"/>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">إعدادات الكيان</h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-[0.4em] mt-1 uppercase">ZOOKA OS CONFIG v4.5-ULTIMATE</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-green-500 bg-green-950/20 px-8 py-4 rounded-full border border-green-900/30 font-black tracking-[0.2em] shadow-inner">
              <SignalIcon className="w-4 h-4 animate-pulse"/> SECURE CORE CONNECTED
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 px-6 pb-10">
            <nav className="space-y-4">
                {[
                    { id: 'general', label: 'عام', icon: <ChartBarIcon className="w-6 h-6"/> },
                    { id: 'security', label: 'الأمان السيبراني', icon: <ShieldCheckIcon className="w-6 h-6"/> },
                    ...(role === 'owner' ? [
                        { id: 'vault', label: 'خزنة المفاتيح (API)', icon: <KeyIcon className="w-6 h-6 text-yellow-500"/> },
                        { id: 'evolution', label: 'بروتوكول التطور', icon: <CpuChipIcon className="w-6 h-6 text-blue-500"/> },
                    ] : [])
                ].map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => setActiveTab(item.id as any)} 
                      className={`w-full p-7 rounded-[2.5rem] flex items-center gap-6 font-black transition-all group ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 scale-[1.02]' 
                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                      }`}
                    >
                        <span className={`transition-transform duration-500 ${activeTab === item.id ? 'scale-110 rotate-12' : 'group-hover:scale-110'}`}>{item.icon}</span> 
                        {item.label}
                    </button>
                ))}
                <button onClick={wipeAllData} className="w-full p-7 mt-16 rounded-[2.5rem] flex items-center gap-6 font-black text-red-500 hover:bg-red-900/20 transition-all border border-transparent hover:border-red-900/50">
                    <FireIcon className="w-6 h-6" /> مسح البيانات
                </button>
            </nav>

            <main className="lg:col-span-3 bg-black/40 rounded-[3.5rem] p-8 md:p-14 border border-gray-800/50 min-h-[650px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>

                {activeTab === 'vault' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-8">
                            <h2 className="text-4xl font-black flex items-center gap-6">
                                <KeyIcon className="w-12 h-12 text-yellow-500" /> إدارة المفاتيح
                            </h2>
                            <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${vaultUnlocked ? 'bg-green-950/20 border-green-900 text-green-500' : 'bg-red-950/20 border-red-900 text-red-500'}`}>
                                {vaultUnlocked ? <div className="flex items-center gap-2"><LockOpenIcon className="w-4 h-4"/> Unlocked</div> : <div className="flex items-center gap-2"><LockClosedIcon className="w-4 h-4"/> Locked</div>}
                            </div>
                        </div>

                        {!vaultUnlocked ? (
                            <div className="flex flex-col items-center justify-center py-28 bg-gray-900/40 rounded-[3.5rem] border-2 border-gray-800 border-dashed group">
                                <div className="p-8 bg-gray-800 rounded-full mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                    <LockClosedIcon className="w-20 h-20 text-gray-700" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-500 mb-10 uppercase tracking-[0.3em]">مصادقة المالك مطلوبة</h3>
                                <div className="flex flex-col md:flex-row gap-4 w-full max-w-md px-6">
                                    <input 
                                        type="password" 
                                        value={masterPassword} 
                                        onChange={e => setMasterPassword(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleUnlockVault()}
                                        placeholder="أدخل رمز المالك (Ghost Key)..."
                                        className="flex-1 bg-black p-6 rounded-3xl border-2 border-gray-800 text-center text-3xl text-yellow-500 font-mono outline-none focus:border-yellow-600 transition-all shadow-inner"
                                    />
                                    <button 
                                        onClick={handleUnlockVault} 
                                        className="bg-yellow-600 hover:bg-yellow-500 px-10 py-5 rounded-3xl font-black text-black shadow-2xl transition-all active:scale-95"
                                    >
                                        تحقق
                                    </button>
                                </div>
                                <p className="mt-8 text-gray-700 text-[10px] font-bold uppercase tracking-widest italic">Hint: @3219</p>
                            </div>
                        ) : (
                            <div className="space-y-10 animate-fade-in-up">
                                {/* Add New Key */}
                                <div className="bg-gray-800/30 p-10 rounded-[3rem] border border-gray-700 space-y-6 shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-500/20"></div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">إضافة مفتاح جديد للخزنة</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-600 mr-4">اسم الخدمة</label>
                                            <input type="text" placeholder="مثلاً: Gemini Pro v3" value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} className="w-full bg-black p-6 rounded-2xl border border-gray-800 focus:border-blue-500 outline-none text-sm font-bold shadow-inner"/>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-600 mr-4">API KEY</label>
                                            <input type="text" placeholder="أدخل المفتاح البرمجي هنا..." value={newKeyValue} onChange={e=>setNewKeyValue(e.target.value)} className="w-full bg-black p-6 rounded-2xl border border-gray-800 focus:border-blue-500 outline-none text-sm font-mono shadow-inner"/>
                                        </div>
                                    </div>
                                    <button onClick={addKey} className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-900/30 active:scale-[0.98]">
                                        <PlusCircleIcon className="w-7 h-7" /> إضافة وحماية المفتاح
                                    </button>
                                </div>

                                {/* List Keys */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center px-4">
                                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">مفاتيح الخزنة النشطة ({vaultKeys.length})</h5>
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-yellow-500 bg-yellow-900/10 px-3 py-1 rounded-full border border-yellow-900/30">
                                            <StarIcon className="w-3 h-3"/> النجمة تشير للمفتاح النشط حالياً
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {vaultKeys.map((k, i) => (
                                            <div key={k.id} className={`flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2.5rem] border transition-all shadow-lg group ${primaryKeyId === k.id ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-gray-800/20 border-gray-800 hover:border-yellow-500/30'}`}>
                                                <div className="p-4 bg-gray-900 rounded-2xl shadow-inner relative">
                                                    <BoltIcon className={`w-8 h-8 ${primaryKeyId === k.id ? 'text-blue-400' : 'text-gray-600 group-hover:text-yellow-500'} transition-colors`} />
                                                    {primaryKeyId === k.id && <StarIcon className="w-5 h-5 text-yellow-500 absolute -top-2 -right-2 drop-shadow-lg animate-pulse" />}
                                                </div>
                                                
                                                <div className="flex-1 truncate w-full text-right">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-black text-white text-lg tracking-tight">{k.name}</div>
                                                        {primaryKeyId === k.id && <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">PRIMARY ACTIVE</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono mt-2 truncate bg-black/40 p-2 rounded-lg flex items-center justify-between">
                                                        <span className="truncate">{k.hidden ? '••••••••••••••••••••••••••••••••••••••••' : k.key}</span>
                                                        <button onClick={() => toggleKeyVisibility(k.id)} className="ml-2 p-1 text-gray-600 hover:text-white">
                                                            {k.hidden ? <EyeIcon className="w-4 h-4"/> : <EyeSlashIcon className="w-4 h-4"/>}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    {primaryKeyId !== k.id && (
                                                        <button 
                                                            onClick={() => setAsPrimary(k.id)} 
                                                            className="px-6 py-4 bg-gray-900/50 hover:bg-blue-600 rounded-2xl text-[10px] font-black transition-all text-blue-400 hover:text-white border border-blue-900/30 hover:shadow-xl"
                                                        >
                                                            تفعيل كمفتاح رئيسي
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteKey(k.id)} className="p-5 bg-gray-900/50 rounded-2xl text-red-500 hover:bg-red-900/30 transition-all shadow-lg border border-transparent hover:border-red-900/50">
                                                        <TrashIcon className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {vaultKeys.length === 0 && <div className="text-center text-gray-700 py-24 font-black italic uppercase tracking-widest border-2 border-dashed border-gray-800 rounded-[4rem] bg-black/20">
                                        <ArchiveBoxIcon className="w-16 h-16 mx-auto mb-4 opacity-10"/>
                                        الخزنة السيادية فارغة. أضف مفتاح Gemini للبدء.
                                    </div>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'evolution' && (
                    <div className="space-y-16 animate-fade-in">
                        <div className="flex items-center gap-8 border-b border-gray-800 pb-12">
                            <div className="p-5 bg-blue-600/20 rounded-3xl border border-blue-600/30 shadow-2xl">
                                <CommandLineIcon className="w-12 h-12 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tight text-white">إدارة بروتوكولات التطور</h2>
                                <p className="text-sm text-gray-500 font-bold mt-2">تحكم كامل في مفاتيح العبور السيادية وقدرات النواة.</p>
                            </div>
                        </div>

                        <div className="bg-gray-800/30 p-12 rounded-[3.5rem] border border-gray-700/40 space-y-12 shadow-inner">
                            <h3 className="font-black text-white text-2xl flex items-center gap-6">
                              <KeyIcon className="w-10 h-10 text-yellow-500"/> الرموز السيادية (Access Keys)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-4">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] px-4">رمز المالك (Ghost Key)</label>
                                <input 
                                  type="text" 
                                  value={sovereignCode} 
                                  onChange={e => setSovereignCode(e.target.value)}
                                  className="w-full bg-black border-2 border-gray-800 rounded-[2.5rem] p-8 text-yellow-500 font-mono text-center text-4xl focus:border-yellow-500 outline-none transition-all shadow-2xl"
                                />
                              </div>
                              <div className="space-y-4">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] px-4">رمز المستخدم (Staff Key)</label>
                                <input 
                                  type="text" 
                                  value={userCode} 
                                  onChange={e => setUserCode(e.target.value)}
                                  className="w-full bg-black border-2 border-gray-800 rounded-[2.5rem] p-8 text-blue-400 font-mono text-center text-4xl focus:border-blue-500 outline-none transition-all shadow-2xl"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={handleUpdateCodes}
                              className="w-full py-7 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-[0.4em] active:scale-95"
                            >
                              حفظ الرموز الجديدة
                            </button>
                        </div>

                        <div className="bg-red-600/5 p-12 rounded-[3.5rem] border border-red-900/20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-inner group">
                            <div className="max-w-xl">
                                <h3 className="font-black text-white mb-4 text-3xl">وضع المطور السيادي (Evolution Mode)</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold">تفعيل هذا الخيار يسمح للنظام بإعادة كتابة ملفات المصدر وتوسيع قدراته تلقائياً عبر ذكاء Gemini المتطور.</p>
                            </div>
                            <button 
                                onClick={toggleEvolutionMode}
                                className={`px-16 py-8 rounded-[2.5rem] font-black transition-all shadow-2xl uppercase tracking-widest ${evolutionMode ? 'bg-red-600 text-white animate-pulse shadow-red-900/50' : 'bg-gray-800 text-gray-500 hover:text-white'}`}
                            >
                                {evolutionMode ? 'DANGER: EVO ACTIVE' : 'تفعيل التطور البرمجي'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-14 animate-fade-in py-24 relative">
                        <BoltIcon className="w-64 h-64 text-blue-500 opacity-5 absolute pointer-events-none" />
                        <div className="space-y-6 relative z-10">
                            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-500/30">
                                <CheckBadgeIcon className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tighter">النظام مستقر تماماً</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed font-bold">الكيان الرقمي لـ رويال هارون في حالة استجابة كاملة. جميع النواة والبروتوكولات (Z-Shield) مفعلة وتحت الحماية القصوى.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl relative z-10">
                             {[
                                { l: 'SYSTEM UPTIME', v: '99.99%', c: 'text-green-500' },
                                { l: 'Z-SHIELD STATUS', v: 'MAXIMUM', c: 'text-blue-500' },
                                { l: 'CORE VERSION', v: 'v4.5.1-ULT', c: 'text-purple-500' }
                             ].map((s,i) => (
                                <div key={i} className="bg-gray-800/30 p-10 rounded-[2.5rem] border border-gray-800 hover:border-gray-700 transition-all shadow-xl group">
                                    <div className="text-[10px] text-gray-600 font-black mb-3 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{s.l}</div>
                                    <div className={`text-2xl font-black font-mono tracking-widest ${s.c}`}>{s.v}</div>
                                </div>
                             ))}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex items-center gap-8 border-b border-gray-800 pb-10">
                           <div className="p-5 bg-green-600/10 rounded-3xl border border-green-600/20">
                               <ShieldCheckIcon className="w-12 h-12 text-green-500" />
                           </div>
                           <h2 className="text-4xl font-black tracking-tight">بروتوكول الحماية Z-Shield</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'تشفير AES-256 العسكري', status: 'ACTIVE', icon: <LockClosedIcon className="text-green-500" />, desc: 'تشفير كامل لكافة مدخلات ومخرجات النظام عبر خوارزميات النواة.' },
                                { label: 'تتبع الاختراقات السيادي', status: 'MONITORING', icon: <FingerPrintIcon className="text-blue-500" />, desc: 'مراقبة حية لكافة محاولات الوصول غير المصرح بها وتسجيل العقد.' },
                                { label: 'جدار ناري (X-FIRE)', status: 'STABLE', icon: <BoltIcon className="text-yellow-500" />, desc: 'تصفية ذكية لكافة الطلبات الواردة للنواة لحماية استهلاك الـ API.' },
                                { label: 'النسخ السحابي المشفر', status: 'AUTO-RUN', icon: <ServerStackIcon className="text-purple-500" />, desc: 'نسخ احتياطي فوري لكافة الإعدادات والمفاتيح في الخزنة المحلية.' }
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-800/30 p-10 rounded-[3rem] border border-gray-800 flex flex-col justify-between group hover:border-blue-500/50 transition-all shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[50px] pointer-events-none"></div>
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-inner">{s.icon}</div>
                                        <span className="text-[9px] font-black text-green-400 bg-green-950/40 px-5 py-2 rounded-full border border-green-900/40 tracking-widest uppercase">{s.status}</span>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="font-black text-white text-xl mb-2">{s.label}</h3>
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
        <p className="mt-12 text-center text-[10px] text-gray-700 font-black uppercase tracking-[0.8em]">Designed & Hardened by Royal Haroun Infrastructure Team</p>
    </div>
  );
};

export default Settings;
