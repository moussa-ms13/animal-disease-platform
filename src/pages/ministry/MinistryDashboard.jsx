import React from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, MapPin, Activity, BarChart3, Download } from 'lucide-react';

export default function MinistryDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge-alert mb-2">{t('roles.ministry')}</span>
          <h2 className="text-2xl font-bold text-slate-900">{t('nav.ministry')}</h2>
          <p className="text-sm text-slate-500">
            الخريطة الوبائية الوطنية، التحليلات الجغرافية وإصدار القرارات الصحية المركزية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs">
            <Download className="w-4 h-4" />
            <span>{t('actions.exportPDF')}</span>
          </button>
          <button className="btn-secondary text-xs">
            <Download className="w-4 h-4" />
            <span>{t('actions.exportExcel')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500">إجمالي البلاغات الوطنية</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">1,248</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500">ولايات تحت المراقبة</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">14</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500">بؤر تم تطويقها</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">29</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500">نسبة التغطية البيطرية</span>
          <p className="text-2xl font-bold text-teal-600 mt-2">94.2%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft text-center py-12">
        <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">الخريطة الوبائية التفاعلية (SIG Épidémiologique)</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          المكون التفاعلي للرصد الجغرافي الحيوي للولايات والبؤر سيتم ربطه في المراحل القادمة
        </p>
      </div>
    </div>
  );
}
