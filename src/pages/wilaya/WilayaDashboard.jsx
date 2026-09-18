import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, CheckSquare, Clock, AlertOctagon, Filter, Download } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import MetricTile from '../../components/ui/MetricTile';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ClinicalButton from '../../components/ui/ClinicalButton';

export default function WilayaDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.wilaya')}
        badge="Inspection Vétérinaire de Wilaya"
        badgeVariant="warning"
        title={t('nav.wilaya')}
        subtitle={
          isRtl
            ? 'مراجعة وتدقيق محاضر الحجز الصحي المرفوعة من المذابح، المصادقة على القرارات، وتنسيق التدابير الصحية والتحقيقات الوبائية.'
            : "Contrôle sanitaire et validation des déclarations de saisies transmises par les établissements d'abattage de la Wilaya."
        }
        actions={
          <div className="flex items-center gap-2">
            <ClinicalButton variant="secondary" size="sm" icon={Filter}>
              {isRtl ? 'تصفية المذابح' : 'Filtrer par abattoir'}
            </ClinicalButton>
            <ClinicalButton variant="secondary" size="sm" icon={Download}>
              {isRtl ? 'تصدير الكشف (Excel)' : 'Exporter (Excel)'}
            </ClinicalButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? 'في انتظار المصادقة' : 'Dossiers en attente'}
          value="7"
          subtext={isRtl ? 'تتطلب مراجعة الطبيب المفتش' : 'À valider par l’inspecteur'}
          icon={Clock}
          variant="amber"
        />
        <MetricTile
          label={isRtl ? 'محاضر تمت المصادقة عليها' : 'Dossiers validés'}
          value="48"
          subtext={isRtl ? 'خلال الشهر الجاري' : 'Mois en cours'}
          icon={CheckSquare}
          variant="emerald"
        />
        <MetricTile
          label={isRtl ? 'إنذارات وبائية (MDO)' : 'Alertes MDO prioritaires'}
          value="1"
          subtext={isRtl ? 'تحقيق وبائي مفتوح' : 'Suspicion sous séquestre'}
          icon={AlertOctagon}
          variant="red"
        />
      </div>

      <ClinicalCard
        title={isRtl ? 'سجل المحاضر الواردة من المذابح' : "Registre des réceptions d'abattoir"}
        subtitle={isRtl ? 'قائمة الفحص والمصادقة الصحية' : 'File d’attente des dossiers sanitaires'}
        icon={Building2}
      >
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>N° Réf</th>
                <th>Abattoir</th>
                <th>Commune</th>
                <th>Date Réception</th>
                <th>Vétérinaire Déclarant</th>
                <th>Motifs Constatés</th>
                <th>Poids Saisi</th>
                <th>Priorité</th>
                <th>Décision</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono font-bold text-dhis-800">W16-2026-089</td>
                <td>Abattoir Communal Hussein Dey</td>
                <td>Hussein Dey</td>
                <td>18/09/2026 09:30</td>
                <td>Dr. Benali M.</td>
                <td>Hydatidose hépatique (1C)</td>
                <td className="font-mono">4.5 kg</td>
                <td>
                  <StatusBadge variant="neutral">Ordinaire</StatusBadge>
                </td>
                <td>
                  <StatusBadge variant="warning" dot>En attente</StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="font-mono font-bold text-dhis-800">W16-2026-088</td>
                <td>Abattoir d'El Harrach</td>
                <td>El Harrach</td>
                <td>18/09/2026 08:15</td>
                <td>Dr. Khelifi S.</td>
                <td>Tuberculose bovine (2C - MDO)</td>
                <td className="font-mono">180.0 kg</td>
                <td>
                  <StatusBadge variant="danger" dot>URGENT MDO</StatusBadge>
                </td>
                <td>
                  <StatusBadge variant="danger">Enquête requise</StatusBadge>
                </td>
              </tr>
              <tr>
                <td className="font-mono font-bold text-dhis-800">W16-2026-087</td>
                <td>Tuerie Municipale Rouiba</td>
                <td>Rouiba</td>
                <td>17/09/2026 14:00</td>
                <td>Dr. Mansouri F.</td>
                <td>Fasciolose hépatique (1C)</td>
                <td className="font-mono">8.2 kg</td>
                <td>
                  <StatusBadge variant="neutral">Ordinaire</StatusBadge>
                </td>
                <td>
                  <StatusBadge variant="success">Validé</StatusBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ClinicalCard>
    </div>
  );
}