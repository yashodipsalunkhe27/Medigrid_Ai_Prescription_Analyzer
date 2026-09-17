import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, Sun, Moon, ChevronRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useData } from '../../context/DataContext'
import { useProfile } from '../../context/ProfileContext'
import { formatName, timeAgo, cn } from '../../lib/utils'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/analyzer': 'Prescription Analyzer',
  '/patients': 'Patients',
  '/assistant': 'AI Assistant',
  '/history': 'Prescription History',
  '/warnings': 'Critical Warnings',
  '/pharmacy': 'Pharmacy & Location',
  '/analytics': 'Reports & Analytics',
  '/settings': 'Settings',
}

function useBreadcrumb(pathname) {
  if (pathname.startsWith('/patients/')) return ['Patients', 'Patient Profile']
  const title = PAGE_TITLES[pathname] || 'MediGrid AI'
  return [title]
}

export default function Header({ onOpenMobileNav }) {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const crumbs = useBreadcrumb(pathname)
  const { patients, warningLog } = useData()
  const { name, initials } = useProfile()
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const notifications = warningLog.slice(0, 5)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 backdrop-blur px-4 sm:px-6">
      <button
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="lg:hidden text-muted hover:text-ink p-1.5 -ml-1.5"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-1.5 min-w-0">
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={14} className="text-muted shrink-0" aria-hidden="true" />}
            <h1
              className={cn(
                'truncate font-display',
                i === crumbs.length - 1 ? 'text-base font-semibold text-ink' : 'text-sm text-muted hidden sm:inline',
              )}
            >
              {c}
            </h1>
          </span>
        ))}
      </div>

      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search patients, medicines, prescriptions..."
            aria-label="Search patients, medicines, prescriptions"
            className="w-full rounded-md border border-border bg-surface-alt/60 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:bg-surface focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label={`Notifications${notifications.length ? `, ${notifications.length} unread` : ''}`}
            aria-expanded={notifOpen}
            className="relative text-muted hover:text-ink hover:bg-surface-alt p-2 rounded-full transition-colors"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical ring-2 ring-surface" aria-hidden="true" />
            )}
          </button>
          {notifOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-lg border border-border bg-surface shadow-popover animate-scale-in overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-ink font-display">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-muted text-center">You're all caught up.</p>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to="/warnings"
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 border-b border-border last:border-0 hover:bg-surface-alt transition-colors"
                    >
                      <p className="text-sm text-ink line-clamp-2">
                        {n.count} warning{n.count === 1 ? '' : 's'} found for {formatName(n.patientName)}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{timeAgo(n.createdAt)}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="text-muted hover:text-ink hover:bg-surface-alt p-2 rounded-full transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          to="/settings"
          className="flex items-center gap-2.5 pl-2 ml-1 border-l border-border hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-semibold">
            {initials()}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-ink">{name}</p>
            <p className="text-[11px] text-muted">{patients.length} patients on file</p>
          </div>
        </Link>
      </div>
    </header>
  )
}