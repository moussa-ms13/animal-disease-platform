import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Languages, LogOut, User } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { getCurrentUser, logoutUser } from '../../services/dbService';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case 'VETERINARIAN':
        return 'dhis';
      case 'WILAYA_INSPECTOR':
        return 'warning';
      case 'MINISTRY_ADMIN':
      case 'MINISTRY':
        return 'danger';
      case 'SYSTEM_ADMIN':
      case 'ADMIN':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-dhis-900 text-white border-b border-dhis-950 shadow-clinical">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Institutional Title & Emblem */}
          <div className="flex items-center gap-2.5 min-w-0">
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
          </div>

          {/* User Session & Utility Controls (Minimal Shell) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Logged-in User Badge */}
            {user && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-dhis-800 border border-dhis-700 rounded-sm">
                <div className="w-5 h-5 rounded-sm bg-dhis-700 text-dhis-100 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3" />
                </div>
                <div className="text-start hidden sm:block">
                  <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[130px]">
                    {user.fullName || user.email}
                  </span>
                </div>
                <StatusBadge variant={getRoleVariant(user.role)}>
                  {user.role}
                </StatusBadge>
              </div>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 h-7 px-2 rounded-sm bg-dhis-800 hover:bg-dhis-700 border border-dhis-700 text-dhis-100 hover:text-white text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 text-dhis-300" />
              <span>{i18n.language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>

            {/* Logout Button */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-sm bg-red-700 hover:bg-red-800 border border-red-800 text-white text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                title={t('nav.logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
