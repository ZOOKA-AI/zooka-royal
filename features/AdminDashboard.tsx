
// @google/genai Coding Guidelines: This file uses standard UI components and does not directly interact with the Gemini API.
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  BoltIcon, 
  NoSymbolIcon,
  PowerIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  SignalIcon,
  UserMinusIcon,
  BeakerIcon,
  LockClosedIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'links'>('stats');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simulated Secure Load from Core
    setUsers([
      { id: 1, name: 'رويال هارون', role: 'Owner', status: 'Active', accuracy: 'Maximum', lastSeen: 'الآن' },
      { id: 2, name: 'عميل دبي 01', role: 'Premium', status: 'Active', accuracy: 'High', lastSeen: 'منذ 5 د' },
      { id: 3, name: 'مستخدم 4501', role: 'Free', status: 'Restricted', accuracy: 'Low', lastSeen: 'منذ يومين' },
    ]);
  }, []);

  const handleKick = (id: number) => {
    alert(`بروتوكول الأمان: تم إنهاء جلسة العقدة [${id}] وتشفير بيانات الوصول.`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 pb-32 font-sans" dir="rtl">
      
      {/* Crown Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-gray-800 pb-12">
        <div className="flex items-center gap-8">
          <div className="p-6 bg-red-600 rounded-[3rem] shadow-[0_0_60px_rgba(220,38,38,0.4)] animate-pulse">
              <ShieldCheckIcon className="w-16 h-16 text-white" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter tracking-widest">غرفة <span className="text-red-600">التحكم</span></h1>
            <div className="flex items-center gap-3 mt-4">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
                <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Alpha Console V9.5 • Status: SECURE</p>
            </div>
          </div>
        </div>

        <nav className="flex bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-2 shadow-2xl backdrop-blur-xl">
            {[
                { id: 'stats', name: 'الاستخبارات', icon: <ChartBarIcon className="w-5 h-5"/> },
                { id: 'users', name: 'إدارة العقد', icon: <UserGroupIcon className="w-5 h-5"/> },
                { id: 'links', name: 'الربط الخارجي', icon: <GlobeAltIcon className="w-5 h-5"/> },
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-4 rounded-3xl text-[10px] font-black transition-all flex items-center gap-3 uppercase tracking-widest ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}>
                    {tab.icon} {tab.name}
                </button>
            ))}
        </nav>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <StatCard label="المعالجة النشطة" value="98.2%" trend="+2%" color="red" />
          <StatCard label="المشتركين الجدد" value="1,280" trend="+45" color="blue" />
          <StatCard label="محاولات الاختراق" value="0" trend="CLEAN" color="green" />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-[4rem] overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-10 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-2xl font-black text-white flex items-center gap-4"><UserGroupIcon className="w-8 h-8 text-red-600"/> إدارة العقد والذكاء</h3>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nodes Active: {users.length}</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-black/60 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-10 py-6">المستخدم</th>
                            <th className="px-10 py-6">الرتبة</th>
                            <th className="px-10 py-6">دقة الذكاء (Accuracy)</th>
                            <th className="px-10 py-6 text-left">أوامر السيادة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all">{u.name[0]}</div>
                                        <div>
                                            <div className="font-black text-white text-lg">{u.name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">Seen: {u.lastSeen}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'bg-green-950/20 text-green-500 border border-green-900/30' : 'bg-red-950/20 text-red-500 border border-red-900/30'}`}>{u.status}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <select className="bg-black border border-gray-800 rounded-xl px-4 py-2 text-[10px] font-black text-blue-400 outline-none focus:border-red-600 transition-all uppercase">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High" selected={u.accuracy === 'High'}>High</option>
                                        <option value="Maximum" selected={u.accuracy === 'Maximum'}>Maximum</option>
                                    </select>
                                </td>
                                <td className="px-10 py-8 text-left">
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => handleKick(u.id)} className="p-4 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-2xl transition-all" title="طرد وإنهاء الجلسة"><PowerIcon className="w-5 h-5"/></button>
                                        <button className="p-4 bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-2xl transition-all"><BeakerIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up">
            <div className="bg-gray-900/60 p-12 rounded-[4rem] border border-gray-800 space-y-10 shadow-2xl">
                <h3 className="text-2xl font-black text-white flex items-center gap-4"><GlobeAltIcon className="w-8 h-8 text-blue-500"/> روابط الإمبراطورية</h3>
                <div className="space-y-6">
                    <SocialLink label="موقع رويال كلين" url="https://royalcleanuae.com" icon={<GlobeAltIcon className="w-5 h-5"/>} />
                    <SocialLink label="فيسبوك زوكا" url="https://facebook.com" icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>} />
                    <SocialLink label="واتساب السيادة" url="https://wa.me/971563177803" icon={<SignalIcon className="w-5 h-5"/>} />
                </div>
            </div>
            <div className="bg-red-600/5 border border-red-900/20 p-12 rounded-[4rem] text-center flex flex-col items-center justify-center space-y-6">
                <LockClosedIcon className="w-20 h-20 text-red-600 animate-bounce" />
                <h4 className="text-xl font-black text-white uppercase tracking-widest">النشر الموحد</h4>
                <p className="text-xs text-gray-500 font-bold max-w-sm">تفعيل هذا البروتوكول سينشر رابط صفحة الهبوط على جميع الروابط أعلاه تلقائياً عبر بوتات السيادة.</p>
                <button className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-black shadow-2xl transition-all">بدء النشر الهجومي</button>
            </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ label, value, trend, color }: any) => (
    <div className="bg-gray-900/60 border border-gray-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group hover:border-red-600/30 transition-all">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-gray-500">{label}</div>
        <div className="text-6xl font-black text-white mb-8 tracking-tighter italic">{value}</div>
        <div className={`text-[11px] font-bold ${trend.startsWith('+') || trend === 'CLEAN' ? 'text-green-500' : 'text-red-500'}`}>{trend} • نظام مستقر</div>
    </div>
);

// Fix: SocialLink was missing ArrowTopRightOnSquareIcon import
const SocialLink = ({ label, url, icon }: any) => (
    <div className="flex justify-between items-center p-8 bg-black/40 rounded-[2.5rem] border border-gray-800 hover:border-blue-600/30 transition-all group cursor-pointer" onClick={() => window.open(url, '_blank')}>
        <div className="flex items-center gap-6">
            <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-blue-600 transition-colors">{icon}</div>
            <span className="text-lg font-black text-gray-400 group-hover:text-white transition-colors">{label}</span>
        </div>
        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
    </div>
);

export default AdminDashboard;
