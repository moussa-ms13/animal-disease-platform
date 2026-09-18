import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Activity,
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
  Info
} from 'lucide-react';

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
      weight: '4.5'
    }
  ]);

  // Urgent Declaration State
  const [isUrgent, setIsUrgent] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Feedback notifications
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'warning' | 'info', message: string }

  // Handlers for dynamic findings
  const handleAddFinding = () => {
    const newFinding = {
      id: Date.now(),
      species: '',
      disease: '',
      organ: '',
      severity: '',
      quantity: 1,
      weight: ''
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

  // Calculations
  const totalWeight = findings
    .reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0)
    .toFixed(1);

  const totalQuantity = findings.reduce(
    (acc, curr) => acc + (parseInt(curr.quantity, 10) || 0),
    0
  );

  // Form actions
  const handleSaveDraft = () => {
    setFeedback({
      type: 'info',
      message: t('vet.form.draftSavedAlert')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const hasIncompleteRow = findings.some(
      (f) => !f.species || !f.disease || !f.organ || !f.severity || !f.weight
    );

    if (findings.length > 0 && hasIncompleteRow) {
      setFeedback({
        type: 'warning',
        message: t('vet.form.validationError')
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: t('vet.form.submittedAlert')
    });
  };

  // Formatted date
  const todayFormatted = new Intl.DateTimeFormat(
    i18n.language === 'ar' ? 'ar-DZ' : 'fr-FR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ).format(new Date());

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Breadcrumb / Return Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/veterinarian"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
        >
          <BackArrow className="w-4 h-4" />
          <span>{t('actions.back')}</span>
        </Link>

        <span className="badge-success">
          {t('roles.veterinarian')}
        </span>
      </div>

      {/* Header Section: Mocked Slaughterhouse Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {t('vet.form.facilityType')}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                {t('vet.form.licenseNumber')}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('vet.form.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('vet.form.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-soft-sm shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                  {t('vet.form.wilaya')}
                </span>
                <span className="font-bold text-slate-800">
                  {t('vet.form.slaughterhouse')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-soft-sm shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                  {t('vet.form.date')}
                </span>
                <span className="font-bold text-slate-800">
                  {todayFormatted}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-soft-sm shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                  {t('vet.form.doctorLabel')}
                </span>
                <span className="font-bold text-slate-800">
                  {t('vet.form.doctor')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-sm transition-all duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedback.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
            {feedback.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            {t('actions.cancel')}
          </button>
        </div>
      )}

      {/* Urgent Block (Maladie à déclaration obligatoire) */}
      <div
        className={`rounded-2xl border transition-all duration-300 p-6 ${
          isUrgent
            ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400/20 shadow-soft'
            : 'bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-amber-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isUrgent
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label
                htmlFor="urgent-toggle"
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  id="urgent-toggle"
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-5 h-5 rounded text-red-600 border-slate-300 focus:ring-red-500 focus:ring-2 cursor-pointer transition-colors"
                />
                <span
                  className={`text-base font-bold transition-colors ${
                    isUrgent ? 'text-red-900' : 'text-slate-800'
                  }`}
                >
                  {t('vet.form.urgentToggle')}
                </span>
              </label>

              {isUrgent && (
                <span className="badge-danger self-start sm:self-auto">
                  {t('vet.form.urgentBadge')}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {t('vet.form.urgentDescription')}
            </p>

            {/* Expandable Clinical Notes Textarea */}
            {isUrgent && (
              <div className="mt-4 pt-4 border-t border-red-200/80 space-y-2 animate-fadeIn">
                <label
                  htmlFor="clinical-notes"
                  className="block text-xs font-bold text-red-950 uppercase tracking-wide"
                >
                  {t('vet.form.clinicalNotesLabel')}
                </label>
                <textarea
                  id="clinical-notes"
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder={t('vet.form.clinicalNotesPlaceholder')}
                  className="w-full text-sm rounded-xl border border-red-200 bg-white p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-slate-400 shadow-soft-sm transition-all"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Findings List (Les Saisies) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {/* Section Header with Add button */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-soft-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {t('vet.form.findingsTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                  {findings.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('vet.form.findingsSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFinding}
            className="btn-primary self-start sm:self-auto text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t('vet.form.addFinding')}</span>
          </button>
        </div>

        {/* Empty State */}
        {findings.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-base font-bold text-slate-800">
                {t('vet.form.emptyTitle')}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('vet.form.emptySubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFinding}
              className="btn-secondary text-xs mt-2"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>{t('vet.form.addFinding')}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Desktop Column Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-6 py-3 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <div className="col-span-1 text-center">
                {t('vet.form.columns.index')}
              </div>
              <div className="col-span-2">
                {t('vet.form.columns.species')}
              </div>
              <div className="col-span-3">
                {t('vet.form.columns.disease')}
              </div>
              <div className="col-span-2">
                {t('vet.form.columns.organ')}
              </div>
              <div className="col-span-2">
                {t('vet.form.columns.severity')}
              </div>
              <div className="col-span-1">
                {t('vet.form.columns.quantity')}
              </div>
              <div className="col-span-1">
                {t('vet.form.columns.weight')}
              </div>
              <div className="col-span-1 text-center">
                {t('vet.form.columns.actions')}
              </div>
            </div>

            {/* Finding Rows */}
            {findings.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 lg:px-6 lg:py-4 transition-colors hover:bg-slate-50/60"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                  {/* Row Counter (Desktop) */}
                  <div className="hidden lg:flex col-span-1 items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center border border-slate-200">
                      {index + 1}
                    </span>
                  </div>

                  {/* Species Selector */}
                  <div className="lg:col-span-2">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.species')}
                    </label>
                    <select
                      value={item.species}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'species', e.target.value)
                      }
                      className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                      aria-label={t('vet.form.columns.species')}
                    >
                      <option value="">{t('vet.form.selectSpecies')}</option>
                      {SPECIES_OPTIONS.map((sp) => (
                        <option key={sp} value={sp}>
                          {t(`vet.form.species.${sp}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Disease Selector */}
                  <div className="lg:col-span-3">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.disease')}
                    </label>
                    <select
                      value={item.disease}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'disease', e.target.value)
                      }
                      className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                      aria-label={t('vet.form.columns.disease')}
                    >
                      <option value="">{t('vet.form.selectDisease')}</option>
                      {DISEASE_OPTIONS.map((dis) => (
                        <option key={dis} value={dis}>
                          {t(`vet.form.diseases.${dis}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Organ Selector */}
                  <div className="lg:col-span-2">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.organ')}
                    </label>
                    <select
                      value={item.organ}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'organ', e.target.value)
                      }
                      className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                      aria-label={t('vet.form.columns.organ')}
                    >
                      <option value="">{t('vet.form.selectOrgan')}</option>
                      {ORGAN_OPTIONS.map((org) => (
                        <option key={org} value={org}>
                          {t(`vet.form.organs.${org}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity Selector (1C / 2C) */}
                  <div className="lg:col-span-2">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.severity')}
                    </label>
                    <select
                      value={item.severity}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'severity', e.target.value)
                      }
                      className={`w-full text-xs sm:text-sm py-2 px-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer ${
                        item.severity === '2C'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.severity === '1C'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-white text-slate-800 border-slate-200'
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
                  </div>

                  {/* Quantity Input */}
                  <div className="lg:col-span-1">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.quantity')}
                    </label>
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
                      className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-center"
                      placeholder="1"
                      aria-label={t('vet.form.columns.quantity')}
                    />
                  </div>

                  {/* Weight Input (kg) */}
                  <div className="lg:col-span-1">
                    <label className="block lg:hidden text-xs font-semibold text-slate-600 mb-1">
                      {t('vet.form.columns.weight')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={item.weight}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'weight', e.target.value)
                      }
                      className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-center"
                      placeholder="0.0"
                      aria-label={t('vet.form.columns.weight')}
                    />
                  </div>

                  {/* Action: Delete Row Button */}
                  <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-end lg:justify-center pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveFinding(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                      title={t('vet.form.removeFinding')}
                      aria-label={t('vet.form.removeFinding')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Action Bar (Bottom) */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-soft-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Realtime Live Metrics Counter */}
          <div className="flex items-center gap-6 text-xs text-slate-600 self-start sm:self-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Hash className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {t('vet.form.summary.totalFindings')}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {findings.length} {t('vet.form.summary.items')} ({totalQuantity} {t('vet.form.columns.quantity')})
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {t('vet.form.summary.totalWeight')}
                </span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  {totalWeight} {t('vet.form.summary.kg')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn-secondary flex-1 sm:flex-none text-xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>{t('vet.form.saveDraft')}</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary flex-1 sm:flex-none text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Send className="w-4 h-4" />
              <span>{t('vet.form.submitWilaya')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
