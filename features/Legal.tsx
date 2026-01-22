
import React from 'react';
import { ShieldCheckIcon, DocumentTextIcon, UserIcon, GlobeAltIcon, CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface LegalProps {
    page: 'privacy' | 'terms' | 'about';
    onClose: () => void;
}

const Legal: React.FC<LegalProps> = ({ page, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] relative">
                <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 overflow-y-auto p-10 leading-relaxed text-gray-300" dir="rtl">
                    {page === 'privacy' && (
                        <div className="animate-fade-in">
                            <h1 className="text-4xl font-black text-white mb-10 flex items-center gap-4">
                                <ShieldCheckIcon className="w-10 h-10 text-emerald-500" /> سياسة السيادة الرقمية
                            </h1>
                            <div className="space-y-8">
                                <section className="bg-black/20 p-6 rounded-2xl border border-gray-800">
                                    <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">1. حماية الهوية</h3>
                                    <p className="text-sm leading-loose">نظام ZOOKA OS يستخدم تشفيراً من نوع E2EE (End-to-End Encryption). جميع الأكواد السيادية والمفاتيح مخزنة في خزنة مشفرة محلياً على جهازك ولا تصل إلى خوادمنا بشكل خام.</p>
                                </section>
                                <section className="bg-black/20 p-6 rounded-2xl border border-gray-800">
                                    <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">2. معالجة البيانات</h3>
                                    <p className="text-sm leading-loose">تتم معالجة الطلبات عبر واجهات برمجة تطبيقات (APIs) مؤمنة بالكامل. لا نقوم بمشاركة بيانات مشاريعك أو مخططاتك الهندسية مع أطراف ثالثة لأغراض إعلانية.</p>
                                </section>
                                <section className="bg-black/20 p-6 rounded-2xl border border-gray-800">
                                    <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">3. الشفافية</h3>
                                    <p className="text-sm leading-loose">لك الحق الكامل في مسح كافة بياناتك بضغطة زر واحدة من إعدادات النظام، مما يؤدي إلى تدمير رقمي فوري لكافة السجلات المرتبطة بهويتك.</p>
                                </section>
                            </div>
                        </div>
                    )}

                    {page === 'terms' && (
                        <div className="animate-fade-in">
                            <h1 className="text-4xl font-black text-white mb-10 flex items-center gap-4">
                                <DocumentTextIcon className="w-10 h-10 text-blue-500" /> ميثاق الاستخدام
                            </h1>
                            <div className="prose prose-invert max-w-none space-y-6">
                                <p className="font-bold text-lg">بمجرد تفعيل الكود السيادي، أنت تلتزم بالمعايير التالية:</p>
                                <ul className="list-none space-y-4">
                                    <li className="bg-gray-800/40 p-5 rounded-2xl border-r-4 border-blue-600 flex items-center gap-4">
                                        <CheckBadgeIcon className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span>الاستخدام القانوني والأخلاقي لأدوات الذكاء الاصطناعي.</span>
                                    </li>
                                    <li className="bg-gray-800/40 p-5 rounded-2xl border-r-4 border-blue-600 flex items-center gap-4">
                                        <CheckBadgeIcon className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span>عدم محاولة الهندسة العكسية للنواة (ZH-Core).</span>
                                    </li>
                                    <li className="bg-gray-800/40 p-5 rounded-2xl border-r-4 border-blue-600 flex items-center gap-4">
                                        <CheckBadgeIcon className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span>الحفاظ على سرية كود الدخول الخاص بك؛ المالك غير مسؤول عن تسريب الأكواد الشخصية.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {page === 'about' && (
                        <div className="text-center animate-fade-in">
                            <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[3rem] mx-auto mb-10 flex items-center justify-center shadow-2xl relative">
                                <UserIcon className="w-20 h-20 text-white" />
                                <div className="absolute -bottom-2 -right-2 bg-yellow-500 p-3 rounded-2xl shadow-xl">
                                    <GlobeAltIcon className="w-6 h-6 text-black animate-spin-slow" />
                                </div>
                            </div>
                            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter">رويال هارون</h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-bold leading-relaxed mb-12">
                                نحن لسنا مجرد مطورين، نحن معماريو المستقبل الرقمي. نظام <strong>ZOOKA OS</strong> هو نتاج سنوات من البحث لدمج القوة الاستخباراتية مع البساطة التنفيذية.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'دقة المعالجة', val: '99.9%' },
                                    { label: 'أمان النواة', val: 'Military' },
                                    { label: 'تحديثات حية', val: 'Real-time' },
                                    { label: 'دعم سيادي', val: 'Global' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700">
                                        <div className="text-2xl font-black text-white mb-1">{s.val}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Legal;
