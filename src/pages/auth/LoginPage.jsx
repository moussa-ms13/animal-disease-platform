import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  FileCheck2,
  HeartPulse,
  Loader2,
  AlertCircle,
  Sun,
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

  // Auto-redirect if already logged in
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
          ? 'يرجى إدخال البريد الإلكتروني المؤسساتي'
          : 'Veuillez saisir votre adresse e-mail institutionnelle.'
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
              ? 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات المدخلة.'
              : 'Identifiants invalides ou compte non autorisé.')
        );
        setLoading(false);
        return;
      }

      // Successful login -> Redirect based on institutional role
      redirectUser(user.role);
    } catch (err) {
      console.error('[LoginPage] Submit error:', err);
      setError(
        i18n.language === 'ar'
          ? 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.'
          : 'Erreur de connexion au serveur. Veuillez réessayer.'
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
    <div className="min-h-screen w-full bg-slate-100/90 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Main Split-Screen Card */}
      <div className="max-w-5xl w-full bg-white flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden border border-slate-200/70 min-h-[580px] lg:min-h-[620px]">
        
        {/* =========================================================================
            LEFT PANEL: Institutional Branding & Visual Identity (50% on desktop)
           ========================================================================= */}
        <div className="w-full md:w-1/2 bg-[#0c2340] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c2340]/90 via-[#0c2340]/80 to-[#07172b]/98" />

          {/* Top Brand Block */}
          <div className="relative z-10">
            {/* Logo Emblem (styled similarly to mockup's hand-drawn box with sun/shield) */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl border-2 border-amber-400/80 bg-amber-400/10 flex items-center justify-center shadow-inner relative group">
                <Sun className="w-6 h-6 text-amber-400" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs uppercase tracking-widest font-extrabold text-amber-400">
                  RÉPUBLIQUE ALGÉRIENNE
                </span>
                <span className="block text-[11px] text-slate-300 font-medium tracking-wide">
                  MINISTÈRE DE L'AGRICULTURE (DSV)
                </span>
              </div>
            </div>

            {/* Platform Title */}
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Plateforme <span className="text-blue-400">Nationale</span>
            </h1>
            <h2 className="text-base lg:text-lg font-semibold text-slate-200 leading-snug">
              Surveillance Épidémiologique des Abattoirs
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
              Système numérique unifié d'alerte précoce, de déclaration des saisies vétérinaires et de veille sanitaire.
            </p>

            {/* Thematic Quote */}
            <div className="mt-8 pl-4 border-l-2 border-amber-400/80 text-xs italic text-slate-200 max-w-sm">
              <span className="text-amber-400 font-serif text-lg leading-none">“</span> La vigilance sanitaire aujourd'hui, la sécurité alimentaire demain. <span className="text-amber-400 font-serif text-lg leading-none">”</span>
            </div>
          </div>

          {/* Bottom Features Box (Matching the 3 columns in mockup) */}
          <div className="relative z-10 mt-8 pt-4 border-t border-white/10 bg-white/5 backdrop-blur-xs rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-slate-200">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-1.5 text-blue-300">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white block">Inspection</span>
              <span className="text-[9px] text-slate-400 leading-tight">Post-mortem rigoureuse</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-1.5 text-amber-300">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white block">Traçabilité</span>
              <span className="text-[9px] text-slate-400 leading-tight">Motifs de saisies & MDO</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-1.5 text-emerald-300">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-white block">Santé Publique</span>
              <span className="text-[9px] text-slate-400 leading-tight">Sécurité alimentaire</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: Authentication Form (50% on desktop, 100% on mobile)
           ========================================================================= */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white relative">
          {/* Top Row: Language Picker */}
          <div className="flex justify-end mb-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{i18n.language === 'ar' ? 'العربية' : 'FR Français'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute end-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => switchLanguage('fr')}
                    className={
                      i18n.language === 'fr'
                        ? 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-blue-600 font-bold'
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
                        ? 'w-full text-start px-3 py-1.5 hover:bg-slate-50 text-blue-600 font-bold'
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
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {i18n.language === 'ar' ? 'مرحباً بك !' : 'Bienvenue !'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {i18n.language === 'ar'
                  ? 'سجّل الدخول إلى فضاء المراقبة الوبائية الآمن'
                  : 'Connectez-vous à votre espace sécurisé'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Adresse e-mail'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={i18n.language === 'ar' ? 'exemple@sante-animale.dz' : 'exemple@sante-animale.dz'}
                    className="w-full ps-10 pe-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {i18n.language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={i18n.language === 'ar' ? '••••••••••••' : 'Votre mot de passe'}
                    className="w-full ps-10 pe-10 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{i18n.language === 'ar' ? 'تذكرني' : 'Se souvenir de moi'}</span>
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
                  className="text-blue-600 hover:underline font-medium text-xs sm:text-sm"
                >
                  {i18n.language === 'ar' ? 'نسيت كلمة المرور ؟' : 'Mot de passe oublié ?'}
                </a>
              </div>

              {/* Solid Blue Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1d4ed8] hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{i18n.language === 'ar' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{i18n.language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Role Tester (Seamless Dev Switcher) */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                {i18n.language === 'ar' ? 'حسابات التجربة السريعة' : 'Sélection rapide pour test'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDemoAccount('vet@sante-animale.dz')}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-600 transition-colors"
                >
                  Vétérinaire
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('wilaya@sante-animale.dz')}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 text-slate-600 transition-colors"
                >
                  Wilaya
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('central@sante-animale.dz')}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200 text-slate-600 transition-colors"
                >
                  Ministère
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('admin@sante-animale.dz')}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Footnote */}
          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 leading-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {i18n.language === 'ar'
                  ? 'الدخول مقصور على الموظفين المعتمدين. بياناتكم محمية ومؤمنة.'
                  : 'Accès restreint au personnel autorisé. Vos données sont sécurisées.'}
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
