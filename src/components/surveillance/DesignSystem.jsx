import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Menu, ShieldCheck, Stethoscope, Languages, X, Map, Settings, Activity, Search, Plus, ArrowUpLeft, ArrowUpRight, CheckCircle2, Clock3, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCurrentUser, logoutUser } from '../../services/dbService';
const cx = (...classes) => classes.filter(Boolean).join(' ');

export function StatusBadge({ status = 'pending', children }) {
  const map = { confirmed: ['badge-confirmed', CheckCircle2], pending: ['badge-pending', Clock3], urgent: ['badge-urgent', AlertTriangle], rejected: ['badge-rejected', XCircle], draft: ['badge-draft', Info], returned: ['badge-returned', ArrowUpLeft] };
  const [style, Icon] = map[status] || map.pending;
  return <span className={cx('status-badge', style)}><Icon size={13} />{children}</span>;
}

export function KpiCard({ label, value, detail, icon: Icon = Activity, tone = 'navy', trend }) {
  return <article className={cx('kpi-card', `kpi-${tone}`)}><div className="kpi-icon"><Icon size={20} /></div><div className="min-w-0"><p className="kpi-label">{label}</p><p className="kpi-value">{value}</p>{detail && <p className="kpi-detail">{detail}</p>}{trend && <p className="kpi-trend">{trend}</p>}</div></article>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function SectionCard({ title, description, icon: Icon, action, children, className = '' }) {
  return <section className={cx('section-card', className)}><div className="section-card-header"><div className="flex items-center gap-3 min-w-0">{Icon && <div className="section-icon"><Icon size={18} /></div>}<div className="min-w-0"><h2>{title}</h2>{description && <p>{description}</p>}</div></div>{action}</div>{children}</section>;
}

export function FilterBar({ children, onReset }) { return <div className="filter-bar"><div className="filter-fields">{children}</div>{onReset && <button className="text-button" onClick={onReset}>إعادة تعيين</button>}</div>; }
export function Field({ label, icon: Icon, children, className = '' }) { return <label className={cx('field', className)}><span>{label}</span><div className="field-control">{Icon && <Icon size={16} />}{children}</div></label>; }
export function EmptyState({ icon: Icon = ClipboardList, title, description }) { return <div className="empty-state"><Icon size={28} /><strong>{title}</strong><p>{description}</p></div>; }

const navItems = [
  { to: '/veterinarian', key: 'nav.dashboard', icon: LayoutDashboard, roles: ['VETERINARIAN'] },
  { to: '/wilaya', key: 'nav.wilaya', icon: Map, roles: ['WILAYA_INSPECTOR'] },
  { to: '/ministry', key: 'nav.ministry', icon: Activity, roles: ['MINISTRY_ADMIN', 'MINISTRY'] },
  { to: '/admin', key: 'nav.admin', icon: Settings, roles: ['SYSTEM_ADMIN', 'ADMIN'] },
];

export function AppShell({ children }) {
  const { t, i18n } = useTranslation(); const location = useLocation(); const navigate = useNavigate();
  const user = getCurrentUser(); const [mobileOpen, setMobileOpen] = useState(false); const [noticesOpen, setNoticesOpen] = useState(false);
  const isRtl = i18n.language === 'ar';
  const roleKey = { VETERINARIAN: 'roles.veterinarian', WILAYA_INSPECTOR: 'roles.wilaya', MINISTRY_ADMIN: 'roles.ministry', MINISTRY: 'roles.ministry', SYSTEM_ADMIN: 'roles.admin', ADMIN: 'roles.admin' }[user?.role] || 'roles.veterinarian';
  const toggleLanguage = () => i18n.changeLanguage(isRtl ? 'fr' : 'ar');
  const handleLogout = async () => { await logoutUser(); navigate('/login'); };
  const notices = [{ title: t('shell.urgentNotice'), text: t('shell.urgentNoticeText') }, { title: t('shell.pendingNotice'), text: t('shell.pendingNoticeText') }];
  return <div className="app-shell">
    <aside className={cx('sidebar', mobileOpen && 'sidebar-open')}>
      <div className="brand"><div className="brand-mark"><ShieldCheck size={21} /></div><div><strong>{t('app.shortTitle')}</strong><span>{t('app.brandLine')}</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <div className="workspace-label">{t('shell.workspace')}</div>
      <nav className="sidebar-nav">{navItems.filter((item) => item.roles.includes(user?.role)).map((item) => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cx('nav-item', location.pathname.startsWith(item.to) && 'nav-item-active')}><item.icon size={18} /><span>{t(item.key)}</span></Link>)}</nav>
      <div className="sidebar-footer"><div className="live-indicator"><span></span><div><strong>{t('shell.live')}</strong><small>{t('shell.sync')}</small></div></div><div className="sidebar-help">{t('shell.help')}</div></div>
    </aside>
    {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="close navigation" />}
    <div className="main-shell"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="breadcrumb"><span>{t('app.shortTitle')}</span><span>/</span><strong>{t(navItems.find((n) => location.pathname.startsWith(n.to))?.key || 'nav.dashboard')}</strong></div></div><div className="topbar-actions"><button className="topbar-icon" onClick={toggleLanguage} title={t('app.language')}><Languages size={18} /><span>{isRtl ? 'FR' : 'ع'}</span></button><div className="notification-wrap"><button className="topbar-icon notification-button" onClick={() => setNoticesOpen(!noticesOpen)}><Bell size={18} /><i>2</i></button>{noticesOpen && <div className="notification-menu"><div className="notification-menu-head"><strong>{t('shell.notifications')}</strong><span>2 {t('shell.unread')}</span></div>{notices.map((notice) => <div className="notification-item" key={notice.title}><div className="notice-dot"></div><div><strong>{notice.title}</strong><p>{notice.text}</p></div></div>)}<button className="notification-footer" onClick={() => setNoticesOpen(false)}>{t('shell.markRead')}</button></div>}</div><div className="user-chip"><div className="avatar">{(user?.fullName || 'U').charAt(0)}</div><div><strong>{user?.fullName || 'Utilisateur'}</strong><span>{t(roleKey)}</span></div><ChevronDown size={15} /></div><button className="logout-button" onClick={handleLogout} title={t('nav.logout')}><LogOut size={17} /></button></div></header><main className="content-area">{children}</main><footer className="app-footer">{t('shell.footer')}</footer></div>
  </div>;
}

export function Button({ children, variant = 'primary', icon: Icon, type = 'button', onClick, disabled }) { return <button type={type} disabled={disabled} onClick={onClick} className={cx('button', `button-${variant}`)}>{Icon && <Icon size={16} />}{children}</button>; }
export function DataTable({ columns, rows, empty }) { return <div className="table-wrap">{rows.length ? <table className="data-table"><thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>)}</tbody></table> : empty}</div>; }
export { Plus, Stethoscope, Search, ArrowUpRight };
