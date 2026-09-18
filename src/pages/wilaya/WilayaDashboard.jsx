import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, User, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import MetricTile from '../../components/ui/MetricTile';
import { getCurrentUser } from '../../services/dbService';

export default function WilayaDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.wilaya')}
        badge="Inspection Vétérinaire de Wilaya"
        badgeVariant="warning"
        title={t('nav.wilaya')}
        subtitle={
          isRtl
            ? "المراقبة الوبائية الإقليمية، مراجعة وتدقيق محاضر الحجز الصحي المرفوعة من المذابح والمصادقة الرسمية."
            : "Supervision épidémiologique territoriale et validation des procès-verbaux de saisie d'abattoir."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? "المفتش الولائي" : "Inspecteur connecté"}
          value={user?.fullName || "Dr. Samia Khelifi"}
          subtext={user?.email || "wilaya@sante-animale.dz"}
          icon={User}
          variant="amber"
        />
        <MetricTile
          label={isRtl ? "الإقليم والاختصاص" : "Juridiction sanitaire"}
          value={user?.wilayaName || "Wilaya d'Alger (16)"}
          subtext={isRtl ? "جميع مذابح الإقليم" : "Tous abattoirs rattachés"}
          icon={Building2}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? "مسار المصادقة" : "Workflow de validation"}
          value="DRAFT -> VALIDATED"
          subtext="Contrôle & Visa officiel"
          icon={ShieldCheck}
          variant="emerald"
        />
      </div>

      <ClinicalCard
        title={isRtl ? "سجل استقبال ومصادقة محاضر المذابح" : "Registre de Réception & Validation des PV"}
        subtitle={isRtl ? "مساحة المفتشية الولائية لمراقبة السلامة الغذائية" : "Espace d'arbitrage sanitaire et d'investigation épidémiologique"}
        icon={Building2}
        action={<StatusBadge variant="warning" dot>{isRtl ? "رقابة نشطة" : "Supervision active"}</StatusBadge>}
      >
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-center py-10 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            {isRtl ? "لوحة التفتيش الولائي مهيأة" : "Tableau de Bord Wilaya Initialisé"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRtl
              ? "تم عزل الصلاحيات حسب الولاية بنجاح. جاهز لعرض جدول المحاضر الواردة وإجراءات المصادقة أو الإرجاع للتصحيح."
              : "Accès sécurisé réservé à l'inspection de Wilaya. Prêt pour la réception des flux d'abattoirs."}
          </p>
        </div>
      </ClinicalCard>
    </div>
  );
}
