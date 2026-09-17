import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pill, ShieldAlert, CalendarClock, FileCheck2, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import { initials, timeAgo, formatDateTime } from '../lib/utils'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonCard } from '../components/ui/LoadingSkeleton'
import MedicineCard from '../components/prescription/MedicineCard'

const RISK_COLOR = { high: 'critical', medium: 'warning', low: 'success' }
const RISK_LABEL = { high: 'High risk', medium: 'Medium risk', low: 'Low risk' }

export default function PatientProfile() {
  const { patientId } = useParams()
  const { patients, status, error, refresh } = useData()

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (status === 'error') {
    return <ErrorState description={error} onRetry={refresh} />
  }

  const patient = patients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <EmptyState
        icon={Pill}
        title="Patient not found"
        description="This patient record may have been removed or the link is out of date."
        action={
          <Link to="/patients" className="text-sm font-medium text-primary-dark dark:text-primary hover:underline">
            Back to Patients
          </Link>
        }
      />
    )
  }

  const totalMedicines = patient.prescriptions.reduce((sum, rx) => sum + rx.medicines.length, 0)

  return (
    <div className="space-y-6">
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} /> Back to Patients
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xl font-semibold">
          {initials(patient.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-ink font-display">{patient.name}</h1>
            <Badge color={RISK_COLOR[patient.riskLevel]}>{RISK_LABEL[patient.riskLevel]}</Badge>
          </div>
          <p className="text-sm text-muted mt-1">Last visit {timeAgo(patient.lastVisit)}</p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <FileCheck2 size={16} className="text-primary mb-2" />
          <p className="text-lg font-semibold text-ink font-display">{patient.prescriptions.length}</p>
          <p className="text-xs text-muted">Total prescriptions</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <Pill size={16} className="text-accent mb-2" />
          <p className="text-lg font-semibold text-ink font-display">{totalMedicines}</p>
          <p className="text-xs text-muted">Active medications</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <ShieldAlert size={16} className="text-critical mb-2" />
          <p className="text-lg font-semibold text-ink font-display">—</p>
          <p className="text-xs text-muted">Warnings logged</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <CalendarClock size={16} className="text-warning mb-2" />
          <p className="text-sm font-semibold text-ink font-display">{timeAgo(patient.lastVisit)}</p>
          <p className="text-xs text-muted">Last visit</p>
        </div>
      </div>

      {/* AI safety summary */}
      <section className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          AI Safety Summary: this patient has {patient.prescriptions.length} recorded prescription
          {patient.prescriptions.length === 1 ? '' : 's'} totalling {totalMedicines} medicine
          {totalMedicines === 1 ? '' : 's'}. Detailed interaction and dosage warnings are generated at the time each
          prescription is analyzed — see Critical Warnings for the latest findings.
        </p>
      </section>

      {/* Medication timeline / prescription history */}
      <section id="history">
        <h2 className="text-sm font-semibold text-ink font-display mb-3">Prescription History</h2>
        {patient.prescriptions.length === 0 ? (
          <EmptyState icon={Pill} title="No prescriptions recorded" />
        ) : (
          <div className="space-y-4">
            {patient.prescriptions.map((rx) => (
              <div key={rx.id} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <p className="text-sm font-medium text-ink">{formatDateTime(rx.savedAt)}</p>
                  <Badge color="neutral">
                    {rx.medicines.length} medicine{rx.medicines.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {rx.medicines.map((m, i) => (
                    <MedicineCard key={i} medicine={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
