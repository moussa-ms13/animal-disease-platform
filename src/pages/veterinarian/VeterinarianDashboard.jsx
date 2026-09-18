import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stethoscope,
  ClipboardList,
  Plus,
  FileSpreadsheet,
  Trash2,
  Eye,
  AlertTriangle,
  Search,
  X,
  CheckCircle2,
  RefreshCw,
  FileText,
  ShieldAlert,
  Pencil,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import {
  getCurrentUser,
  fetchReports,
  createInspectionReport,
  updateInspectionReport,
  deleteReport,
  fetchDictionaries,
  fetchSlaughterhouses,
} from '../../services/dbService';

export default function VeterinarianDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = getCurrentUser();

  // --------------------------------------------------------------------------
  // 1. DATA STATE & REFERENCE DICTIONARIES
  // --------------------------------------------------------------------------
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Reference dictionaries for modal dropdowns
  const [dictionaries, setDictionaries] = useState({
    species: [],
    diseases: [],
    organs: [],
    slaughterhouses: [],
  });

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReportId, setEditingReportId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Report Form State
  const initialFormState = {
    inspectionDate: new Date().toISOString().split('T')[0],
    slaughterhouseId: user?.slaughterhouseId || 'ab-1',
    slaughterhouseName: user?.slaughterhouseName || 'Abattoir Communal Hussein Dey',
    status: 'DRAFT',
    isUrgentMdo: false,
    clinicalNotes: '',
    validationRemarks: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Dynamic Seizure Items rows
  const [seizureRows, setSeizureRows] = useState([
    {
      id: 'row-1',
      speciesId: 'sp-1',
      diseaseId: 'ds-1',
      organId: 'og-1',
      severity: '1C',
      quantity: 1,
      weight: 4.5,
    },
  ]);

  // Session metadata for official PV ribbon
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

  // --------------------------------------------------------------------------
  // 2. DATA FETCHING
  // --------------------------------------------------------------------------
  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { reports: data } = await fetchReports();
      setReports(data || []);

      const [dictData, abattoirs] = await Promise.all([
        fetchDictionaries(),
        fetchSlaughterhouses(),
      ]);

      setDictionaries({
        species: dictData.species || [],
        diseases: dictData.diseases || [],
        organs: dictData.organs || [],
        slaughterhouses: abattoirs || [],
      });
    } catch (err) {
      console.error('[VeterinarianDashboard] Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --------------------------------------------------------------------------
  // 3. FILTERING & SEARCH
  // --------------------------------------------------------------------------
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (statusFilter === 'MDO') {
        if (!rep.is_urgent_mdo) return false;
      } else if (statusFilter !== 'ALL' && rep.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const refNo = (rep.reference_no || rep.id || '').toLowerCase();
        const abattoir = (
          rep.slaughterhouse_name ||
          rep.slaughterhouses?.name_fr ||
          ''
        ).toLowerCase();
        const date = (rep.inspection_date || '').toLowerCase();
        if (
          !refNo.includes(query) &&
          !abattoir.includes(query) &&
          !date.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [reports, statusFilter, searchQuery]);

  // --------------------------------------------------------------------------
  // 4. EXPORT TO EXCEL / CSV
  // --------------------------------------------------------------------------
  const handleExportExcel = () => {
    if (filteredReports.length === 0) {
      triggerToast(
        isRtl ? 'لا توجد بيانات متاحة للتصدير' : 'Aucune donnée à exporter.'
      );
      return;
    }

    const headers = [
      'N° Référence',
      "Date d'inspection",
      'Établissement / Abattoir',
      'Statut',
      'Alerte MDO',
      'Nombre de lésions',
      'Poids total saisi (kg)',
      'Observations / Notes cliniques',
      'Avis de validation (Wilaya)',
    ];

    const rows = filteredReports.map((r) => {
      const refNo = r.reference_no || `PV-${r.id?.slice(0, 8)}`;
      const date = r.inspection_date || '';
      const abattoir = `"${(
        r.slaughterhouse_name ||
        r.slaughterhouses?.name_fr ||
        'Abattoir Communal'
      ).replace(/"/g, '""')}"`;
      const status = r.status || 'DRAFT';
      const mdo = r.is_urgent_mdo ? 'OUI - ALERTE MDO' : 'NON';
      const count =
        r.findings_count || (r.seizure_items ? r.seizure_items.length : 0);
      const weight =
        r.total_weight ||
        (r.seizure_items
          ? r.seizure_items.reduce(
              (acc, it) => acc + (Number(it.total_weight || it.weight) || 0),
              0
            )
          : '0.0');
      const notes = `"${(r.clinical_notes || '').replace(/"/g, '""')}"`;
      const validation = `"${(r.validation_remarks || '').replace(/"/g, '""')}"`;

      return [refNo, date, abattoir, status, mdo, count, weight, notes, validation].join(';');
    });

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Registre_PV_Abattoir_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(
      isRtl
        ? 'تم تحميل سجل المحاضر بنجاح بصيغة Excel / CSV'
        : 'Saisies exportées avec succès (format Excel / CSV).'
    );
  };

  // --------------------------------------------------------------------------
  // 5. SEIZURE FORM ROW HANDLERS
  // --------------------------------------------------------------------------
  const handleAddSeizureRow = () => {
    setSeizureRows((prev) => [
      ...prev,
      {
        id: 'row-' + Date.now(),
        speciesId: dictionaries.species[0]?.id || 'sp-1',
        diseaseId: dictionaries.diseases[0]?.id || 'ds-1',
        organId: dictionaries.organs[0]?.id || 'og-1',
        severity: '1C',
        quantity: 1,
        weight: 1.0,
      },
    ]);
  };

  const handleRemoveSeizureRow = (rowId) => {
    if (seizureRows.length === 1) {
      triggerToast(
        isRtl
          ? 'يجب تسجيل سطر حجز واحد على الأقل في المحضر'
          : 'Au moins une ligne de saisie est requise.'
      );
      return;
    }
    setSeizureRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleUpdateSeizureRow = (rowId, field, value) => {
    setSeizureRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );
  };

  // --------------------------------------------------------------------------
  // 6. EDITING REPORT MODAL TRIGGER
  // --------------------------------------------------------------------------
  const handleOpenEditModal = (repToEdit) => {
    const report = repToEdit || selectedReport;
    if (!report) return;

    if (report.status !== 'DRAFT') {
      triggerToast(
        isRtl
          ? 'لا يمكن تعديل المحضر إلا إذا كان في حالة مسودة (DRAFT)'
          : 'Seuls les procès-verbaux en état BROUILLON (DRAFT) peuvent être modifiés.'
      );
      return;
    }

    setEditingReportId(report.id);
    setFormData({
      inspectionDate: report.inspection_date || new Date().toISOString().split('T')[0],
      slaughterhouseId: report.slaughterhouse_id || 'ab-1',
      slaughterhouseName:
        report.slaughterhouse_name ||
        report.slaughterhouses?.name_fr ||
        'Abattoir Communal Hussein Dey',
      status: report.status || 'DRAFT',
      isUrgentMdo: Boolean(report.is_urgent_mdo),
      clinicalNotes: report.clinical_notes || '',
      validationRemarks: report.validation_remarks || '',
    });

    // Populate seizure rows from report's seizure_items
    if (report.seizure_items && report.seizure_items.length > 0) {
      const rows = report.seizure_items.map((it, idx) => {
        // Resolve species ID
        let spId = it.species_id;
        if (!spId && it.species) {
          const matchedSp = dictionaries.species.find(
            (s) =>
              s.code === it.species.code ||
              s.name_fr?.toLowerCase() === it.species.name_fr?.toLowerCase()
          );
          spId = matchedSp?.id;
        }

        // Resolve disease ID
        let dsId = it.disease_id;
        if (!dsId && it.diseases) {
          const matchedDs = dictionaries.diseases.find(
            (d) =>
              d.code === it.diseases.code ||
              d.name_fr?.toLowerCase() === it.diseases.name_fr?.toLowerCase()
          );
          dsId = matchedDs?.id;
        }

        // Resolve organ ID
        let ogId = it.organ_id;
        if (!ogId && it.organs) {
          const matchedOg = dictionaries.organs.find(
            (o) =>
              o.code === it.organs.code ||
              o.name_fr?.toLowerCase() === it.organs.name_fr?.toLowerCase()
          );
          ogId = matchedOg?.id;
        }

        return {
          id: 'row-edit-' + idx + '-' + Date.now(),
          speciesId: spId || dictionaries.species[0]?.id || 'sp-1',
          diseaseId: dsId || dictionaries.diseases[0]?.id || 'ds-1',
          organId: ogId || dictionaries.organs[0]?.id || 'og-1',
          severity: it.severity || '1C',
          quantity: Number(it.total_quantity || it.quantity) || 1,
          weight: Number(it.total_weight || it.weight) || 1.0,
        };
      });
      setSeizureRows(rows);
    } else {
      setSeizureRows([
        {
          id: 'row-1',
          speciesId: dictionaries.species[0]?.id || 'sp-1',
          diseaseId: dictionaries.diseases[0]?.id || 'ds-1',
          organId: dictionaries.organs[0]?.id || 'og-1',
          severity: '1C',
          quantity: 1,
          weight: 4.5,
        },
      ]);
    }

    // Close view modal and open edit form
    setIsViewModalOpen(false);
    setIsCreateModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // 7. FORM SUBMISSION (CREATE OR UPDATE)
  // --------------------------------------------------------------------------
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const abattoirObj = dictionaries.slaughterhouses.find(
        (a) => a.id === formData.slaughterhouseId
      );

      const reportPayload = {
        inspectionDate: formData.inspectionDate,
        slaughterhouseId: formData.slaughterhouseId,
        slaughterhouseName:
          abattoirObj?.name_fr || formData.slaughterhouseName,
        inspectorId: user?.id || 'usr-vet-1',
        inspectorName: user?.fullName || 'Dr. Mohamed Benali',
        status: formData.status,
        isUrgentMdo: formData.isUrgentMdo,
        clinicalNotes: formData.clinicalNotes,
        validationRemarks: formData.validationRemarks,
      };

      const preparedSeizureItems = seizureRows.map((row) => {
        const spec = dictionaries.species.find((s) => s.id === row.speciesId);
        const dis = dictionaries.diseases.find((d) => d.id === row.diseaseId);
        const org = dictionaries.organs.find((o) => o.id === row.organId);
        return {
          speciesId: row.speciesId,
          speciesName: spec?.name_fr || 'Bovin',
          speciesCode: spec?.code || 'BOVIN',
          diseaseId: row.diseaseId,
          diseaseName: dis?.name_fr || 'Hydatidose',
          diseaseCode: dis?.code || 'HYDAT',
          isMdo: dis?.is_mdo || false,
          organId: row.organId,
          organName: org?.name_fr || 'Foie',
          organCode: org?.code || 'FOIE',
          severity: row.severity,
          quantity: Number(row.quantity) || 1,
          weight: Number(row.weight) || 0.0,
        };
      });

      if (editingReportId) {
        // UPDATE EXISTING REPORT
        const { report: updated, error } = await updateInspectionReport(
          editingReportId,
          reportPayload,
          preparedSeizureItems
        );

        if (error) throw new Error(error);

        setReports((prev) =>
          prev.map((r) => (r.id === editingReportId ? { ...r, ...updated } : r))
        );

        triggerToast(
          isRtl
            ? 'تم تعديل محضر التفتيش الصحي بنجاح'
            : 'Procès-verbal mis à jour avec succès.'
        );
      } else {
        // CREATE NEW REPORT
        const { report: created, error } = await createInspectionReport(
          reportPayload,
          preparedSeizureItems
        );

        if (error) throw new Error(error);

        setReports((prev) => [created, ...prev]);

        triggerToast(
          isRtl
            ? 'تم تسجيل محضر التفتيش الصحي بنجاح'
            : 'Procès-verbal d\'inspection enregistré avec succès.'
        );
      }

      setIsCreateModalOpen(false);
      setEditingReportId(null);
      setFormData(initialFormState);
      setSeizureRows([
        {
          id: 'row-1',
          speciesId: dictionaries.species[0]?.id || 'sp-1',
          diseaseId: dictionaries.diseases[0]?.id || 'ds-1',
          organId: dictionaries.organs[0]?.id || 'og-1',
          severity: '1C',
          quantity: 1,
          weight: 4.5,
        },
      ]);
    } catch (err) {
      console.error('[VeterinarianDashboard] Submit error:', err);
      triggerToast(
        isRtl
          ? 'حدث خطأ أثناء حفظ المحضر'
          : `Erreur: ${err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // 8. DELETE REPORT
  // --------------------------------------------------------------------------
  const handleDeleteReport = async (reportId) => {
    const confirmMsg = isRtl
      ? 'هل أنت متأكد من حذف هذا المحضر؟'
      : 'Confirmez-vous la suppression de ce procès-verbal ?';
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      triggerToast(
        isRtl
          ? 'تم حذف المحضر بنجاح'
          : 'Procès-verbal supprimé du registre.'
      );
    } catch (err) {
      console.error('[VeterinarianDashboard] Delete error:', err);
      triggerToast(
        isRtl ? 'فشل حذف المحضر' : 'Échec de la suppression du rapport.'
      );
    }
  };

  // Helper for total weights in dynamic table
  const modalTotalWeight = useMemo(() => {
    return seizureRows
      .reduce((sum, r) => sum + (Number(r.weight) || 0), 0)
      .toFixed(1);
  }, [seizureRows]);

  const modalTotalQty = useMemo(() => {
    return seizureRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  }, [seizureRows]);

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 end-4 z-50 bg-[#0c4a6e] text-white text-xs px-4 py-3 rounded-sm shadow-lg border border-[#08334c] flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      

      {/* =========================================================================
          CLINICAL INSPECTION SESSION HEADER (Strict PV Administrative Metadata)
         ========================================================================= */}
      <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
        {/* PV Top Ribbon */}
        <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono border-s-4 border-s-[#0c4a6e]">
          <div className="flex items-center gap-2 text-slate-700">
            <ClipboardList className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
              {isRtl
                ? 'محضر الفحص والتفتيش البيطري — نموذج رسمي رقمي'
                : "PV D'INSPECTION SANITAIRE ET VÉTÉRINAIRE — SESSION EN COURS"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[10px]">
            <span>
              REF :{' '}
              <strong className="text-slate-800 font-mono font-bold">
                {sessionRef}
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">
              REG :{' '}
              <strong className="text-slate-700 font-mono">
                DSV-MDO-2026
              </strong>
            </span>
          </div>
        </div>

        {/* 4-Column Utilitarian Key-Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 rtl:divide-x-reverse bg-white">
          {/* Cell 1: Médecin Inspecteur */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? 'الطبيب المفتش المسؤول' : 'MÉDECIN INSPECTEUR'}
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate">
              {user?.fullName ||
                (isRtl ? 'د. محمد بن علي' : 'Dr. Mohamed Benali')}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {user?.email || 'inspecteur.vet@sante-animale.dz'}
            </span>
          </div>

          {/* Cell 2: Établissement d'abattage */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? 'المذبح / المنشأة المعتمدة' : "ÉTABLISSEMENT D'ABATTAGE"}
            </span>
            <span className="text-sm font-semibold text-slate-900 truncate">
              {user?.slaughterhouseName ||
                (isRtl
                  ? 'مذبح بلدي حسين داي'
                  : 'Abattoir Communal Hussein Dey')}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {user?.wilayaName ||
                (isRtl ? 'ولاية الجزائر (الرمز 16)' : "Wilaya d'Alger (Code 16)")}
            </span>
          </div>

          {/* Cell 3: Date d'inspection */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? 'تاريخ المراقبة الصحية' : "DATE D'INSPECTION"}
            </span>
            <span className="text-sm font-semibold text-slate-900 font-mono">
              {sessionDate}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {isRtl
                ? 'فترة الفحص الصباحي (06:00 - 14:00)'
                : 'VACATION MATINALE (06:00 - 14:00)'}
            </span>
          </div>

          {/* Cell 4: Statut Session */}
          <div className="p-3.5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
              {isRtl ? 'حالة الجلسة' : 'STATUT SESSION'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                {isRtl ? 'جلسة نشطة' : 'ACTIVE'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              {isRtl ? 'تسجيل مباشر للمحاضر' : 'SAISIE SANITAIRE EN DIRECT'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROBUST CLINICAL DATAGRID TABLE (PVs & Seizure Reports)
         ========================================================================= */}
      <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title & Count Badge */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isRtl
                ? 'سجل محاضر التفتيش الصحي اليومي'
                : "REGISTRE DES PROCÈS-VERBAUX D'INSPECTION (PV)"}
            </span>
            <span className="text-[10px] font-mono font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm border border-slate-300">
              {filteredReports.length}{' '}
              {isRtl ? 'محاضر' : 'PVs'}
            </span>
          </div>

          {/* Filter, Search & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute start-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'بحث برقم المحضر أو التاريخ...' : 'Recherche réf, abattoir...'}
                className="ps-7 pe-2.5 py-1 text-xs rounded-sm border border-slate-300 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none bg-white font-mono placeholder:text-slate-400 w-36 sm:w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1 px-2 rounded-sm border border-slate-300 bg-white font-mono text-slate-700 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none"
            >
              <option value="ALL">{isRtl ? 'جميع الحالات' : 'Tous statuts'}</option>
              <option value="DRAFT">{isRtl ? 'مسودة (DRAFT)' : 'Brouillons (DRAFT)'}</option>
              <option value="SUBMITTED_TO_WILAYA">
                {isRtl ? 'مرسل للولاية' : 'Transmis Wilaya'}
              </option>
              <option value="VALIDATED">{isRtl ? 'معتمد' : 'Validés'}</option>
              <option value="MDO">{isRtl ? 'تنبيه MDO فقط' : 'Urgence MDO'}</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              title={isRtl ? 'تحديث' : 'Actualiser'}
              className="p-1.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>

            {/* Export Excel Button */}
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isRtl ? 'تصدير Excel' : 'Export Excel'}</span>
            </button>

            {/* Add Report Button */}
            <button
              onClick={() => {
                setEditingReportId(null);
                setFormData(initialFormState);
                setSeizureRows([
                  {
                    id: 'row-1',
                    speciesId: dictionaries.species[0]?.id || 'sp-1',
                    diseaseId: dictionaries.diseases[0]?.id || 'ds-1',
                    organId: dictionaries.organs[0]?.id || 'og-1',
                    severity: '1C',
                    quantity: 1,
                    weight: 4.5,
                  },
                ]);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-[#0c4a6e] hover:bg-[#072c41] text-white text-xs font-semibold tracking-wide cursor-pointer border border-[#09354f] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة محضر جديد' : 'Ajouter un rapport (PV)'}</span>
            </button>
          </div>
        </div>

        {/* Dense Clinical Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 text-start">{isRtl ? 'رقم المحضر' : 'N° Référence'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'تاريخ التفتيش' : 'Date'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'المذبح / المنشأة' : 'Établissement / Abattoir'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'الحالة' : 'Statut'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'إنذار MDO' : 'Alerte MDO'}</th>
                <th className="py-2.5 px-3 text-start">{isRtl ? 'الحجوزات (كغ)' : 'Saisies / Poids'}</th>
                <th className="py-2.5 px-3 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                    {isRtl ? 'جاري تحميل سجل المحاضر...' : 'Chargement des procès-verbaux...'}
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <ClipboardList className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <p className="font-semibold text-xs text-slate-700">
                      {isRtl ? 'لا توجد محاضر مطابقة' : 'Aucun procès-verbal trouvé.'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isRtl
                        ? 'انقر على "إضافة محضر جديد" لتسجيل أول محضر تفتيش صحي.'
                        : 'Cliquez sur "Ajouter un rapport (PV)" pour enregistrer une saisie.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => {
                  const refNo =
                    rep.reference_no ||
                    `PV-16-${rep.inspection_date?.replace(/-/g, '') || '2026'}-${rep.id?.slice(-3) || '001'}`.toUpperCase();
                  const abattoirName =
                    rep.slaughterhouse_name ||
                    rep.slaughterhouses?.name_fr ||
                    'Abattoir Communal Hussein Dey';
                  const weightTotal =
                    rep.total_weight ||
                    (rep.seizure_items
                      ? rep.seizure_items
                          .reduce((s, it) => s + (Number(it.total_weight || it.weight) || 0), 0)
                          .toFixed(1)
                      : '0.0');
                  const countFindings =
                    rep.findings_count ||
                    (rep.seizure_items ? rep.seizure_items.length : 0);

                  return (
                    <tr
                      key={rep.id}
                      className="hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                    >
                      {/* N° Référence */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {refNo}
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {rep.inspection_date || '—'}
                      </td>

                      {/* Établissement */}
                      <td className="py-2.5 px-3 text-slate-800 font-medium">
                        <div className="truncate max-w-xs">{abattoirName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {rep.commune_name || rep.slaughterhouses?.communes?.name_fr || 'Alger (16)'}
                        </div>
                      </td>

                      {/* Statut Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {rep.status === 'VALIDATED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            {isRtl ? 'معتمد' : 'VALIDÉ'}
                          </span>
                        )}
                        {rep.status === 'SUBMITTED_TO_WILAYA' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            {isRtl ? 'مرسل للولاية' : 'TRANSMIS WILAYA'}
                          </span>
                        )}
                        {rep.status === 'DRAFT' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            {isRtl ? 'مسودة' : 'BROUILLON'}
                          </span>
                        )}
                        {rep.status === 'RETURNED_FOR_CORRECTION' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            {isRtl ? 'مرفوض للتصحيح' : 'À CORRIGER'}
                          </span>
                        )}
                      </td>

                      {/* Alerte MDO */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {rep.is_urgent_mdo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                            <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                            ALERTE MDO
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Saisies & Poids */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-700">
                        <span dir="ltr" className="font-bold text-slate-900 font-mono inline-block">{weightTotal} kg</span>
                        <span className="text-slate-400 text-[10px] ms-1.5">
                          ({countFindings} {isRtl ? 'آفة' : 'lésion(s)'})
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Direct Button (if DRAFT) */}
                          {rep.status === 'DRAFT' && (
                            <button
                              onClick={() => handleOpenEditModal(rep)}
                              title={isRtl ? 'تعديل المحضر' : 'Modifier le PV'}
                              className="p-1 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-blue-700" />
                            </button>
                          )}

                          {/* View PV Details Button */}
                          <button
                            onClick={() => {
                              setSelectedReport(rep);
                              setIsViewModalOpen(true);
                            }}
                            title={isRtl ? 'عرض تفاصيل المحضر' : 'Consulter le PV'}
                            className="p-1 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReport(rep.id)}
                            title={isRtl ? 'حذف المحضر' : 'Supprimer'}
                            className="p-1 rounded-sm border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            {isRtl
              ? `إجمالي المحاضر المسجلة: ${filteredReports.length}`
              : `Total PVs affichés: ${filteredReports.length}`}
          </span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>
              TOTAL SAISIES :{' '}
              <strong className="text-slate-900">
                {filteredReports
                  .reduce(
                    (sum, r) =>
                      sum +
                      Number(
                        r.total_weight ||
                          (r.seizure_items
                            ? r.seizure_items.reduce(
                                (s, it) => s + (Number(it.total_weight || it.weight) || 0),
                                0
                              )
                            : 0)
                      ),
                    0
                  )
                  .toFixed(1)}{' '}
                kg
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: VIEW / CONSULTER DÉTAILS DU PV (WITH SEIZURE ITEMS & EDIT ACTION)
         ========================================================================= */}
      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-none">
          <div className="bg-white border border-slate-300 rounded-sm shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0c4a6e]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    {selectedReport.reference_no || `PV-${selectedReport.id?.slice(0, 8)}`}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {isRtl
                      ? 'محضر الفحص والتفتيش الصحي البيطري — النسخة الرقمية'
                      : 'Procès-Verbal d\'Inspection Sanitaire et Vétérinaire'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Top Key-Value Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-sm font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    {isRtl ? 'التاريخ' : 'Date Inspection'}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedReport.inspection_date || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    {isRtl ? 'الحالة' : 'Statut'}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedReport.status === 'VALIDATED' && (
                      <span className="text-emerald-700 font-bold">VALIDÉ</span>
                    )}
                    {selectedReport.status === 'SUBMITTED_TO_WILAYA' && (
                      <span className="text-blue-700 font-bold">TRANSMIS WILAYA</span>
                    )}
                    {selectedReport.status === 'DRAFT' && (
                      <span className="text-slate-700 font-bold">BROUILLON</span>
                    )}
                    {selectedReport.status === 'RETURNED_FOR_CORRECTION' && (
                      <span className="text-amber-700 font-bold">À CORRIGER</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    {isRtl ? 'إنذار MDO' : 'Alerte MDO'}
                  </span>
                  <span className="font-semibold">
                    {selectedReport.is_urgent_mdo ? (
                      <span className="text-red-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        OUI (Urgence DSV)
                      </span>
                    ) : (
                      <span className="text-slate-500">Non</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">
                    {isRtl ? 'الوزن الإجمالي' : 'Poids Total Saisi'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedReport.total_weight ||
                      (selectedReport.seizure_items
                        ? selectedReport.seizure_items
                            .reduce((s, it) => s + (Number(it.total_weight || it.weight) || 0), 0)
                            .toFixed(1)
                        : '0.0')}{' '}
                    kg
                  </span>
                </div>
              </div>

              {/* Établissement & Inspecteur metadata block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-slate-200 rounded-sm bg-white">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                    {isRtl ? 'المذبح / المنشأة' : "Établissement d'abattage"}
                  </span>
                  <p className="font-bold text-slate-900">
                    {selectedReport.slaughterhouse_name ||
                      selectedReport.slaughterhouses?.name_fr ||
                      'Abattoir Communal Hussein Dey'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {selectedReport.commune_name ||
                      selectedReport.slaughterhouses?.communes?.name_fr ||
                      'Alger (Code 16)'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                    {isRtl ? 'الطبيب البيطري المفتش' : 'Praticien Inspecteur'}
                  </span>
                  <p className="font-bold text-slate-900">
                    {selectedReport.inspector_name ||
                      selectedReport.inspector?.full_name ||
                      user?.fullName ||
                      'Dr. Mohamed Benali'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {selectedReport.inspector?.email || user?.email || 'vet@sante-animale.dz'}
                  </p>
                </div>
              </div>

              {/* Seizure Items Detailed Sub-Table */}
              <div className="border border-slate-300 rounded-sm overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    {isRtl
                      ? 'تفاصيل الآفات والحجوزات الصحية المسجلة'
                      : 'RELEVÉ DÉTAILLÉ DES SAISIES SANITAIRES'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {(selectedReport.seizure_items?.length || 0)}{' '}
                    {isRtl ? 'سطور مسجلة' : 'ligne(s)'}
                  </span>
                </div>

                {selectedReport.seizure_items && selectedReport.seizure_items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-bold">
                          <th className="py-2 px-2.5 text-start">{isRtl ? 'النوع' : 'Espèce'}</th>
                          <th className="py-2 px-2.5 text-start">{isRtl ? 'المرض / الآفة' : 'Maladie / Lésion'}</th>
                          <th className="py-2 px-2.5 text-start">{isRtl ? 'العضو المصاب' : 'Organe'}</th>
                          <th className="py-2 px-2.5 text-start">{isRtl ? 'قرار الحجز' : 'Décision / Sévérité'}</th>
                          <th className="py-2 px-2.5 text-end">{isRtl ? 'العدد (قطع)' : 'Quantité (Pièces)'}</th>
                          <th className="py-2 px-2.5 text-end">{isRtl ? 'الوزن (كغ)' : 'Poids (kg)'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono bg-white">
                        {selectedReport.seizure_items.map((it, idx) => {
                          const speciesName =
                            it.species?.name_fr || it.species_name || 'Bovin';
                          const diseaseName =
                            it.diseases?.name_fr || it.disease_name || 'Hydatidose';
                          const isMdo = Boolean(it.diseases?.is_mdo || it.is_mdo);
                          const organName =
                            it.organs?.name_fr || it.organ_name || 'Foie';
                          const severityCode = it.severity || '1C';
                          const qty = it.total_quantity || it.quantity || 1;
                          const weight = Number(it.total_weight || it.weight || 0).toFixed(1);

                          return (
                            <tr key={it.id || idx} className="hover:bg-slate-50">
                              {/* Espèce */}
                              <td className="py-2 px-2.5 font-sans font-medium text-slate-900">
                                {speciesName}
                              </td>

                              {/* Maladie */}
                              <td className="py-2 px-2.5 font-sans">
                                <span className="font-semibold text-slate-900">{diseaseName}</span>
                                {isMdo && (
                                  <span className="ms-1.5 px-1 py-0.2 rounded-sm text-[9px] font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                                    MDO
                                  </span>
                                )}
                              </td>

                              {/* Organe */}
                              <td className="py-2 px-2.5 font-sans text-slate-700">
                                {organName}
                              </td>

                              {/* Sévérité */}
                              <td className="py-2 px-2.5 whitespace-nowrap">
                                {severityCode === '2C' ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-red-50 text-red-800 border border-red-200">
                                    2C (Saisie totale)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    1C (Saisie partielle)
                                  </span>
                                )}
                              </td>

                              {/* Quantité */}
                              <td className="py-2 px-2.5 text-end font-bold text-slate-800">
                                {qty}
                              </td>

                              {/* Poids */}
                              <td className="py-2 px-2.5 text-end font-bold text-slate-900">
                                {weight} kg
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    {isRtl
                      ? 'لا توجد بيانات تفصيلية للحجوزات لهذا المحضر.'
                      : 'Aucune saisie détaillée associée à ce procès-verbal.'}
                  </div>
                )}

                {/* Sub-Table Footer */}
                {selectedReport.seizure_items && selectedReport.seizure_items.length > 0 && (
                  <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 text-[10px] font-mono text-slate-700 flex justify-between items-center">
                    <span>
                      TOTAL PIÈCES :{' '}
                      <strong>
                        {selectedReport.seizure_items.reduce(
                          (sum, it) => sum + (Number(it.total_quantity || it.quantity) || 0),
                          0
                        )}
                      </strong>
                    </span>
                    <span>
                      POIDS TOTAL SAISI :{' '}
                      <strong className="text-slate-900 text-[11px]">
                        {selectedReport.seizure_items
                          .reduce(
                            (sum, it) => sum + (Number(it.total_weight || it.weight) || 0),
                            0
                          )
                          .toFixed(1)}{' '}
                        kg
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Observations & Clinical Notes */}
              {selectedReport.clinical_notes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    {isRtl ? 'الملاحظات والنتائج العيانية' : 'Observations cliniques / Ante & Post-Mortem'}
                  </span>
                  <p className="font-mono text-slate-800 text-[11px] whitespace-pre-wrap leading-relaxed">
                    {selectedReport.clinical_notes}
                  </p>
                </div>
              )}

              {/* Validation Remarks / Wilaya Visa */}
              {selectedReport.validation_remarks ? (
                <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-sm">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase text-[10px] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {isRtl ? 'تأشيرة وملاحظات مفتشية الولاية (DSV)' : "Visa & Décision de l'Inspecteur de Wilaya"}
                    </span>
                  </div>
                  <p className="font-mono text-emerald-950 text-[11px] leading-relaxed">
                    {selectedReport.validation_remarks}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>
                    {selectedReport.status === 'DRAFT'
                      ? (isRtl ? 'المحضر في حالة مسودة — لم يتم إرساله للولاية بعد.' : 'PV en mode brouillon — En attente de soumission à la Wilaya.')
                      : (isRtl ? 'في انتظار مراجعة وتأشيرة مفتشية الولاية.' : 'En attente de visa officiel par l\'inspection vétérinaire de Wilaya.')}
                  </span>
                  <span className="text-slate-400 font-bold">DSV-VISA</span>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between">
              {/* Left Edit Button (Active ONLY for DRAFT status) */}
              <div>
                {selectedReport.status === 'DRAFT' ? (
                  <button
                    onClick={() => handleOpenEditModal(selectedReport)}
                    className="px-3 py-1.5 rounded-sm bg-[#0c4a6e] hover:bg-[#072c41] text-white text-xs font-semibold flex items-center gap-1.5 border border-[#09354f] cursor-pointer shadow-sm transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تعديل المحضر (مسودة)' : 'Modifier le PV (Brouillon)'}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {isRtl
                        ? 'محضر مقفل رسمياً (غير قابل للتعديل)'
                        : 'PV verrouillé (Non modifiable)'}
                    </span>
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-3 py-1.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: NOUVELLE DÉCLARATION / SAISIE OU ÉDITION PV (FORM)
         ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-none">
          <div className="bg-white border border-slate-300 rounded-sm shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#0c4a6e]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {editingReportId
                      ? (isRtl ? 'تعديل محضر التفتيش الصحي البيطري' : 'MODIFICATION DU PROCÈS-VERBAL (ÉDITION BROUILLON)')
                      : (isRtl ? 'محضر فحص صحي بيطري جديد (PV)' : "NOUVEAU PROCÈS-VERBAL D'INSPECTION D'ABATTOIR")}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {isRtl
                      ? 'تسجيل مجمع للذبح اليومي ومحاضر الحجز الصحي'
                      : 'Modèle de déclaration journalière et saisies sanitaires (DSV)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingReportId(null);
                }}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form
              onSubmit={handleSubmitReport}
              className="p-4 overflow-y-auto space-y-4 flex-1 text-xs"
            >
              {/* Top Row: Date, Établissement, Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    {isRtl ? 'تاريخ التفتيش' : "Date d'inspection"} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.inspectionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, inspectionDate: e.target.value })
                    }
                    className="w-full py-1.5 px-2 rounded-sm border border-slate-300 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none font-mono bg-white"
                  />
                </div>

                {/* Slaughterhouse Select */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    {isRtl ? 'المذبح / المنشأة' : "Établissement d'abattage"} *
                  </label>
                  <select
                    value={formData.slaughterhouseId}
                    onChange={(e) => {
                      const found = dictionaries.slaughterhouses.find(
                        (s) => s.id === e.target.value
                      );
                      setFormData({
                        ...formData,
                        slaughterhouseId: e.target.value,
                        slaughterhouseName: found?.name_fr || formData.slaughterhouseName,
                      });
                    }}
                    className="w-full py-1.5 px-2 rounded-sm border border-slate-300 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none bg-white font-mono"
                  >
                    {dictionaries.slaughterhouses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name_fr} ({s.facility_type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Initial Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                    {isRtl ? 'حالة الحفظ' : 'Statut du PV'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full py-1.5 px-2 rounded-sm border border-slate-300 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none bg-white font-mono"
                  >
                    <option value="DRAFT">
                      {isRtl ? 'مسودة محلية (DRAFT)' : 'Brouillon local (DRAFT)'}
                    </option>
                    <option value="SUBMITTED_TO_WILAYA">
                      {isRtl
                        ? 'إرسال رسمي للولاية (SUBMITTED)'
                        : 'Soumettre à la Wilaya (SUBMITTED)'}
                    </option>
                  </select>
                </div>
              </div>

              {/* MDO Urgent Alert Flag Banner */}
              <div
                className={`p-2.5 rounded-sm border flex items-center justify-between ${
                  formData.isUrgentMdo
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isUrgentMdo}
                    onChange={(e) =>
                      setFormData({ ...formData, isUrgentMdo: e.target.checked })
                    }
                    className="w-4 h-4 rounded-none text-red-700 border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold uppercase text-[11px] block">
                      {isRtl
                        ? 'تنبيه عاجل: مرض خاضع للإبلاغ الإجباري (MDO)'
                        : 'SIGNALEMENT D\'URGENCE MDO (Maladie à Déclaration Obligatoire)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isRtl
                        ? 'تفعيل هذا الخيار يرسل إشعاراً فورياً لمديرية المصالح البيطرية بالولاية'
                        : 'Déclenche une notification immédiate auprès de l\'inspecteur de wilaya et du Ministère.'}
                    </span>
                  </div>
                </label>
                {formData.isUrgentMdo && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    URGENCE DSV
                  </span>
                )}
              </div>

              {/* Observations / Notes cliniques */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                  {isRtl ? 'الملاحظات والنتائج العيانية' : 'Observations cliniques / Lésions constatées'}
                </label>
                <textarea
                  rows={2}
                  value={formData.clinicalNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, clinicalNotes: e.target.value })
                  }
                  placeholder={
                    isRtl
                      ? 'سجل أي ملاحظات بخصوص فحص ما قبل أو بعد الذبح...'
                      : 'Précisez l\'origine des lots, le numéro de boucle ou les symptômes ante-mortem...'
                  }
                  className="w-full p-2 text-xs rounded-sm border border-slate-300 focus:border-[#0c4a6e] focus:ring-0 focus:outline-none bg-white font-mono"
                />
              </div>

              {/* Dynamic Seizure Rows Section */}
              <div className="border border-slate-300 rounded-sm overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    {isRtl ? 'جدول الحجوزات الصحية' : 'RELEVÉ DES SAISIES ET MOTIFS SANITAIRES'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSeizureRow}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[#0c4a6e]" />
                    <span>{isRtl ? 'إضافة سطر' : '+ Ajouter une ligne'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[9px] font-bold">
                        <th className="py-1.5 px-2 text-start">{isRtl ? 'النوع' : 'Espèce'}</th>
                        <th className="py-1.5 px-2 text-start">{isRtl ? 'المرض / الآفة' : 'Motif / Maladie'}</th>
                        <th className="py-1.5 px-2 text-start">{isRtl ? 'العضو' : 'Organe'}</th>
                        <th className="py-1.5 px-2 text-start">{isRtl ? 'الدرجة' : 'Sévérité'}</th>
                        <th className="py-1.5 px-2 text-start w-20">{isRtl ? 'العدد' : 'Quantité'}</th>
                        <th className="py-1.5 px-2 text-start w-24">{isRtl ? 'الوزن (كغ)' : 'Poids (kg)'}</th>
                        <th className="py-1.5 px-2 text-end w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {seizureRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50">
                          {/* Espèce */}
                          <td className="p-1.5">
                            <select
                              value={row.speciesId}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'speciesId', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                            >
                              {dictionaries.species.map((sp) => (
                                <option key={sp.id} value={sp.id}>
                                  {sp.name_fr}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Maladie */}
                          <td className="p-1.5">
                            <select
                              value={row.diseaseId}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'diseaseId', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                            >
                              {dictionaries.diseases.map((ds) => (
                                <option key={ds.id} value={ds.id}>
                                  {ds.name_fr} {ds.is_mdo ? '(MDO)' : ''}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Organe */}
                          <td className="p-1.5">
                            <select
                              value={row.organId}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'organId', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                            >
                              {dictionaries.organs.map((og) => (
                                <option key={og.id} value={og.id}>
                                  {og.name_fr}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Sévérité */}
                          <td className="p-1.5">
                            <select
                              value={row.severity}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'severity', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                            >
                              <option value="1C">1C (Saisie partielle)</option>
                              <option value="2C">2C (Saisie totale)</option>
                            </select>
                          </td>

                          {/* Quantité */}
                          <td className="p-1.5">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'quantity', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                            />
                          </td>

                          {/* Poids (kg) */}
                          <td className="p-1.5">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={row.weight}
                              onChange={(e) =>
                                handleUpdateSeizureRow(row.id, 'weight', e.target.value)
                              }
                              className="w-full py-1 px-1.5 rounded-sm border border-slate-300 text-xs font-mono bg-white font-bold"
                            />
                          </td>

                          {/* Remove row */}
                          <td className="p-1.5 text-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveSeizureRow(row.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title={isRtl ? 'حذف السطر' : 'Supprimer'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Totals Row */}
                <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 text-[10px] font-mono text-slate-700 flex justify-between">
                  <span>
                    TOTAL ORGANES/PIÈCES : <strong>{modalTotalQty}</strong>
                  </span>
                  <span>
                    POIDS TOTAL SAISI :{' '}
                    <strong className="text-slate-900 text-[11px]">
                      {modalTotalWeight} kg
                    </strong>
                  </span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingReportId(null);
                  }}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-sm bg-[#0c4a6e] hover:bg-[#072c41] text-white text-xs font-semibold cursor-pointer border border-[#09354f] flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isRtl ? 'جاري الحفظ...' : 'Enregistrement...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {editingReportId
                          ? (isRtl ? 'حفظ التعديلات' : 'Enregistrer les modifications')
                          : (isRtl ? 'حفظ المحضر' : 'Enregistrer le Procès-Verbal')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
