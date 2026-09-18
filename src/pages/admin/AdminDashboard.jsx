import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCog, Users, ShieldCheck, Database, KeyRound, UserPlus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import MetricTile from '../../components/ui/MetricTile';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ClinicalButton from '../../components/ui/ClinicalButton';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.admin')}
        badge="Administration Centrale"
        badgeVariant="neutral"
        title={t('nav.admin')}
        subtitle={
          isRtl
            ? 'إدارة حسابات المستخدمين، تعيين المفتشين بالمذابح الولائية، مراقبة اتصالات قاعدة البيانات وسجل العمليات.'
            : 'Gestion des accès, paramétrage des abattoirs communaux et supervision des connexions Supabase.'
        }
        actions={
          <ClinicalButton variant="primary" size="sm" icon={UserPlus}>
            {isRtl ? 'إضافة مستخدم جديد' : 'Nouvel utilisateur'}
          </ClinicalButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? 'الأطباء البياطرة المسجلون' : 'Vétérinaires inscrits'}
          value="1,890"
          subtext={isRtl ? 'ممارسون ومفتشون عموميون' : 'Comptes actifs'}
          icon={Users}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? 'مفتشيات الولايات' : 'Inspections de Wilaya'}
          value="58"
          subtext={isRtl ? 'تغطية وطنية شاملة' : '100% connectées'}
          icon={ShieldCheck}
          variant="emerald"
        />
        <MetricTile
          label={isRtl ? 'حالة قاعدة بيانات Supabase' : 'Service BaaS / Supabase'}
          value="Opérationnel"
          subtext="PostgreSQL & RLS actifs"
          icon={Database}
          variant="dhis"
        />
      </div>

      <ClinicalCard
        title={isRtl ? 'إدارة المستخدمين والصلاحيات' : 'Comptes utilisateurs récents'}
        subtitle={isRtl ? 'قائمة الحسابات النشطة في المنظومة' : 'Dernières attributions de rôles'}
        icon={UserCog}
      >
        <div className="overflow-x-auto">
          <table className="clinical-table">
            <thead>
              <tr>
                <th>Nom & Prénom</th>
                <th>Email</th>
                <th>Rôle Sanitaire</th>
                <th>Wilaya</th>
                <th>Établissement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Dr. Benali Mohamed</td>
                <td>m.benali@vet.dz</td>
                <td>Vétérinaire Inspecteur</td>
                <td>Alger (16)</td>
                <td>Abattoir Hussein Dey</td>
                <td><StatusBadge variant="success">Actif</StatusBadge></td>
              </tr>
              <tr>
                <td className="font-bold">Dr. Khelifi Samir</td>
                <td>s.khelifi@vet.dz</td>
                <td>Vétérinaire Inspecteur</td>
                <td>Alger (16)</td>
                <td>Abattoir El Harrach</td>
                <td><StatusBadge variant="success">Actif</StatusBadge></td>
              </tr>
              <tr>
                <td className="font-bold">Dr. Bouzid Amine</td>
                <td>a.bouzid@inspec.dz</td>
                <td>Inspecteur de Wilaya</td>
                <td>Sétif (19)</td>
                <td>Direction des Services Vétérinaires</td>
                <td><StatusBadge variant="success">Actif</StatusBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </ClinicalCard>
    </div>
  );
}