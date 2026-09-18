import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle, Loader2, UserCheck } from 'lucide-react';
import ClinicalButton from '../../components/ui/ClinicalButton';
import StatusBadge from '../../components/ui/StatusBadge';
import { loginUser, getCurrentUser } from '../../services/dbService';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (activeUser?.role) {
      redirectByRole(activeUser.role);
    }
  }, []);

  const redirectByRole = (role) => {
    switch (role) {
      case 'VETERINARIAN':
        navigate('/veterinarian', { replace: true });
        break;
      case 'WILAYA_INSPECTOR':
        navigate('/wilaya', { replace: true });
        break;
      case 'MINISTRY_ADMIN':
      case 'MINISTRY':
        navigate('/ministry', { replace: true });
        break;
      case 'SYSTEM_ADMIN':
      case 'ADMIN':
        navigate('/admin', { replace: true });
        break;
      default:
        navigate('/veterinarian', { replace: true });
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال البريد الإلكتروني' : 'Veuillez saisir votre email institutionnel');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await loginUser(email, password);

      if (error || !user) {
        setErrorMessage(
          error || (isRtl ? 'فشل تسجيل الدخول. تحقق من البيانات المدخلة.' : "Échec de l'authentification. Veuillez vérifier vos identifiants.")
        );
        setIsLoading(false);
        return;
      }

      redirectByRole(user.role);
    } catch (err) {
      console.error('[LoginPage] Error:', err);
      setErrorMessage(isRtl ? 'حدث خطأ في الاتصال بالخادم' : "Erreur de communication avec le serveur d'authentification");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (testEmail) => {
    setEmail(testEmail);
    setPassword('••••••••');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 px-4">
      <div className="bg-white border border-slate-300 border-t-4 border-t-dhis-800 rounded-sm shadow-clinical">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/75 flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-dhis-800 text-white flex items-center justify-center shrink-0 border border-dhis-900">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge variant="dhis" label="DHIS2 / WHO Protocol" />
              <span className="text-[10px] text-slate-400 font-mono">v2.40-DB</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {t('nav.login')} — {t('app.title')}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-sm text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isRtl ? 'البريد الإلكتروني المهني' : 'Identifiant / Email Institutionnel'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="utilisateur@sante-animale.dz"
                className="clinical-input ps-8 w-full font-mono text-xs"
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
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="clinical-input ps-8 w-full font-mono"
              />
            </div>
          </div>

          <div className="pt-1">
            <ClinicalButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              icon={isLoading ? Loader2 : Lock}
              className="w-full justify-center text-xs uppercase tracking-wider"
            >
              {isLoading
                ? (isRtl ? 'جاري التحقق...' : 'Vérification...')
                : t('nav.login')}
            </ClinicalButton>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-dhis-700" />
              <span>{isRtl ? 'حسابات الاختبار التجريبي السريع' : 'Comptes de test rapide (Rôles)'}</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('vet@sante-animale.dz')}
                className="text-start px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-slate-700 transition-colors cursor-pointer truncate"
              >
                <span className="font-bold block text-dhis-800">1. Vétérinaire</span>
                <span className="text-[10px] text-slate-500">vet@sante-animale.dz</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('wilaya@sante-animale.dz')}
                className="text-start px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-slate-700 transition-colors cursor-pointer truncate"
              >
                <span className="font-bold block text-amber-800">2. Wilaya</span>
                <span className="text-[10px] text-slate-500">wilaya@sante-animale.dz</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('central@sante-animale.dz')}
                className="text-start px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-slate-700 transition-colors cursor-pointer truncate"
              >
                <span className="font-bold block text-red-800">3. Ministère</span>
                <span className="text-[10px] text-slate-500">central@sante-animale.dz</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@sante-animale.dz')}
                className="text-start px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-slate-700 transition-colors cursor-pointer truncate"
              >
                <span className="font-bold block text-slate-800">4. Admin</span>
                <span className="text-[10px] text-slate-500">admin@sante-animale.dz</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-sm border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-dhis-700 shrink-0 mt-0.5" />
            <p className="leading-tight">
              {isRtl
                ? 'الدخول مقصور على الأطباء والمفتشين البيطريين المعتمدين والمصالح المركزية والولائية.'
                : 'Accès strictement réservé aux vétérinaires inspecteurs assermentés et autorités sanitaires habilitées.'}
            </p>
          </div>
        </form>
      </div>

      <div className="mt-3 text-center text-[11px] text-slate-400">
        Réseau National d'Épidémio-Surveillance Vétérinaire (MADR)
      </div>
    </div>
  );
}
