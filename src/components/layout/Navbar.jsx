import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Languages, Stethoscope, Building2, Landmark, UserCog, LogIn } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-dhis-900 text-white border-b border-dhis-950 shadow-clinical">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Institutional Logo & Title */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white rounded-xs p-1"
          >
            <div className="w-7 h-7 rounded-sm bg-dhis-700 border border-dhis-500 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-white leading-none truncate">
                {t('app.title')}
              </h1>
              <p className="text-[10px] text-dhis-200 hidden md:block truncate mt-0.5">
                {t('app.subtitle')}
              </p>
            </div>
          </Link>

          {/* Role Navigation Links & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white ${
                      isActive
                        ? 'bg-dhis-700 text-white border border-dhis-500'
                        : 'text-dhis-100 hover:text-white hover:bg-dhis-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-4 w-px bg-dhis-800 hidden lg:block"></div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 h-7 px-2 rounded-sm bg-dhis-800 hover:bg-dhis-700 border border-dhis-700 text-dhis-100 hover:text-white text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 text-dhis-300" />
              <span>{i18n.language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>

            {/* Auth Button */}
            <Link
              to="/login"
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-sm bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.login')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}