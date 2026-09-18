import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCog, User, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import MetricTile from '../../components/ui/MetricTile';
import { getCurrentUser } from '../../services/dbService';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  return (
    <div className="space-y-4">
      <PageHeader
        category={t('roles.admin')}
        badge="Administration Système"
        badgeVariant="neutral"
        title={t('nav.admin')}
        subtitle={
          isRtl
            ? "إدارة حسابات المستخدمين، تعيين الصلاحيات والأدوار، وإدارة قواميس النظام (الفصائل، الأمراض، الأعضاء)."
            : "Gestion des utilisateurs, des attributions de rôles et des dictionnaires de référence."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricTile
          label={isRtl ? "مدير النظام" : "Administrateur"}
          value={user?.fullName || "Admin Système"}
          subtext={user?.email || "admin@sante-animale.dz"}
          icon={User}
          variant="dhis"
        />
        <MetricTile
          label={isRtl ? "صلاحيات الأمان" : "Niveau de privilège"}
          value="SYSTEM_ADMIN"
          subtext="Contrôle total RBAC"
          icon={Shield}
          variant="amber"
        />
        <MetricTile
          label={isRtl ? "جداول المصادقة" : "Gestion des accès"}
          value="users & roles"
          subtext="Tables PostgreSQL dédiées"
          icon={KeyRound}
          variant="emerald"
        />
      </div>

      <ClinicalCard
        title={isRtl ? "إدارة المستخدمين والصلاحيات وقواميس النظام" : "Gestion des Utilisateurs & Référentiels"}
        subtitle={isRtl ? "إدارة قاعدة بيانات المستخدمين المعتمدين والمصالح البيطرية" : "Administration des comptes et paramétrage du référentiel sanitaire"}
        icon={UserCog}
        action={<StatusBadge variant="neutral" dot>{isRtl ? "أمان النظام" : "Sécurité RBAC"}</StatusBadge>}
      >
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-center py-10 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            {isRtl ? "لوحة إدارة النظام مهيأة" : "Tableau de Bord Administration Initialisé"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRtl
              ? "تم التحقق من صلاحيات المدير الفني. جاهز لإدارة المستخدمين، تعيين البياطرة للمذابح وإدارة القواميس."
              : "Accès sécurisé administrateur validé. Prêt pour la gestion des comptes et dictionnaires de référence."}
          </p>
        </div>
      </ClinicalCard>
    </div>
  );
}
