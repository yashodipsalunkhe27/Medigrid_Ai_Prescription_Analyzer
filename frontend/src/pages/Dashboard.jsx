import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileCheck2, ShieldAlert, MapPinned, ScanLine, ArrowRight, Pill } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonGrid, SkeletonCard } from '../components/ui/LoadingSkeleton'
import Button from '../components/ui/Button'
import { useData } from '../context/DataContext'
import { formatName, timeAgo } from '../lib/utils'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

// Deterministic color for an avatar circle, based on the patient's name
const AVATAR_PALETTE = [
  'bg-primary/15 text-primary-dark dark:text-primary',
  'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'bg-teal-500/15 text-teal-600 dark:text-teal-400',
]

function avatarColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

function initials(name = '') {
  const parts = formatName(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function medicineName(med) {
  return med?.medications || med?.name || 'Unknown'
}

// Builds the last 7 days of activity counts from real prescription timestamps
function useWeeklyActivity(prescriptions) {
  return useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      days.push({
        key: d.toDateString(),
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0,
      })
    }
    const byKey = Object.fromEntries(days.map((d) => [d.key, d]))
    prescriptions.forEach((rx) => {
      if (!rx.savedAt) return
      const d = new Date(rx.savedAt)
      if (Number.isNaN(d.getTime())) return
      const key = d.toDateString()
      if (byKey[key]) byKey[key].count += 1
    })
    return days
  }, [prescriptions])
}

export default function Dashboard() {
  const { patients, prescriptions, warningLog, status, error, refresh } = useData()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const totalWarnings = useMemo(
    () => warningLog.reduce((sum, entry) => sum + (entry.count || 0), 0),
    [warningLog],
  )

  const recentPrescriptions = prescriptions.slice(0, 5)
  const weeklyActivity = useWeeklyActivity(prescriptions)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink font-display">{greeting()}, Dr. Rivera</h1>
          <p className="text-muted mt-1.5">Your AI-powered healthcare companion</p>
          <p className="text-sm text-muted mt-3">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}
            {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
        <Link to="/analyzer">
          <Button icon={ScanLine} size="lg">
            Analyze a Prescription
          </Button>
        </Link>
      </div>

      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState description={error} onRetry={refresh} />}

      {status === 'success' && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted px-1">Overview</h2>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Patients" value={patients.length} tone="primary" />
            <StatCard icon={FileCheck2} label="Prescriptions Analyzed" value={prescriptions.length} tone="info" />
            <StatCard icon={ShieldAlert} label="Critical Alerts" value={totalWarnings} tone="critical" />
            <StatCard icon={MapPinned} label="Nearby Pharmacies" value={4} tone="accent" />
          </div>

          {/* Weekly activity chart */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink font-display mb-1">Weekly Activity</h2>
            <p className="text-xs text-muted mb-4">Prescriptions analyzed over the last 7 days</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} className="text-muted" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} width={28} className="text-muted" />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="count" name="Prescriptions" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent activity + quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-ink font-display">Recent Prescriptions</h2>
                <Link to="/history" className="text-xs font-medium text-primary-dark dark:text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recentPrescriptions.length === 0 ? (
                <EmptyState
                  icon={Pill}
                  title="No prescriptions analyzed yet"
                  description="Upload your first prescription to see AI-powered insights here."
                  action={
                    <Link to="/analyzer">
                      <Button size="sm">Get started</Button>
                    </Link>
                  }
                  className="border-0"
                />
              ) : (
                <ul>
                  {recentPrescriptions.map((rx) => {
                    const displayName = formatName(rx.patientName)
                    const meds = rx.medicines || []
                    const shownMeds = meds.slice(0, 2)
                    const extraCount = meds.length - shownMeds.length

                    return (
                      <li key={rx.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(displayName)}`}>
                          {initials(displayName)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink truncate">{displayName}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {shownMeds.map((med, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-surface-alt border border-border px-2 py-0.5 text-[11px] text-muted"
                              >
                                {medicineName(med)}
                              </span>
                            ))}
                            {extraCount > 0 && (
                              <span className="text-[11px] text-muted">+{extraCount} more</span>
                            )}
                            {meds.length === 0 && (
                              <span className="text-[11px] text-muted">No medicines recorded</span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs text-muted shrink-0">{timeAgo(rx.savedAt)}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold text-ink font-display mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/analyzer"
                  className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm transition-all hover:bg-surface-alt hover:border-primary/40 hover:shadow-sm"
                >
                  Analyze new prescription <ArrowRight size={14} className="text-muted" />
                </Link>
                <Link
                  to="/assistant"
                  className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm transition-all hover:bg-surface-alt hover:border-primary/40 hover:shadow-sm"
                >
                  Ask the AI Assistant <ArrowRight size={14} className="text-muted" />
                </Link>
                <Link
                  to="/patients"
                  className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm transition-all hover:bg-surface-alt hover:border-primary/40 hover:shadow-sm"
                >
                  View patient records <ArrowRight size={14} className="text-muted" />
                </Link>
                <Link
                  to="/pharmacy"
                  className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm transition-all hover:bg-surface-alt hover:border-primary/40 hover:shadow-sm"
                >
                  Find nearby pharmacy <ArrowRight size={14} className="text-muted" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}