import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import MetricTile from '../../components/ui/MetricTile';
import ClinicalCard from '../../components/ui/ClinicalCard';
import ClinicalButton from '../../components/ui/ClinicalButton';

export default function VeterinarianDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Institutional Page Header */}
      <PageHeader
        category={t('roles.veterinarian')}
        badge="Poste d'inspection sanitaire"
        badgeVariant="dhis"
        title={t('nav.veterinarian')}
        subtitle="Saisie des déclarations de saisies sanitaires, suivi des prélèvements et notifications de suspicion en abattoir."
        actions={
          <Link to="/veterinarian/new-declaration">
            <ClinicalButton variant="primary" icon={PlusCircle}>
              {t('actions.newDeclaration')}
            </ClinicalButton>
          </Link>
        }
      />

      {/* Utilitarian Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label="Procès-verbaux saisis"
          value="12"
          subtext="Mois en cours (Abattoir Hussein Dey)"
          icon={FileText}
          variant="dhis"
        />
        <MetricTile
          label="Alertes prioritaires (MDO)"
          value="2"
          subtext="Échantillonnage de laboratoire requis"
          icon={AlertTriangle}
          variant="amber"
        />
        <MetricTile
          label="Dossiers validés (Wilaya)"
          value="10"
          subtext="Inspection de Wilaya d'Alger"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Active Worklist & Instructions Card */}
      <ClinicalCard
        title="Dossiers récents & Transmission Wilaya"
        subtitle="Statut d'acheminement des données sanitaires vers l'inspection de Wilaya"
        icon={Building2}
        action={
          <Link to="/veterinarian/new-declaration" className="btn-secondary h-7 text-[11px]">
            {t('actions.newDeclaration')}
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>N° PV</th>
                <th>Date</th>
                <th>Établissement</th>
                <th>Espèce</th>
                <th>Motif Principal</th>
                <th>Poids Saisi</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono font-bold text-dhis-800">PV-2026-0914</td>
                <td>18/09/2026</td>
                <td>Abattoir Hussein Dey</td>
                <td>BOVIN</td>
                <td>Hydatidose hépatique (1C)</td>
                <td className="font-mono">4.5 kg</td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold border rounded-sm bg-emerald-50 text-emerald-800 border-emerald-300">
                    Transmis
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-mono font-bold text-dhis-800">PV-2026-0912</td>
                <td>17/09/2026</td>
                <td>Abattoir Hussein Dey</td>
                <td>OVIN</td>
                <td>Suspicion Tuberculose (2C)</td>
                <td className="font-mono">18.2 kg</td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold border rounded-sm bg-amber-50 text-amber-800 border-amber-300">
                    En attente Wilaya
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-mono font-bold text-dhis-800">PV-2026-0909</td>
                <td>15/09/2026</td>
                <td>Abattoir Hussein Dey</td>
                <td>BOVIN</td>
                <td>Fasciolose hépatique (1C)</td>
                <td className="font-mono">3.8 kg</td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold border rounded-sm bg-emerald-50 text-emerald-800 border-emerald-300">
                    Validé
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ClinicalCard>
    </div>
  );
}