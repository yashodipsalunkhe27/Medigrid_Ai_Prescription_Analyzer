import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  ScanLine,
  Users,
  MessageSquareText,
  History,
  ShieldAlert,
  MapPin,
  BarChart3,
  Settings,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
  Stethoscope,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useProfile } from '../../context/ProfileContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/analyzer', label: 'Prescription Analyzer', icon: ScanLine },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/history', label: 'Prescription History', icon: History },
  { to: '/warnings', label: 'Critical Warnings', icon: ShieldAlert },
  { to: '/pharmacy', label: 'Pharmacy & Location', icon: MapPin },
  { to: '/analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { name, role, initials } = useProfile()

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] lg:hidden animate-fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-200 ease-out',
          'lg:translate-x-0',
          collapsed ? 'w-[76px]' : 'w-[264px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0', collapsed && 'px-0 justify-center')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shrink-0">
            <Stethoscope size={19} aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-ink font-display leading-tight truncate">MediGrid AI</p>
              <p className="text-[11px] text-muted leading-tight truncate">Smarter Care. Safer Prescriptions.</p>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto lg:hidden text-muted hover:text-ink p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-primary/10 text-primary-dark dark:text-primary'
                    : 'text-muted hover:bg-surface-alt hover:text-ink',
                  collapsed && 'justify-center px-0',
                )
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" aria-hidden="true" />
                  )}
                  <item.icon size={18} className="shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* AI Assistant promo */}
        {!collapsed && (
          <div className="mx-3 mb-3 rounded-lg bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
            <Sparkles size={18} className="mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold font-display">AI Medical Assistant</p>
            <p className="text-xs text-white/80 mt-0.5">AI-powered healthcare insights</p>
          </div>
        )}

        {/* User */}
        <div className={cn('flex items-center gap-3 border-t border-border px-4 py-3.5 shrink-0', collapsed && 'justify-center px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary text-sm font-semibold">
            {initials()}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{name}</p>
              <p className="text-xs text-muted truncate">{role}</p>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3 top-[72px] h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-ink shadow-card"
        >
          {collapsed ? <ChevronsRight size={13} /> : <ChevronsLeft size={13} />}
        </button>
      </aside>
    </>
  )
}