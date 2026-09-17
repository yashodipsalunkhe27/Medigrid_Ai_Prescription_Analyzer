import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, Eye, Download, Trash2, ChevronLeft, ChevronRight, ScanLine } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonTable } from '../components/ui/LoadingSkeleton'
import DataTable, { Th, Td, Tr } from '../components/ui/DataTable'
import MedicineCard from '../components/prescription/MedicineCard'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { formatDate, formatDateTime } from '../lib/utils'

const PAGE_SIZE = 8
const RISK_COLOR = { high: 'critical', medium: 'warning', low: 'success' }

function riskFor(count) {
  if (count >= 6) return 'high'
  if (count >= 3) return 'medium'
  return 'low'
}

export default function HistoryPage() {
  const { prescriptions, status, error, refresh } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)
  const [hidden, setHidden] = useState(() => new Set())
  const [toDelete, setToDelete] = useState(null)

  const filtered = useMemo(() => {
    let list = prescriptions.filter((rx) => !hidden.has(rx.id))
    if (query) {
      list = list.filter((rx) => rx.patientName.toLowerCase().includes(query.toLowerCase()))
    }
    list = [...list].sort((a, b) =>
      sort === 'newest' ? new Date(b.savedAt) - new Date(a.savedAt) : new Date(a.savedAt) - new Date(b.savedAt),
    )
    return list
  }, [prescriptions, query, sort, hidden])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDownload(rx) {
    const blob = new Blob([JSON.stringify(rx, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rx.patientName.replace(/\s+/g, '_')}_${rx.savedAt || 'prescription'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function confirmDelete() {
    setHidden((prev) => new Set(prev).add(toDelete.id))
    toast.success('Removed from this view. Records remain in the database.')
    setToDelete(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink font-display">Prescription History</h1>
          <p className="text-sm text-muted mt-1">{filtered.length} records</p>
        </div>
        <Link to="/analyzer">
          <Button icon={ScanLine} size="sm">
            New Analysis
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by patient name..." className="sm:max-w-xs" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort prescriptions"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {status === 'loading' && <SkeletonTable rows={6} cols={6} />}
      {status === 'error' && <ErrorState description={error} onRetry={refresh} />}

      {status === 'success' &&
        (filtered.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No prescription history yet"
            description="Prescriptions you save from the analyzer will show up here."
          />
        ) : (
          <>
            <DataTable>
              <thead>
                <tr>
                  <Th>Patient</Th>
                  <Th>Medicines</Th>
                  <Th>Risk</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paged.map((rx) => (
                  <Tr key={rx.id}>
                    <Td className="font-medium">{rx.patientName}</Td>
                    <Td className="text-muted">{rx.medicines.length}</Td>
                    <Td>
                      <Badge color={RISK_COLOR[riskFor(rx.medicines.length)]}>
                        {riskFor(rx.medicines.length) === 'high' ? 'High' : riskFor(rx.medicines.length) === 'medium' ? 'Medium' : 'Low'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge color="success" dot>
                        Saved
                      </Badge>
                    </Td>
                    <Td className="text-muted whitespace-nowrap">{formatDate(rx.savedAt)}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="icon" aria-label="View details" onClick={() => setViewing(rx)}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="icon" aria-label="Download record" onClick={() => handleDownload(rx)}>
                          <Download size={16} />
                        </Button>
                        <Button variant="icon" aria-label="Delete record" onClick={() => setToDelete(rx)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </DataTable>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronRight}
                  iconPosition="right"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ))}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.patientName}
        description={viewing ? formatDateTime(viewing.savedAt) : ''}
        size="lg"
      >
        {viewing && (
          <div className="grid sm:grid-cols-2 gap-3">
            {viewing.medicines.map((m, i) => (
              <MedicineCard key={i} medicine={m} />
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove this record from view?"
        description="This hides the record from your History view for this session. The backend does not yet expose a delete endpoint, so the underlying database entry is not removed."
        confirmLabel="Remove"
        danger
      />
    </div>
  )
}
