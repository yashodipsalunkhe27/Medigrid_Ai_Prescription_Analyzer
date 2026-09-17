import { Pill, Clock, CalendarDays, Info } from 'lucide-react'
import { safe } from '../../lib/utils'

export default function MedicineCard({ medicine }) {
  const name = safe(medicine.medications || medicine.name)
  const dosage = safe(medicine.Dosage || medicine.dosage)
  const frequency = safe(medicine.Frequency || medicine.frequency)
  const duration = safe(medicine.Duration || medicine.duration)

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-dark dark:text-primary">
          <Pill size={17} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink font-display">{name}</p>
          <p className="text-xs text-muted mt-0.5">{dosage}</p>
        </div>
      </div>
      <dl className="mt-3.5 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-start gap-1.5">
          <Clock size={13} className="text-muted mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted">Frequency</dt>
            <dd className="text-ink font-medium mt-0.5">{frequency}</dd>
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <CalendarDays size={13} className="text-muted mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted">Duration</dt>
            <dd className="text-ink font-medium mt-0.5">{duration}</dd>
          </div>
        </div>
      </dl>
      {medicine.instructions && (
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted border-t border-border pt-3">
          <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
          {safe(medicine.instructions)}
        </p>
      )}
    </div>
  )
}
