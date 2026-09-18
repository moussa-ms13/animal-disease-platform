import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, CheckCircle2, ClipboardList } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getCurrentUser } from '../../services/dbService';

export default function VeterinarianDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  // Dynamic Session Reference and Formatted Date
  const { sessionDate, sessionRef } = useMemo(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    return {
      sessionDate: `${d}/${m}/${y}`,
      sessionRef: `PV-${y}${m}${d}-16`,
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Page Header */}
      <PageHeader
        category={t('roles.veterinarian')}
        badge="Poste Sanitaire d'Abattoir"
        badgeVariant="dhis"
        title={t('nav.veterinarian')}
        subtitle={
          isRtl
            ? "بوابة الطبيب البيطري لتسجيل الفحص الصحي، محاضر الحجز اليومية والتصريح بالأمراض الخاضعة للإبلاغ الإجباري."
            : "Portail opérationnel du praticien pour la saisie journalière des saisies et des alertes sanitaires."
        }
      />

      {/* Clinical Inspection Session Header (En-tête de rapport d'inspection / PV) */}
      <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
        {/* PV Top Bar Ribbon */}
        <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono border-s-4 border-s-[#0c4a6e]">
          <div className="flex items-center gap-2 text-slate-700">
            <ClipboardList className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
              {isRtl
                ? "محضر الفحص والتفتيش البيطري — نموذج رسمي رقمي"
                : "PV D'INSPECTION SANITAIRE ET VÉTÉRINAIRE — SESSION EN COURS"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[10px]">
            <span>
              REF : <strong className="text-slate-800 font-mono font-bold">{sessionRef}</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">
              REG : <strong className="text-slate-700 font-mono">DSV-MDO-2026</strong>
            </span>
          </div>
        </div>

        {/* Dense Key-Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 rtl:divide-x-reverse bg-white">
          {/* Cell 1: Médecin Inspecteur */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? "الطبيب المفتش المسؤول" : "MÉDECIN INSPECTEUR"}
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate">
              {user?.fullName || (isRtl ? "د. محمد بن علي" : "Dr. Mohamed Benali")}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {user?.email || "inspecteur.vet@sante-animale.dz"}
            </span>
          </div>

          {/* Cell 2: Établissement d'abattage */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? "المذبح / المنشأة المعتمدة" : "ÉTABLISSEMENT D'ABATTAGE"}
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate">
              {user?.slaughterhouseName || (isRtl ? "مذبح بلدي حسين داي" : "Abattoir Communal Hussein Dey")}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {user?.wilayaName || (isRtl ? "ولاية الجزائر (الرمز 16)" : "Wilaya d'Alger (Code 16)")}
            </span>
          </div>

          {/* Cell 3: Date d'inspection */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? "تاريخ المراقبة الصحية" : "DATE D'INSPECTION"}
            </span>
            <span className="text-sm font-semibold text-slate-900 font-mono">
              {sessionDate}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {isRtl ? "فترة الفحص الصباحي (06:00 - 14:00)" : "VACATION MATINALE (06:00 - 14:00)"}
            </span>
          </div>

          {/* Cell 4: Statut Session */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? "حالة الجلسة" : "STATUT SESSION"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                {isRtl ? "جلسة نشطة" : "ACTIVE"}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {isRtl ? "تسجيل مباشر للمحاضر" : "SAISIE SANITAIRE EN DIRECT"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Inspection Module Card */}
      <ClinicalCard
        title={isRtl ? "وحدة الفحص الصحي والتسجيل اليومي (المذبح)" : "Module d'Inspection et de Saisie Journalière"}
        subtitle={isRtl ? "جاهز للربط بقاعدة البيانات والشبكة الوبائية" : "Prêt pour l'intégration DataGrid et transactions PostgreSQL"}
        icon={Stethoscope}
        action={<StatusBadge variant="success" dot>{isRtl ? "نظام متصل" : "Connecté"}</StatusBadge>}
      >
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-center py-10 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            {isRtl ? "لوحة الطبيب البيطري جاهزة للربط" : "Tableau de Bord Vétérinaire Initialisé"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRtl
              ? "تم ضبط المسار بنجاح وفق نظام المصادقة المستقل. المرحلة القادمة: ربط شبكة البيانات التفاعلية وجدول الحجوزات اليومية."
              : "Routage sécurisé par rôle validé. Le modèle agrégé est prêt pour le formulaire de saisie des saisies sanitaires."}
          </p>
        </div>
      </ClinicalCard>
    </div>
  );
}
