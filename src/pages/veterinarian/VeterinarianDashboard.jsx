import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, PlusCircle, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VeterinarianDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge-success mb-2">{t('roles.veterinarian')}</span>
          <h2 className="text-2xl font-bold text-slate-900">{t('nav.veterinarian')}</h2>
          <p className="text-sm text-slate-500">
            واجهة التصريح بالأمراض الحيوانية ومتابعة البلاغات البيطرية الميدانية
          </p>
        </div>
        <button className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          <span>{t('actions.newDeclaration')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">البلاغات المسجلة / Déclarations</span>
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">12</p>
          <span className="text-xs text-slate-500 mt-1 block">خلال الشهر الجاري</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إنذارات عاجلة / Alertes</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">2</p>
          <span className="text-xs text-amber-700 mt-1 block">تتطلب أخذ عينات مخبرية</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">حالات مصادق عليها / Validées</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">10</p>
          <span className="text-xs text-emerald-700 mt-1 block">من طرف المفتشية الولائية</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <h3 className="text-base font-semibold text-slate-800 mb-2">
          مخطط سريان البيانات البيطرية (Veterinarian Spec Foundation)
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          هذا المسار مخصص لاستقبال مواصفات واجهات الطبيب البيطري (إدخال البلاغات، رفع الصور والأعراض، تصدير الشهادات، والمزامنة في وضع عدم الاتصال).
        </p>
      </div>
    </div>
  );
}
