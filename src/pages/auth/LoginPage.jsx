import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-soft-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t('nav.login')}</h2>
        <p className="text-xs text-slate-500 mt-1">{t('app.subtitle')}</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t('roles.veterinarian')} / {t('nav.admin')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="user@vet-surveillance.dz"
              className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            كلمة المرور / Mot de passe
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>

        <button type="button" className="btn-primary w-full">
          {t('nav.login')}
        </button>
      </form>
    </div>
  );
}
