export function getPeriodRange(period, anchor = new Date()) {
  const end = new Date(anchor);
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  if (period === 'day') start.setHours(0, 0, 0, 0);
  else if (period === 'month') { start.setDate(1); start.setHours(0, 0, 0, 0); }
  else { start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0); }
  return { start, end };
}

export function formatDateRange(period, language = 'fr', anchor = new Date()) {
  const { start, end } = getPeriodRange(period, anchor);
  const locale = language === 'ar' ? 'ar-DZ' : 'fr-FR';
  const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}
