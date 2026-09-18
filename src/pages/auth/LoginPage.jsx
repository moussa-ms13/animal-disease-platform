import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  Loader2,
  AlertCircle,
  Globe2,
  ChevronDown
} from 'lucide-react';
import { loginUser, getCurrentUser } from '../../services/dbService';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    const activeUser = getCurrentUser();
    if (activeUser?.role) {
      redirectUser(activeUser.role);
    }
  }, []);

  const redirectUser = (role) => {
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
    setError('');

    if (!email.trim()) {
      setError(
        i18n.language === 'ar'
          ? "يرجى إدخال البريد الإلكتروني المؤسساتي"
          : "Veuillez saisir votre adresse e-mail institutionnelle."
      );
      return;
    }

    setLoading(true);

    try {
      const { user, error: loginErr } = await loginUser(email, password);

      if (loginErr || !user) {
        setError(
          loginErr ||
            (i18n.language === 'ar'
              ? "فشل تسجيل الدخول. يرجى التحقق من صحة البيانات المدخلة."
              : "Identifiants invalides ou compte non autorisé.")
        );
        setLoading(false);
        return;
      }

      redirectUser(user.role);
    } catch (err) {
      console.error('[LoginPage] Error:', err);
      setError(
        i18n.language === 'ar'
          ? "حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً."
          : "Erreur de connexion au serveur. Veuillez réessayer."
      );
      setLoading(false);
    }
  };

  const setDemoAccount = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('••••••••');
    setError('');
  };

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Main Utilitarian Clinical Card */}
      <div className="max-w-5xl w-full bg-white flex flex-col md:flex-row rounded-sm shadow-md border border-slate-300 overflow-hidden min-h-[560px] lg:min-h-[590px]">
        
        {/* =========================================================================
            LEFT PANEL: Institutional Identity & Local Image Overlay
           ========================================================================= */}
        <div className="w-full md:w-1/2 bg-[#1a2b3c] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex border-r border-slate-700/50">
          {/* Subtle local clinical background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: "url('/images.jpg')" }}
          />

          {/* Top Institutional Header */}
          <div className="relative z-10">
            {/* Header Identity Badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-sm border border-slate-600 bg-[#0f1d2c] flex items-center justify-center text-slate-200 shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-slate-300" />
              </div>
              <div className="leading-tight">
                <span className="block text-[11px] uppercase tracking-widest font-bold text-slate-300">
                  RÉPUBLIQUE ALGÉRIENNE
                </span>
                <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
                  MINISTÈRE DE L'AGRICULTURE — DSV
                </span>
              </div>
            </div>

            {/* Platform Title */}
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-1.5 leading-tight">
              Plateforme Nationale de Surveillance
            </h1>
            <h2 className="text-xs uppercase tracking-wider text-slate-300 font-mono font-medium">
              Système de Suivi Sanitaire & Épidémiologique des Abattoirs
            </h2>

            {/* Utilitarian Policy Note */}
            <div className="mt-5 p-3 bg-[#0f1d2c]/80 border-l-2 border-slate-400 text-xs text-slate-300 font-mono leading-relaxed rounded-sm">
              Réseau national d'épidémio-surveillance des abattoirs (MADR/DSV). Centralisation des saisies et notification obligatoire des zoonoses.
            </div>
          </div>

          {/* Bottom Dense Status Block (Rigid Clinical Data Box) */}
          <div className="relative z-10 mt-6 pt-3 border-t border-slate-700/80 font-mono text-[11px] text-slate-300 space-y-1.5 bg-[#0f1d2c]/90 p-3 rounded-sm border border-slate-700">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-700/60 pb-1 mb-1 font-semibold uppercase text-[10px] tracking-wider">
              <span>Protocole Sanitaire</span>
              <span className="text-emerald-400">NORMES DHIS2 / OIE</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-bold shrink-0">[SYS-01]</span>
              <span className="truncate">Inspection Ante & Post-Mortem Standardisée</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-bold shrink-0">[SYS-02]</span>
              <span className="truncate">Veille Sanitaire & Déclaration MDO Immédiate</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-bold shrink-0">[SYS-03]</span>
              <span className="truncate">Traçabilité Complète & Visa de Wilaya Sécurisé</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: Clinical Utilitarian Form
           ========================================================================= */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white relative">
          {/* Top Row: Strict Language Selector */}
          <div className="flex justify-end mb-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-sm cursor-pointer transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{i18n.language === 'ar' ? 'العربية' : 'FR Français'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute end-0 mt-1 w-32 bg-white border border-slate-300 rounded-sm shadow-md py-1 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => switchLanguage('fr')}
                    className={
                      i18n.language === 'fr'
                        ? 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-blue-800 font-bold'
                        : 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-slate-700'
                    }
                  >
                    FR Français
                  </button>
                  <button
                    type="button"
                    onClick={() => switchLanguage('ar')}
                    className={
                      i18n.language === 'ar'
                        ? 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-blue-800 font-bold'
                        : 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-slate-700'
                    }
                  >
                    العربية (AR)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="my-auto">
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {i18n.language === 'ar' ? 'تسجيل الدخول' : 'Connexion Sécurisée'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {i18n.language === 'ar'
                  ? 'يرجى إدخال بيانات الاعتماد المهنية للولوج إلى البوابة'
                  : 'Veuillez renseigner vos identifiants pour accéder au portail'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-300 rounded-sm text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  {i18n.language === 'ar' ? 'البريد الإلكتروني المهني' : 'Identifiant / E-mail Institutionnel'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="utilisateur@sante-animale.dz"
                    className="w-full ps-8 pe-3 py-2 text-xs rounded-sm border border-slate-300 focus:border-blue-700 focus:ring-0 focus:outline-none bg-white transition-colors placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  {i18n.language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full ps-8 pe-8 py-2 text-xs rounded-sm border border-slate-300 focus:border-blue-700 focus:ring-0 focus:outline-none bg-white transition-colors placeholder:text-slate-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-none text-blue-800 border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px]">{i18n.language === 'ar' ? 'تذكرني' : 'Se souvenir de moi'}</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      i18n.language === 'ar'
                        ? 'يرجى التواصل مع مسؤول النظام الولائي لإعادة تعيين كلمة المرور.'
                        : 'Veuillez contacter votre administrateur de Wilaya pour réinitialiser votre accès.'
                    );
                  }}
                  className="text-[11px] text-[#0c4a6e] hover:underline font-medium"
                >
                  {i18n.language === 'ar' ? 'نسيت كلمة المرور ؟' : 'Mot de passe oublié ?'}
                </a>
              </div>

              {/* Utilitarian Flat Solid Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0c4a6e] hover:bg-[#072c41] active:bg-[#051e2c] disabled:opacity-70 text-white font-semibold py-2 px-4 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 border border-[#09354f]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{i18n.language === 'ar' ? 'جاري التحقق...' : 'Connexion en cours...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{i18n.language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Role Tester (Dense Utilitarian Buttons) */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                {i18n.language === 'ar' ? 'حسابات التجربة السريعة' : 'Comptes de test rapide (Rôles)'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDemoAccount('vet@sante-animale.dz')}
                  className="px-2 py-1 rounded-sm bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors cursor-pointer truncate"
                >
                  Vétérinaire
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('wilaya@sante-animale.dz')}
                  className="px-2 py-1 rounded-sm bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors cursor-pointer truncate"
                >
                  Wilaya
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('central@sante-animale.dz')}
                  className="px-2 py-1 rounded-sm bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors cursor-pointer truncate"
                >
                  Ministère
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('admin@sante-animale.dz')}
                  className="px-2 py-1 rounded-sm bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors cursor-pointer truncate"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Footnote */}
          <div className="pt-3 border-t border-slate-200 mt-3 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 leading-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                {i18n.language === 'ar'
                  ? 'نظام مؤمن. الدخول مقصور على الأطباء والمفتشين البيطريين المعتمدين.'
                  : 'Accès restreint au personnel autorisé. Vos données sont sécurisées.'}
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
