import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, CheckSquare, Clock, AlertOctagon } from 'lucide-react';

export default function WilayaDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge-alert mb-2">{t('roles.wilaya')}</span>
          <h2 className="text-2xl font-bold text-slate-900">{t('nav.wilaya')}</h2>
          <p className="text-sm text-slate-500">
            المصادقة على تصريحات البياطرة الخواص والعموميين وتنسيق التدخلات الولائية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">في انتظار المصادقة / En attente</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">7</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">تم التحقق منها / Validées</span>
            <CheckSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">48</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">بؤر محتملة / Foyers suspects</span>
            <AlertOctagon className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">1</p>
        </div>
      </div>
    </div>
  );
}
