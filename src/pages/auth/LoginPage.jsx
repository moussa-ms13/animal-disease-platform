import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import ClinicalButton from '../../components/ui/ClinicalButton';
import StatusBadge from '../../components/ui/StatusBadge';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      {/* DHIS2 Utilitarian Login Container */}
      <div className="bg-white border border-slate-300 border-t-4 border-t-dhis-800 rounded-sm shadow-none">
        {/* Institutional Header Banner */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/75 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-dhis-800 text-white flex items-center justify-center shrink-0 border border-dhis-900">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge variant="dhis" label="DHIS2 / WHO Protocol" />
              <span className="text-[10px] text-slate-400 font-mono">v2.40-CLINICAL</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {t('nav.login')} - {t('app.title')}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isRtl ? 'البريد الإلكتروني المهني' : 'Identifiant Institutionnel / Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="veterinaire@sante-animale.dz"
                className="clinical-input ps-8 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isRtl ? 'كلمة المرور' : 'Mot de passe sécurisé'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="clinical-input ps-8 w-full font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <ClinicalButton
              type="submit"
              variant="primary"
              size="md"
              icon={Lock}
              className="w-full justify-center text-xs uppercase tracking-wider"
            >
              {t('nav.login')}
            </ClinicalButton>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-sm border border-slate-200">
            <AlertCircle className="w-4 h-4 text-dhis-700 shrink-0 mt-0.5" />
            <p className="leading-tight">
              {isRtl
                ? 'الدخول مقصور على المفتشين والأطباء البيطريين المعتمدين والمصالح المركزية والولائية لوزارة الفلاحة.'
                : 'Accès strictement réservé aux vétérinaires inspecteurs assermentés et autorités sanitaires habilitées.'}
            </p>
          </div>
        </form>
      </div>

      {/* Security Footer */}
      <div className="mt-3 text-center text-[11px] text-slate-400">
        Réseau National d'Épidémio-Surveillance Vétérinaire (MADR)
      </div>
    </div>
  );
}