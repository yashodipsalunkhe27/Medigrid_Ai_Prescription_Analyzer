import { useMemo, useState } from 'react'
import { Users, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/ui/SearchBar'
import Button from '../components/ui/Button'
import PatientTable from '../components/patients/PatientTable'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonGrid } from '../components/ui/LoadingSkeleton'
import { useData } from '../context/DataContext'

const RISK_FILTERS = ['All', 'High', 'Medium', 'Low']

export default function Patients() {
  const { patients, status, error, refresh } = useData()
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('All')

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      const matchesRisk = risk === 'All' || p.riskLevel === risk.toLowerCase()
      return matchesQuery && matchesRisk
    })
  }, [patients, query, risk])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink font-display">Patients</h1>
          <p className="text-sm text-muted mt-1">{patients.length} patients on file</p>
        </div>
        <Link to="/analyzer">
          <Button icon={ScanLine} size="sm">
            New Analysis
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search patients..." className="sm:max-w-xs" />
        <div className="flex gap-1.5 flex-wrap">
          {RISK_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                risk === r
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-muted hover:text-ink hover:bg-surface-alt'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && <SkeletonGrid count={6} />}
      {status === 'error' && <ErrorState description={error} onRetry={refresh} />}

      {status === 'success' &&
        (filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={patients.length === 0 ? 'No patients yet' : 'No patients match your search'}
            description={
              patients.length === 0
                ? 'Analyze and save your first prescription to start building patient records.'
                : 'Try adjusting your search or filters.'
            }
            action={
              patients.length === 0 && (
                <Link to="/analyzer">
                  <Button size="sm">Analyze a prescription</Button>
                </Link>
              )
            }
          />
        ) : (
          <PatientTable patients={filtered} />
        ))}
    </div>
  )
}
