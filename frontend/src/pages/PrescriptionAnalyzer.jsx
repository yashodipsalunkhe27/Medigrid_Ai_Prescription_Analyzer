import { useState } from 'react'
import { ScanLine, Save, RotateCcw, UserRound, ShieldAlert, Sparkles, CalendarDays } from 'lucide-react'
import UploadZone from '../components/prescription/UploadZone'
import PrescriptionViewer from '../components/prescription/PrescriptionViewer'
import MedicineCard from '../components/prescription/MedicineCard'
import WarningList from '../components/prescription/WarningList'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/LoadingSkeleton'
import ErrorState from '../components/ui/ErrorState'
import { extractPrescription, getCriticalWarnings, savePrescription } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import { safe } from '../lib/utils'

const STAGES = {
  idle: null,
  uploading: 'Uploading prescription...',
  extracting: 'Analyzing handwriting and medicines...',
  warnings: 'Checking for interactions and risks...',
  done: 'Completed',
}

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 4000 },
    )
  })
}

export default function PrescriptionAnalyzer() {
  const [file, setFile] = useState(null)
  const [stage, setStage] = useState('idle')
  const [result, setResult] = useState(null) // { patient_info, Prescription_info }
  const [warnings, setWarnings] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const toast = useToast()
  const { refresh, logWarnings } = useData()

  const isBusy = stage !== 'idle' && stage !== 'done'

  async function handleAnalyze() {
    if (!file) return
    setError(null)
    setResult(null)
    setWarnings(null)
    setSaved(false)
    setStage('uploading')

    try {
      const location = await getLocation()
      setStage('extracting')
      const data = await extractPrescription(file, location)
      setResult(data)

      const prescriptionInfo = data?.Prescription_info || []
      if (prescriptionInfo.length > 0) {
        setStage('warnings')
        try {
          const w = await getCriticalWarnings(prescriptionInfo)
          setWarnings(Array.isArray(w) ? w : [])
          logWarnings({
            patientName: data?.patient_info?.patient_name || data?.patient_info?.Name,
            count: (Array.isArray(w) ? w : []).filter(
              (line) => !String(line).toLowerCase().includes('no critical safety issues'),
            ).length,
            createdAt: new Date().toISOString(),
          })
        } catch {
          setWarnings([])
          toast.warning('Prescription analyzed, but safety-warning check failed. You can retry it below.')
        }
      } else {
        setWarnings([])
      }
      setStage('done')
    } catch (err) {
      setError(err.message || 'Unable to analyze this prescription. Please try again.')
      setStage('idle')
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    try {
      await savePrescription(result)
      toast.success('Prescription saved to patient records.')
      setSaved(true)
      refresh()
    } catch (err) {
      toast.error(err.message || 'Unable to save this prescription. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setFile(null)
    setStage('idle')
    setResult(null)
    setWarnings(null)
    setError(null)
    setSaved(false)
  }

  const patientInfo = result?.patient_info || {}
  const medicines = result?.Prescription_info || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink font-display">Prescription Analyzer</h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Upload or enter prescription details to check medicines, dosage, drug interactions, allergies, and AI
          insights.
        </p>
      </div>

      {!result && (
        <div className="rounded-lg border border-border bg-surface p-6 max-w-2xl">
          <UploadZone file={file} onSelect={setFile} onClear={() => setFile(null)} disabled={isBusy} />

          {error && <ErrorState className="mt-4" title="Analysis failed" description={error} onRetry={handleAnalyze} />}

          <div className="mt-5 flex items-center gap-3">
            <Button icon={ScanLine} onClick={handleAnalyze} disabled={!file} loading={isBusy}>
              {isBusy ? STAGES[stage] : 'Analyze Prescription'}
            </Button>
            {file && !isBusy && (
              <Button variant="ghost" onClick={handleReset}>
                Cancel
              </Button>
            )}
          </div>

          {isBusy && (
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{
                    width: stage === 'uploading' ? '30%' : stage === 'extracting' ? '65%' : '90%',
                  }}
                />
              </div>
              <p className="text-xs text-muted mt-2">{STAGES[stage]}</p>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PrescriptionViewer file={file} />
            <div className="flex gap-2">
              <Button variant="secondary" icon={RotateCcw} onClick={handleReset}>
                Analyze another
              </Button>
              <Button icon={Save} onClick={handleSave} loading={saving} disabled={saved}>
                {saved ? 'Saved' : 'Save to Records'}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Patient info */}
            <section className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold text-ink font-display flex items-center gap-2 mb-3.5">
                <UserRound size={16} className="text-primary" /> Patient Information
              </h2>
              <dl className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Name</dt>
                  <dd className="text-ink font-medium mt-0.5">
                    {safe(patientInfo.patient_name || patientInfo.Name)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Age</dt>
                  <dd className="text-ink font-medium mt-0.5">{safe(patientInfo.age || patientInfo.Age)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted flex items-center gap-1">
                    <CalendarDays size={11} /> Date
                  </dt>
                  <dd className="text-ink font-medium mt-0.5">{safe(patientInfo.Date || patientInfo.date)}</dd>
                </div>
              </dl>
            </section>

            {/* Medicines */}
            <section>
              <h2 className="text-sm font-semibold text-ink font-display mb-3">
                Medicines {medicines.length > 0 && <span className="text-muted font-normal">({medicines.length})</span>}
              </h2>
              {medicines.length === 0 ? (
                <p className="text-sm text-muted rounded-lg border border-dashed border-border p-4">
                  No medicines were detected in this prescription.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {medicines.map((m, i) => (
                    <MedicineCard key={i} medicine={m} />
                  ))}
                </div>
              )}
            </section>

            {/* AI Summary + warnings */}
            <section>
              <h2 className="text-sm font-semibold text-ink font-display mb-3 flex items-center gap-2">
                <ShieldAlert size={16} className="text-critical" /> Critical Warnings
              </h2>
              {warnings === null ? (
                <SkeletonCard />
              ) : (
                <WarningList warnings={warnings} />
              )}
            </section>

            <section className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted leading-relaxed">
                AI Summary: this analysis is generated automatically from the uploaded image and should be reviewed
                by a licensed clinician before acting on it. Always confirm dosage and interaction findings against
                the original prescription.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
