import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCog, Users, ShieldCheck, Database, KeyRound } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge-alert mb-2">{t('roles.admin')}</span>
          <h2 className="text-2xl font-bold text-slate-900">{t('nav.admin')}</h2>
          <p className="text-sm text-slate-500">
            إدارة الحسابات، الصلاحيات، سجل التدقيق وإعدادات الربط مع قاعدة البيانات Supabase
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">الأطباء البياطرة المسجلون</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">1,890</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">مفتشيات الولايات</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">58</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">حالة الربط مع Supabase</span>
            <Database className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-sm font-bold text-teal-700 mt-2">مهيأ / Initialisé</p>
        </div>
      </div>
    </div>
  );
}
