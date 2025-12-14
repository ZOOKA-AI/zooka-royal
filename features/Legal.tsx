import React from 'react';
import { ShieldCheckIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/solid';

interface LegalProps {
    page: 'privacy' | 'terms' | 'about';
}

const Legal: React.FC<LegalProps> = ({ page }) => {
    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-700 min-h-screen text-gray-300 leading-relaxed">
            {page === 'privacy' && (
                <div>
                    <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-green-500" /> سياسة الخصوصية
                    </h1>
                    <p className="mb-4">نحن في نظام زوكا (ZOOKA OS) نولي خصوصيتك أهمية قصوى. هذه السياسة تشرح كيف نجمع ونستخدم بياناتك.</p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-2">1. جمع البيانات</h3>
                    <p>نقوم بجمع البيانات الضرورية فقط لتشغيل النظام، مثل البريد الإلكتروني وسجلات الاستخدام التقنية.</p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-2">2. حماية المعلومات</h3>
                    <p>نستخدم تقنيات تشفير متقدمة (Cyber Shield) لحماية بياناتك من الوصول غير المصرح به.</p>
                </div>
            )}

            {page === 'terms' && (
                <div>
                    <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <DocumentTextIcon className="w-8 h-8 text-blue-500" /> شروط الاستخدام
                    </h1>
                    <p className="mb-4">استخدامك لنظام زوكا يعني موافقتك الكاملة على هذه الشروط.</p>
                    <ul className="list-disc list-inside space-y-3 mt-4">
                        <li>يمنع استخدام النظام في أي أنشطة غير قانونية.</li>
                        <li>حقوق الملكية الفكرية محفوظة للمالك (@3219).</li>
                        <li>الاشتراكات المدفوعة تجدد تلقائياً ما لم يتم إلغاؤها.</li>
                    </ul>
                </div>
            )}

            {page === 'about' && (
                <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                        <UserIcon className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">من نحن؟</h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        نحن فريق <strong>ZOOKA CORE</strong>، نسعى لتقديم حلول ذكاء اصطناعي متكاملة وآمنة. نظامنا مصمم ليكون حصناً رقمياً ومساعداً ذكياً في آن واحد.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-bold text-white text-xl">100%</h4>
                            <span className="text-xs text-gray-500">حماية</span>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-bold text-white text-xl">24/7</h4>
                            <span className="text-xs text-gray-500">تواجد</span>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-bold text-white text-xl">∞</h4>
                            <span className="text-xs text-gray-500">تطوير</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Legal;