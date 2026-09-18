import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Building2,
  Landmark,
  UserCog,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Activity,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import MetricTile from '../components/ui/MetricTile';
import ClinicalCard from '../components/ui/ClinicalCard';
import StatusBadge from '../components/ui/StatusBadge';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const modules = [
    {
      title: t('roles.veterinarian'),
      category: isRtl ? 'المستوى الميداني' : 'Niveau Terrain',
      desc: isRtl
        ? 'بوابة الطبيب البيطري الميداني للتصريح الفوري بحالات الحجز الصحي وتسجيل الآفات المرضية في المذابح.'
        : 'Portail du praticien pour la saisie des motifs de saisie vétérinaire et la notification des pathologies en abattoir.',
      path: '/veterinarian',
      actionPath: '/veterinarian/new-declaration',
      actionLabel: isRtl ? 'فتح استمارة جديدة' : 'Nouvelle saisie',
      icon: Stethoscope,
      badge: isRtl ? 'نظام الإدخال اليومي' : 'Saisie quotidienne',
      badgeVariant: 'dhis',
    },
    {
      title: t('roles.wilaya'),
      category: isRtl ? 'المستوى الولائي' : 'Niveau Wilaya',
      desc: isRtl
        ? 'بوابة مفتشية البيطرة بالولاية لمراجعة وتدقيق الحجوزات، متابعة بؤر الأمراض، والمصادقة على المحاضر.'
        : "Contrôle épidémiologique de Wilaya, validation des procès-verbaux de saisie et coordination sanitaire.",
      path: '/wilaya',
      actionPath: '/wilaya',
      actionLabel: isRtl ? 'مراجعة البلاغات' : 'Consulter les dossiers',
      icon: Building2,
      badge: isRtl ? 'التدقيق والمصادقة' : 'Contrôle & Validation',
      badgeVariant: 'warning',
    },
    {
      title: t('roles.ministry'),
      category: isRtl ? 'المستوى الوطني' : 'Niveau National',
      desc: isRtl
        ? 'لوحة القيادة المركزية لمديرية المصالح البيطرية لمتابعة الخريطة الوبائية الوطنية واتخاذ القرارات الصحية.'
        : 'Direction des Services Vétérinaires : agrégation des données nationales, SIG épidémiologique et alertes sanitaires.',
      path: '/ministry',
      actionPath: '/ministry',
      actionLabel: isRtl ? 'الخريطة الوبائية' : 'Carte sanitaire',
      icon: Landmark,
      badge: isRtl ? 'الرصد المركزي' : 'Surveillance centrale',
      badgeVariant: 'danger',
    },
    {
      title: t('roles.admin'),
      category: isRtl ? 'الإشراف التقني' : 'Administration',
      desc: isRtl
        ? 'إدارة حسابات المستخدمين، صلاحيات المفتشين والأطباء، إعدادات قاعدة البيانات وسجل التدقيق.'
        : 'Gestion des comptes, attributions des droits par abattoir/wilaya et journalisation des accès.',
      path: '/admin',
      actionPath: '/admin',
      actionLabel: isRtl ? 'إدارة النظام' : 'Paramètres',
      icon: UserCog,
      badge: isRtl ? 'الأمن والصلاحيات' : 'Sécurité & Accès',
      badgeVariant: 'neutral',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Institutional Page Header */}
      <PageHeader
        category={isRtl ? 'المنظومة الوطنية الموحدة' : 'Système National Unifié'}
        badge={isRtl ? 'حالة النظام: نشط' : 'Système opérationnel'}
        badgeVariant="success"
        title={t('app.title')}
        subtitle={t('app.subtitle')}
      />

      {/* National Indicators Toolbar (DHIS2 Key Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile
          label={isRtl ? 'المذابح المراقبة' : 'Abattoirs sous contrôle'}
          value="342"
          subtext={isRtl ? 'عبر 58 ولاية' : 'Sur 58 wilayas'}
          icon={Building2}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? 'إنذارات MDO النشطة' : 'Alertes MDO actives'}
          value="3"
          subtext={isRtl ? 'تحت العزل والتحقيق' : 'Enquête en cours'}
          icon={AlertTriangle}
          variant="red"
        />
        <MetricTile
          label={isRtl ? 'حجوزات هذا الأسبوع' : 'Saisies (Semaine)'}
          value="1,842 kg"
          subtext={isRtl ? '128 محضر فحص' : '128 procès-verbaux'}
          icon={FileCheck2}
          variant="amber"
        />
        <MetricTile
          label={isRtl ? 'نسبة استجابة المفتشيات' : 'Taux de conformité'}
          value="98.4%"
          subtext={isRtl ? 'فحص صحي بيطري منتظم' : 'Inspections régulières'}
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Main Clinical Operational Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <ClinicalCard
              key={mod.path}
              title={mod.title}
              subtitle={mod.category}
              icon={Icon}
              action={
                <StatusBadge variant={mod.badgeVariant}>
                  {mod.badge}
                </StatusBadge>
              }
              bodyClassName="p-4 space-y-3"
            >
              <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                {mod.desc}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={mod.path}
                  className="text-xs font-semibold text-dhis-700 hover:text-dhis-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isRtl ? 'دخول الوحدة' : 'Accéder au module'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </Link>

                <Link
                  to={mod.actionPath}
                  className="btn-secondary h-7 px-2.5 text-[11px]"
                >
                  {mod.actionLabel}
                </Link>
              </div>
            </ClinicalCard>
          );
        })}
      </div>
    </div>
  );
}