import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import ChartCard from '../components/ui/ChartCard'
import EmptyState from '../components/ui/EmptyState'
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { useData } from '../context/DataContext'
import { parseTimestamp } from '../lib/utils'

const RANGES = ['Daily', 'Weekly', 'Monthly', 'Yearly']

const COLORS = ['#0F9D94', '#2563EB', '#F59E0B', '#DC2626', '#64748B']

const TOOLTIP_STYLE = { borderRadius: 8, fontSize: 12, border: '1px solid var(--color-border)' }

// Caps how wide a single bar can get so a chart with only one data
// point never balloons into a giant block filling the whole plot.
const MAX_BAR_SIZE = 56

function bucketKey(date, range) {
  if (range === 'Daily') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (range === 'Weekly') {
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    return `Wk of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }
  if (range === 'Monthly') return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  return date.getFullYear().toString()
}

// % change from the first to the last real bucket. Returns null when
// there isn't enough data yet, so we never fabricate a trend badge.
function trendDelta(series, key) {
  if (!series || series.length < 2) return null
  const first = series[0][key]
  const last = series[series.length - 1][key]
  if (!first) return null
  const pct = Math.round(((last - first) / first) * 100)
  return pct
}

function TrendBadge({ pct }) {
  if (pct === null || pct === undefined || pct === 0) return null
  const up = pct > 0
  const Icon = up ? TrendingUp : TrendingDown
  const tone = up ? 'text-primary-dark dark:text-primary' : 'text-red-600 dark:text-red-400'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone}`}>
      <Icon size={12} />
      {Math.abs(pct)}%
    </span>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted">
      {label}
    </div>
  )
}

export default function Analytics() {
  const { prescriptions, patients, warningLog } = useData()
  const [range, setRange] = useState('Monthly')

  const activityData = useMemo(() => {
    const buckets = new Map()
    prescriptions.forEach((rx) => {
      const d = parseTimestamp(rx.savedAt)
      if (!d) return
      const key = bucketKey(d, range)
      buckets.set(key, (buckets.get(key) || 0) + 1)
    })
    return Array.from(buckets.entries())
      .map(([name, prescriptions]) => ({ name, prescriptions }))
      .slice(-12)
  }, [prescriptions, range])

  const patientGrowth = useMemo(() => {
    const buckets = new Map()
    let running = 0
    const sorted = [...patients].sort((a, b) => new Date(a.lastVisit) - new Date(b.lastVisit))
    sorted.forEach((p) => {
      const d = parseTimestamp(p.lastVisit)
      if (!d) return
      running += 1
      buckets.set(bucketKey(d, range), running)
    })
    return Array.from(buckets.entries()).map(([name, patients]) => ({ name, patients })).slice(-12)
  }, [patients, range])

  const warningTrend = useMemo(() => {
    const buckets = new Map()
    warningLog.forEach((entry) => {
      const d = parseTimestamp(entry.createdAt)
      if (!d) return
      const key = bucketKey(d, range)
      buckets.set(key, (buckets.get(key) || 0) + (entry.count || 0))
    })
    return Array.from(buckets.entries()).map(([name, warnings]) => ({ name, warnings })).slice(-12)
  }, [warningLog, range])

  const medicineUsage = useMemo(() => {
    const counts = new Map()
    prescriptions.forEach((rx) => {
      rx.medicines.forEach((m) => {
        const name = m.name || 'Unknown'
        counts.set(name, (counts.get(name) || 0) + 1)
      })
    })
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [prescriptions])

  const riskDistribution = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 }
    patients.forEach((p) => {
      if (p.riskLevel === 'high') counts.High += 1
      else if (p.riskLevel === 'medium') counts.Medium += 1
      else counts.Low += 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((entry) => entry.value > 0)
  }, [patients])

  const totalRiskPatients = riskDistribution.reduce((sum, e) => sum + e.value, 0)

  const hasData = prescriptions.length > 0
  const activityTrend = trendDelta(activityData, 'prescriptions')
  const patientTrend = trendDelta(patientGrowth, 'patients')

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink font-display">Reports & Analytics</h1>
          <p className="text-sm text-muted mt-1">Trends derived from your saved prescriptions and safety checks.</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                range === r ? 'bg-primary text-white border-primary' : 'border-border text-muted hover:text-ink hover:bg-surface-alt'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Save at least one prescription to see activity trends, medicine usage, and risk distribution."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard
            title="Prescription Activity"
            description="Prescriptions analyzed over time"
            action={<TrendBadge pct={activityTrend} />}
          >
            {activityData.length === 0 ? (
              <EmptyChart label="No prescription activity in this range yet." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F9D94" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F9D94" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="prescriptions" stroke="#0F9D94" fill="url(#colorRx)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Patient Growth"
            description="Cumulative patients on file"
            action={<TrendBadge pct={patientTrend} />}
          >
            {patientGrowth.length === 0 ? (
              <EmptyChart label="No patient growth data in this range yet." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Critical Warning Trends" description="Flags raised during safety checks">
            {warningTrend.length === 0 ? (
              <EmptyChart label="No critical warnings recorded in this range." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={warningTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="warnings" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={MAX_BAR_SIZE} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Medicine Usage" description="Most frequently prescribed medicines">
            {medicineUsage.length === 0 ? (
              <EmptyChart label="No medicine usage data yet." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={medicineUsage} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" fill="#0F9D94" radius={[0, 4, 4, 0]} maxBarSize={MAX_BAR_SIZE} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Risk Distribution" description="Patients grouped by prescription-volume risk" className="lg:col-span-2">
            {riskDistribution.length === 0 ? (
              <EmptyChart label="No patients to assess risk for yet." />
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                        {riskDistribution.map((entry, i) => (
                          <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(value, name) => [`${value} (${Math.round((value / totalRiskPatients) * 100)}%)`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-ink font-display">{totalRiskPatients}</span>
                    <span className="text-xs text-muted">patients</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:w-1/2">
                  {riskDistribution.map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-ink">{entry.name} risk</span>
                      </span>
                      <span className="text-muted">
                        {entry.value} ({Math.round((entry.value / totalRiskPatients) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  )
}