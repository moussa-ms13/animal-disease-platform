import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Languages, Stethoscope, Building2, Landmark, UserCog, LogIn } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { path: '/veterinarian', label: t('nav.veterinarian'), icon: Stethoscope },
    { path: '/wilaya', label: t('nav.wilaya'), icon: Building2 },
    { path: '/ministry', label: t('nav.ministry'), icon: Landmark },
    { path: '/admin', label: t('nav.admin'), icon: UserCog },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-soft shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {t('app.title')}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xl">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-soft-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{i18n.language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>

            <Link
              to="/login"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-soft transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.login')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}