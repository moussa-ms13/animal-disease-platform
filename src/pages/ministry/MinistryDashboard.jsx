import React from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, User, Activity, Globe, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import MetricTile from '../../components/ui/MetricTile';
import { getCurrentUser } from '../../services/dbService';

export default function MinistryDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.ministry')}
        badge="Direction des Services Vétérinaires (Centrale)"
        badgeVariant="danger"
        title={t('nav.ministry')}
        subtitle={
          isRtl
            ? "الرصد الوبائي المركزي الوطني، تجميع مؤشرات الأمراض الحيوانية والمحجوزات، والإنذار المبكر للأوبئة."
            : "Observatoire épidémiologique national centralisé, consolidation des saisies et alertes MDO."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? "المسؤول المركزي" : "Responsable DSV"}
          value={user?.fullName || "Dr. Yacine DSV"}
          subtext={user?.email || "central@sante-animale.dz"}
          icon={User}
          variant="red"
        />
        <MetricTile
          label={isRtl ? "نطاق التغطية" : "Périmètre national"}
          value="58 Wilayas"
          subtext={isRtl ? "تغطية شاملة للمذابح" : "Réseau national d'abattage"}
          icon={Globe}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? "نظام المراقبة" : "Veille sanitaire"}
          value="DHIS2 / WHO Protocol"
          subtext="Indicateurs agrégés"
          icon={Activity}
          variant="emerald"
        />
      </div>

      <ClinicalCard
        title={isRtl ? "لوحة القيادة والمؤشرات الوبائية الوطنية" : "Tableau de Bord Épidémiologique National"}
        subtitle={isRtl ? "تجميع شامل لمعطيات الإنذار الصحي والمحجوزات عبر القطر" : "Agrégation macroscopique des données sanitaires transmises"}
        icon={Landmark}
        action={<StatusBadge variant="danger" dot>{isRtl ? "مراقبة مركزية" : "Veille centrale"}</StatusBadge>}
      >
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-center py-10 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-red-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            {isRtl ? "بوابة الوزارة المركزية مهيأة" : "Tableau de Bord Centralisé Initialisé"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRtl
              ? "تم التحقق من نطاق الوصول الإداري المركزي. جاهز لاستقبال بيانات الخرائط الوبائية والمؤشرات المجمعة."
              : "Accès national sécurisé validé. Prêt pour l'intégration SIG épidémiologique et reporting consolidé."}
          </p>
        </div>
      </ClinicalCard>
    </div>
  );
}
