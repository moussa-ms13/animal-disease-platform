import React from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, MapPin, Activity, Download, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import MetricTile from '../../components/ui/MetricTile';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ClinicalButton from '../../components/ui/ClinicalButton';

export default function MinistryDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.ministry')}
        badge="Direction des Services Vétérinaires (Centrale)"
        badgeVariant="danger"
        title={t('nav.ministry')}
        subtitle={
          isRtl
            ? 'الرصد الوبائي البيطري الوطني، متابعة معدلات الحجز الصحي بالمذابح، الخريطة الوبائية للولايات وإصدار الإنذارات الصحية المركزية.'
            : 'Agrégation nationale des données sanitaires d’abattoir, veille épidémiologique et gestion des foyers d’alerte.'
        }
        actions={
          <div className="flex items-center gap-2">
            <ClinicalButton variant="secondary" size="sm" icon={Download}>
              {t('actions.exportPDF')}
            </ClinicalButton>
            <ClinicalButton variant="secondary" size="sm" icon={FileSpreadsheet}>
              {t('actions.exportExcel')}
            </ClinicalButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile
          label={isRtl ? 'إجمالي محاضر الفحص الوطنية' : 'Procès-verbaux nationaux'}
          value="1,248"
          subtext={isRtl ? 'منذ بداية السنة' : 'Exercice en cours'}
          icon={Activity}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? 'ولايات تحت المراقبة المكثفة' : 'Wilayas sous surveillance'}
          value="14"
          subtext={isRtl ? 'بؤر محتملة مسجلة' : 'Seuils d’alerte dépassés'}
          icon={ShieldAlert}
          variant="red"
        />
        <MetricTile
          label={isRtl ? 'بؤر تمت السيطرة عليها' : 'Foyers circonscrits'}
          value="29"
          subtext={isRtl ? 'تدخلات بيطرية ناجزة' : 'Mesures sanitaires prises'}
          icon={Landmark}
          variant="emerald"
        />
        <MetricTile
          label={isRtl ? 'نسبة الإخطار الإلكتروني' : 'Taux de notification'}
          value="94.2%"
          subtext={isRtl ? 'ربط إلكتروني مباشر' : 'Mise à jour sous 24h'}
          icon={Activity}
          variant="dhis"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Epidemic GIS / Spatial Map Placeholder Card */}
        <ClinicalCard
          title={isRtl ? 'الخريطة الوبائية الوطنية (SIG)' : 'Système d’Information Géographique (SIG)'}
          subtitle={isRtl ? 'توزيع بؤر الحجز الصحي حسب الولايات' : 'Cartographie des saisies par Wilaya'}
          icon={MapPin}
          className="lg:col-span-2"
        >
          <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-sm">
            <MapPin className="w-8 h-8 text-dhis-700 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">
              {isRtl ? 'نظام الإسقاط الجغرافي الوبائي' : 'Module de Cartographie Épidémiologique'}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
              {isRtl
                ? 'عرض تفاعلي مباشر لكثافة الحجوزات البيطرية (داء المشوكات، السل البقري) حسب البلديات والمذابح.'
                : 'Projection spatiale des taux d’incidence par Wilaya et abattoir communal.'}
            </p>
          </div>
        </ClinicalCard>

        {/* National Alerts Feed */}
        <ClinicalCard
          title={isRtl ? 'آخر إخطارات MDO العاجلة' : 'Dernières alertes MDO'}
          subtitle={isRtl ? 'إشعارات التدخل العاجل' : 'Flux d’urgence sanitaire'}
          icon={ShieldAlert}
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-2 border border-red-200 bg-red-50 rounded-sm">
              <div className="flex items-center justify-between font-bold text-red-900">
                <span>Wilaya d'Alger</span>
                <StatusBadge variant="danger">Tuberculose</StatusBadge>
              </div>
              <p className="text-[11px] text-red-800 mt-1">
                Suspicion saisie totale bovine à Hussein Dey. Échantillon acheminé au laboratoire central.
              </p>
            </div>

            <div className="p-2 border border-amber-200 bg-amber-50 rounded-sm">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Wilaya de Sétif</span>
                <StatusBadge variant="warning">Hydatidose</StatusBadge>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Hausse des saisies d'abattoir ovines (taux supérieur à 8%).
              </p>
            </div>
          </div>
        </ClinicalCard>
      </div>
    </div>
  );
}