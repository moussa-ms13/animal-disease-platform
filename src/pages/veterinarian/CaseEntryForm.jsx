import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Send,
  Building2,
  Calendar,
  UserCheck,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Hash,
  Info,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ClinicalCard from '../../components/ui/ClinicalCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ClinicalButton from '../../components/ui/ClinicalButton';

const SPECIES_OPTIONS = ['BOVIN', 'OVIN', 'CAPRIN', 'EQUIN', 'CAMELIN'];
const DISEASE_OPTIONS = ['HYDAT', 'TUBER', 'FASCIOL', 'CYSTIC', 'AUTRES'];
const ORGAN_OPTIONS = ['FOIE', 'POUMON', 'COEUR'];
const SEVERITY_OPTIONS = ['1C', '2C'];

export default function CaseEntryForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  // Dynamic Findings State
  const [findings, setFindings] = useState([
    {
      id: 1,
      species: 'BOVIN',
      disease: 'HYDAT',
      organ: 'FOIE',
      severity: '1C',
      quantity: 1,
      weight: '4.5',
    },
  ]);

  // Urgent MDO State
  const [isUrgent, setIsUrgent] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Feedback notifications
  const [feedback, setFeedback] = useState(null);

  const handleAddFinding = () => {
    const newFinding = {
      id: Date.now(),
      species: '',
      disease: '',
      organ: '',
      severity: '',
      quantity: 1,
      weight: '',
    };
    setFindings((prev) => [...prev, newFinding]);
    setFeedback(null);
  };

  const handleRemoveFinding = (id) => {
    setFindings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setFindings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Live Calculations
  const totalWeight = findings
    .reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0)
    .toFixed(1);

  const totalQuantity = findings.reduce(
    (acc, curr) => acc + (parseInt(curr.quantity, 10) || 0),
    0
  );

  const handleSaveDraft = () => {
    setFeedback({
      type: 'info',
      message: t('vet.form.draftSavedAlert'),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasIncompleteRow = findings.some(
      (f) => !f.species || !f.disease || !f.organ || !f.severity || !f.weight
    );

    if (findings.length > 0 && hasIncompleteRow) {
      setFeedback({
        type: 'warning',
        message: t('vet.form.validationError'),
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: t('vet.form.submittedAlert'),
    });
  };

  const todayFormatted = new Intl.DateTimeFormat(
    i18n.language === 'ar' ? 'ar-DZ' : 'fr-FR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ).format(new Date());

  return (
    <div className="space-y-4 pb-20">
      {/* Institutional Page Header */}
      <PageHeader
        category={t('roles.veterinarian')}
        badge={t('vet.form.facilityType')}
        badgeVariant="dhis"
        title={t('vet.form.title')}
        subtitle={t('vet.form.subtitle')}
        actions={
          <Link
            to="/veterinarian"
            className="btn-secondary h-7 px-2.5 text-xs inline-flex items-center gap-1"
          >
            <BackArrow className="w-3.5 h-3.5" />
            <span>{t('actions.back')}</span>
          </Link>
        }
      >
        {/* Slaughterhouse Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 border border-slate-200 rounded-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-dhis-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                {t('vet.form.wilaya')} / {t('vet.form.commune')}
              </span>
              <span className="font-bold text-slate-900">{t('vet.form.slaughterhouse')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-dhis-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                {t('vet.form.date')}
              </span>
              <span className="font-bold text-slate-900">{todayFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-dhis-700 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                {t('vet.form.doctorLabel')}
              </span>
              <span className="font-bold text-slate-900">{t('vet.form.doctor')}</span>
            </div>
          </div>
        </div>
      </PageHeader>

      {/* Operational Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-sm border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-dhis-50 border-dhis-300 text-dhis-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
            {feedback.type === 'warning' && (
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            )}
            {feedback.type === 'info' && (
              <Info className="w-4 h-4 text-dhis-700 shrink-0" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[11px] font-bold text-slate-600 hover:underline cursor-pointer"
          >
            {t('actions.cancel')}
          </button>
        </div>
      )}

      {/* Urgent MDO Block (Clinical Alert Box) */}
      <div
        className={`p-3.5 border rounded-sm transition-colors ${
          isUrgent
            ? 'bg-red-50 border-red-400'
            : 'bg-white border-amber-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border ${
              isUrgent
                ? 'bg-red-700 text-white border-red-800'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label
                htmlFor="urgent-toggle"
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  id="urgent-toggle"
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded-none text-red-700 border-slate-400 focus:ring-red-600 cursor-pointer"
                />
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    isUrgent ? 'text-red-900' : 'text-slate-900'
                  }`}
                >
                  {t('vet.form.urgentToggle')}
                </span>
              </label>

              {isUrgent && (
                <StatusBadge variant="danger" dot>
                  {t('vet.form.urgentBadge')}
                </StatusBadge>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-1 leading-normal">
              {t('vet.form.urgentDescription')}
            </p>

            {isUrgent && (
              <div className="mt-3 pt-2.5 border-t border-red-200 space-y-1">
                <label
                  htmlFor="clinical-notes"
                  className="block text-[11px] font-bold text-red-900 uppercase"
                >
                  {t('vet.form.clinicalNotesLabel')}
                </label>
                <textarea
                  id="clinical-notes"
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder={t('vet.form.clinicalNotesPlaceholder')}
                  className="w-full text-xs p-2 bg-white border border-red-300 rounded-sm text-slate-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Findings List (High-Density Tabular Entry) */}
      <ClinicalCard
        title={t('vet.form.findingsTitle')}
        subtitle={t('vet.form.findingsSubtitle')}
        icon={ClipboardList}
        action={
          <ClinicalButton
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddFinding}
          >
            {t('vet.form.addFinding')}
          </ClinicalButton>
        }
        bodyClassName="p-0 overflow-x-auto"
      >
        {findings.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">
              {t('vet.form.emptyTitle')}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              {t('vet.form.emptySubtitle')}
            </p>
            <ClinicalButton
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAddFinding}
              className="mt-2"
            >
              {t('vet.form.addFinding')}
            </ClinicalButton>
          </div>
        ) : (
          <table className="clinical-table">
            <thead>
              <tr>
                <th className="w-10 text-center">{t('vet.form.columns.index')}</th>
                <th className="w-36">{t('vet.form.columns.species')}</th>
                <th>{t('vet.form.columns.disease')}</th>
                <th className="w-32">{t('vet.form.columns.organ')}</th>
                <th className="w-40">{t('vet.form.columns.severity')}</th>
                <th className="w-20 text-center">{t('vet.form.columns.quantity')}</th>
                <th className="w-24 text-center">{t('vet.form.columns.weight')}</th>
                <th className="w-12 text-center">{t('vet.form.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="text-center font-mono font-bold text-slate-500">
                    {index + 1}
                  </td>

                  <td>
                    <select
                      value={item.species}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'species', e.target.value)
                      }
                      className="clinical-select"
                      aria-label={t('vet.form.columns.species')}
                    >
                      <option value="">{t('vet.form.selectSpecies')}</option>
                      {SPECIES_OPTIONS.map((sp) => (
                        <option key={sp} value={sp}>
                          {t(`vet.form.species.${sp}`)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={item.disease}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'disease', e.target.value)
                      }
                      className="clinical-select"
                      aria-label={t('vet.form.columns.disease')}
                    >
                      <option value="">{t('vet.form.selectDisease')}</option>
                      {DISEASE_OPTIONS.map((dis) => (
                        <option key={dis} value={dis}>
                          {t(`vet.form.diseases.${dis}`)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={item.organ}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'organ', e.target.value)
                      }
                      className="clinical-select"
                      aria-label={t('vet.form.columns.organ')}
                    >
                      <option value="">{t('vet.form.selectOrgan')}</option>
                      {ORGAN_OPTIONS.map((org) => (
                        <option key={org} value={org}>
                          {t(`vet.form.organs.${org}`)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={item.severity}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'severity', e.target.value)
                      }
                      className={`clinical-select font-semibold ${
                        item.severity === '2C'
                          ? 'text-red-700 bg-red-50/50'
                          : item.severity === '1C'
                          ? 'text-amber-800 bg-amber-50/50'
                          : ''
                      }`}
                      aria-label={t('vet.form.columns.severity')}
                    >
                      <option value="">{t('vet.form.selectSeverity')}</option>
                      {SEVERITY_OPTIONS.map((sev) => (
                        <option key={sev} value={sev}>
                          {t(`vet.form.severities.${sev}`)}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleFieldChange(
                          item.id,
                          'quantity',
                          Math.max(1, parseInt(e.target.value, 10) || 1)
                        )
                      }
                      className="clinical-input text-center font-mono"
                      aria-label={t('vet.form.columns.quantity')}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={item.weight}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'weight', e.target.value)
                      }
                      placeholder="0.0"
                      className="clinical-input text-center font-mono"
                      aria-label={t('vet.form.columns.weight')}
                    />
                  </td>

                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFinding(item.id)}
                      className="p-1 rounded-sm text-slate-400 hover:text-red-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title={t('vet.form.removeFinding')}
                      aria-label={t('vet.form.removeFinding')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ClinicalCard>

      {/* Sticky Bottom Action & Indicators Toolbar */}
      <div className="sticky bottom-0 z-30 bg-white border border-slate-300 p-2.5 rounded-sm shadow-clinical">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Utilitarian Summary Counters */}
          <div className="flex items-center gap-4 text-xs self-start sm:self-center">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">
                {t('vet.form.summary.totalFindings')}:
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {findings.length}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-300"></div>

            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-dhis-700" />
              <span className="text-slate-500 font-medium">
                {t('vet.form.summary.totalWeight')}:
              </span>
              <span className="font-bold text-dhis-800 font-mono">
                {totalWeight} {t('vet.form.summary.kg')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ClinicalButton
              variant="secondary"
              size="md"
              icon={Save}
              onClick={handleSaveDraft}
            >
              {t('vet.form.saveDraft')}
            </ClinicalButton>

            <ClinicalButton
              variant="primary"
              size="md"
              icon={Send}
              onClick={handleSubmit}
            >
              {t('vet.form.submitWilaya')}
            </ClinicalButton>
          </div>
        </div>
      </div>
    </div>
  );
}