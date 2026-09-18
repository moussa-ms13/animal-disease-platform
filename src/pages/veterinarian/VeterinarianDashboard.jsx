import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Building2, User, Database, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import MetricTile from '../../components/ui/MetricTile';
import { getCurrentUser } from '../../services/dbService';

export default function VeterinarianDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? "المستخدم النشط" : "Praticien connecté"}
          value={user?.fullName || "Dr. Mohamed Benali"}
          subtext={user?.email || "vet@sante-animale.dz"}
          icon={User}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? "المذبح المعتمد" : "Établissement rattaché"}
          value={user?.slaughterhouseName || "Abattoir Communal Hussein Dey"}
          subtext={isRtl ? "ولاية الجزائر (16)" : "Wilaya d'Alger (16)"}
          icon={Building2}
          variant="emerald"
        />
        <MetricTile
          label={isRtl ? "حالة قاعدة البيانات" : "Modèle de données"}
          value="Schéma Actif"
          subtext="inspection_reports & seizure_items"
          icon={Database}
          variant="amber"
        />
      </div>

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
