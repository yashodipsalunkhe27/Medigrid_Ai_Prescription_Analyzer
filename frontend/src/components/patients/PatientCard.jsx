import { Link } from 'react-router-dom'
import { Pill, CalendarClock, ChevronRight } from 'lucide-react'
import Badge from '../ui/Badge'
import { initials, timeAgo } from '../../lib/utils'

const RISK_COLOR = { high: 'critical', medium: 'warning', low: 'success' }
const RISK_LABEL = { high: 'High risk', medium: 'Medium risk', low: 'Low risk' }

export default function PatientCard({ patient }) {
  return (
    <Link
      to={`/patients/${encodeURIComponent(patient.id)}`}
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 hover:shadow-card-hover hover:border-primary/30 transition-all"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary text-sm font-semibold">
        {initials(patient.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink truncate">{patient.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Pill size={12} /> {patient.prescriptions.length} prescription{patient.prescriptions.length === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock size={12} /> {timeAgo(patient.lastVisit)}
          </span>
        </div>
      </div>
      <Badge color={RISK_COLOR[patient.riskLevel]}>{RISK_LABEL[patient.riskLevel]}</Badge>
      <ChevronRight size={16} className="text-muted shrink-0" aria-hidden="true" />
    </Link>
  )
}
