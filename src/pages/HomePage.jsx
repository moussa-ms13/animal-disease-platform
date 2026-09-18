import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Stethoscope, Building2, Landmark, UserCog, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const portals = [
    {
      title: t('roles.veterinarian'),
      desc: isRtl
        ? 'بوابة الطبيب البيطري الميداني للتصريح الفوري بالحالات المرضية ومتابعة العينات.'
        : 'Portail du vétérinaire praticien pour la déclaration immédiate des pathologies et le suivi des prélèvements.',
      path: '/veterinarian',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-600',
      tag: isRtl ? 'المستوى الميداني' : 'Niveau Terrain'
    },
    {
      title: t('roles.wilaya'),
      desc: isRtl
        ? 'بوابة مفتشية البيطرة بالولاية لمراجعة، تدقيق والمصادقة على بلاغات البياطرة.'
        : "Portail de l'inspection vétérinaire de Wilaya pour la validation et le contrôle des saisies d'abattoir.",
      path: '/wilaya',
      icon: Building2,
      color: 'from-teal-600 to-cyan-600',
      tag: isRtl ? 'المستوى الولائي' : 'Niveau Wilaya'
    },
    {
      title: t('roles.ministry'),
      desc: isRtl
        ? 'لوحة القيادة المركزية لوزارة الفلاحة لرصد الخريطة الوبائية الوطنية واتخاذ القرارات.'
        : 'Tableau de bord central de la Direction des Services Vétérinaires pour la veille épidémiologique nationale.',
      path: '/ministry',
      icon: Landmark,
      color: 'from-cyan-600 to-blue-600',
      tag: isRtl ? 'المستوى الوطني' : 'Niveau National'
    },
    {
      title: t('roles.admin'),
      desc: isRtl
        ? 'إدارة المستخدمين، ضبط إعدادات النظام، وصلاحيات الوصول والتدقيق الأمني.'
        : 'Administration du système, gestion des utilisateurs, contrôle des accès et sécurité.',
      path: '/admin',
      icon: UserCog,
      color: 'from-slate-700 to-slate-900',
      tag: isRtl ? 'الإشراف التقني' : 'Administration'
    }
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isRtl
              ? 'منظومة الإنذار المبكر واليقظة الصحية البيطرية'
              : 'Système National de Veille et d’Alerte Sanitaire Vétérinaire'}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('app.title')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t('app.subtitle')}
        </p>
      </section>

      {/* Role Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.path}
              to={portal.path}
              className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-soft hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${portal.color} flex items-center justify-center text-white shadow-soft shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {portal.title}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {portal.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {portal.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{isRtl ? 'دخول البوابة' : 'Accéder au portail'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}