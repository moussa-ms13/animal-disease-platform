import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowUpLeft, Bell, CheckCircle2, ChevronDown, ClipboardList, Clock3, Columns3, Filter, Info, Languages, LayoutDashboard, LogOut, Map, Menu, Plus, Search, Settings, ShieldCheck, Stethoscope, X, XCircle } from 'lucide-react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { getCurrentUser, logoutUser } from '../../services/dbService';
import Sparkline from './Sparkline';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const statusMap = {
  confirmed: { className: 'status-confirmed', icon: CheckCircle2 },
  pending: { className: 'status-pending', icon: Clock3 },
  urgent: { className: 'status-urgent', icon: AlertTriangle },
  rejected: { className: 'status-rejected', icon: XCircle },
  draft: { className: 'status-draft', icon: Info },
  returned: { className: 'status-returned', icon: ArrowUpLeft },
};

export function StatusBadge({ status = 'pending', children, label }) {
  const meta = statusMap[status] || statusMap.pending;
  const Icon = meta.icon;
  return <span className={cx('status-badge', meta.className)} title={label || children}><Icon size={16} strokeWidth={2} aria-hidden="true" /><span>{children}</span></span>;
}

export function KpiCard({ label, value, detail, icon: Icon = Info, tone = 'navy', trend, trendData, trendLabel, primary = false }) {
  return <article className={cx('kpi-card', `kpi-${tone}`, primary && 'metric-primary')}><div className="kpi-icon"><Icon size={18} /></div><div className="min-w-0"><p className="kpi-label">{label}</p><p className="kpi-value font-stats">{value}</p>{detail && <p className="kpi-detail">{detail}</p>}{trendData && <div className="kpi-trend"><Sparkline data={trendData} label={trendLabel || trend || label} color="currentColor" /><span className="sr-only">{trendLabel || trend}</span></div>}{trend && !trendData && <p className="kpi-trend">{trend}</p>}</div></article>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function SectionCard({ title, description, icon: Icon, action, children, className = '' }) {
  return <section className={cx('section-card', className)}><div className="section-card-header"><div className="flex items-center gap-3 min-w-0">{Icon && <div className="section-icon"><Icon size={17} /></div>}<div className="min-w-0"><h2>{title}</h2>{description && <p>{description}</p>}</div></div>{action}</div>{children}</section>;
}

export function FilterBar({ children, onReset }) { const { t } = useTranslation(); return <div className="filter-bar"><div className="filter-fields">{children}</div>{onReset && <button className="text-button" onClick={onReset}>{t('actions.reset')}</button>}</div>; }
export function Field({ label, icon: Icon, children, className = '' }) { return <label className={cx('field', className)}><span>{label}</span><div className="field-control">{Icon && <Icon size={16} />}{children}</div></label>; }
export function EmptyState({ icon: Icon = ClipboardList, title, description, action }) { return <div className="empty-state"><Icon size={26} /><strong>{title}</strong><p>{description}</p>{action && <div className="next-action">{action}</div>}</div>; }

const navItems = [
  { to: '/veterinarian', key: 'nav.veterinarian', icon: Stethoscope, roles: ['VETERINARIAN'] },
  { to: '/wilaya', key: 'nav.wilaya', icon: Map, roles: ['WILAYA_INSPECTOR'] },
  { to: '/ministry', key: 'nav.ministry', icon: LayoutDashboard, roles: ['MINISTRY_ADMIN', 'MINISTRY'] },
  { to: '/admin', key: 'nav.admin', icon: Settings, roles: ['SYSTEM_ADMIN', 'ADMIN'] },
];

function CommandPalette({ open, onClose, role }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const caseRoute = role === 'WILAYA_INSPECTOR' ? '/wilaya' : role === 'MINISTRY' || role === 'MINISTRY_ADMIN' ? '/ministry' : '/veterinarian';
  const items = useMemo(() => [...navItems.map((item) => ({ ...item, label: t(item.key) })), { to: caseRoute, key: 'shell.searchCases', icon: ClipboardList, label: t('shell.searchCases') }].filter((item) => item.label.toLowerCase().includes(query.toLowerCase())), [caseRoute, query, t]);
  if (!open) return null;
  const go = (to) => { navigate(to); onClose(); };
  return <div className="command-backdrop" role="presentation" onMouseDown={onClose}><div className="command-palette" role="dialog" aria-modal="true" aria-label={t('shell.commandTitle')} onMouseDown={(event) => event.stopPropagation()}><div className="command-search"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('shell.commandPlaceholder')} /><kbd>Esc</kbd></div><div className="command-results">{items.map((item) => <button type="button" key={item.to} onClick={() => go(item.to)}><item.icon size={16} /><span>{item.label}</span><span className="command-enter">↵</span></button>)}{!items.length && <p className="command-empty">{t('common.noData')}</p>}</div></div></div>;
}

export function AppShell({ children }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const isRtl = i18n.language === 'ar';
  const roleKey = { VETERINARIAN: 'roles.veterinarian', WILAYA_INSPECTOR: 'roles.wilaya', MINISTRY_ADMIN: 'roles.ministry', MINISTRY: 'roles.ministry', SYSTEM_ADMIN: 'roles.admin', ADMIN: 'roles.admin' }[user?.role] || 'roles.veterinarian';
  useEffect(() => {
    const onKeyDown = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen(true); } if (event.key === 'Escape') setCommandOpen(false); };
    window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const toggleLanguage = () => i18n.changeLanguage(isRtl ? 'fr' : 'ar');
  const handleLogout = async () => { await logoutUser(); navigate('/login'); };
  const notices = [{ title: t('shell.urgentNotice'), text: t('shell.urgentNoticeText') }, { title: t('shell.pendingNotice'), text: t('shell.pendingNoticeText') }];
  return <div className="app-shell">
    <aside className={cx('sidebar', mobileOpen && 'sidebar-open')}><div className="brand"><div className="brand-mark"><ShieldCheck size={20} /></div><div><strong>{t('app.shortTitle')}</strong><span>{t('app.brandLine')}</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)} title={t('actions.close')}><X size={17} /></button></div><div className="workspace-label">{t('shell.workspace')}</div><nav className="sidebar-nav">{navItems.filter((item) => item.roles.includes(user?.role)).map((item) => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cx('nav-item', location.pathname.startsWith(item.to) && 'nav-item-active')}><item.icon size={17} /><span>{t(item.key)}</span></Link>)}</nav><div className="sidebar-footer"><div className="live-indicator"><span></span><div><strong>{t('shell.live')}</strong><small>{t('shell.sync')}</small></div></div><div className="sidebar-help">{t('shell.help')}</div></div></aside>
    {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label={t('actions.close')} />}
    <div className="main-shell"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)} title={t('shell.openNavigation')}><Menu size={19} /></button><div className="breadcrumb"><span>{t('app.shortTitle')}</span><span>/</span><strong>{t(navItems.find((n) => location.pathname.startsWith(n.to))?.key || 'nav.dashboard')}</strong></div></div><div className="topbar-actions"><button className="quick-search-button" onClick={() => setCommandOpen(true)} title={t('shell.commandHint')}><Search size={15} /><span>{t('common.search')}</span><kbd>⌘K</kbd></button><button className="topbar-icon" onClick={toggleLanguage} title={t('app.language')}><Languages size={17} /><span>{isRtl ? 'FR' : 'ع'}</span></button><div className="notification-wrap"><button className="topbar-icon notification-button" onClick={() => setNoticesOpen(!noticesOpen)} title={t('shell.notifications')}><Bell size={17} /><i>2</i></button>{noticesOpen && <div className="notification-menu"><div className="notification-menu-head"><strong>{t('shell.notifications')}</strong><span>2 {t('shell.unread')}</span></div>{notices.map((notice) => <div className="notification-item" key={notice.title}><div className="notice-dot"></div><div><strong>{notice.title}</strong><p>{notice.text}</p></div></div>)}<button className="notification-footer" onClick={() => setNoticesOpen(false)}>{t('shell.markRead')}</button></div>}</div><div className="user-chip"><div className="avatar">{(user?.fullName || 'U').charAt(0)}</div><div><strong>{user?.fullName || t('roles.veterinarian')}</strong><span>{t(roleKey)}{user?.wilayaName ? ` · ${user.wilayaName}` : ''}{user?.slaughterhouseName ? ` · ${user.slaughterhouseName}` : ''}</span></div><ChevronDown size={14} /></div><button className="logout-button" onClick={handleLogout} title={t('nav.logout')}><LogOut size={16} /></button></div></header><main className="content-area">{children}</main><footer className="app-footer">{t('shell.footer')}</footer></div><CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} role={user?.role} />
  </div>;
}

export function Button({ children, variant = 'primary', icon: Icon, type = 'button', onClick, disabled, title }) { return <button type={type} disabled={disabled} onClick={onClick} title={title} className={cx('button', `button-${variant}`)}>{Icon && <Icon size={16} />}{children}</button>; }

function DenseGridToolbar() { return <GridToolbarContainer className="dense-grid-toolbar"><GridToolbarQuickFilter debounceMs={250} /><span className="toolbar-spacer" /><GridToolbarFilterButton startIcon={<Filter size={15} />} /><GridToolbarColumnsButton startIcon={<Columns3 size={15} />} /></GridToolbarContainer>; }

export function DenseDataGrid({ rows = [], columns = [], getRowId, ariaLabel, onRowClick, checkboxSelection = false }) {
  return <div className="dense-grid" dir="inherit"><DataGrid rows={rows} columns={columns} getRowId={getRowId} onRowClick={onRowClick} checkboxSelection={checkboxSelection} disableRowSelectionOnClick={!checkboxSelection} rowHeight={32} columnHeaderHeight={34} density="compact" pageSizeOptions={[5, 10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} slots={{ toolbar: DenseGridToolbar }} slotProps={{ toolbar: { showQuickFilter: true } }} disableColumnMenu={false} aria-label={ariaLabel} /> </div>;
}

export function DataTable({ columns, rows, empty }) { return <div className="table-wrap">{rows.length ? <table className="data-table"><thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>)}</tbody></table> : empty}</div>; }
export { Plus, Stethoscope, Search, ArrowUpLeft };
