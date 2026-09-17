import { Link } from 'react-router-dom'
import { ShieldAlert, Trash2, ScanLine, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { useData } from '../context/DataContext'
import { formatName, timeAgo } from '../lib/utils'

export default function Warnings() {
  const { warningLog, clearWarningLog } = useData()
  const [confirmClear, setConfirmClear] = useState(false)

  const totalFlags = warningLog.reduce((sum, e) => sum + (e.count || 0), 0)
  const clean = warningLog.filter((e) => (e.count || 0) === 0).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink font-display">Critical Warnings</h1>
          <p className="text-sm text-muted mt-1">
            A running log of AI safety checks performed during prescription analysis this session.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/analyzer">
            <Button icon={ScanLine} size="sm">
              Run New Check
            </Button>
          </Link>
          {warningLog.length > 0 && (
            <Button variant="secondary" size="sm" icon={Trash2} onClick={() => setConfirmClear(true)}>
              Clear Log
            </Button>
          )}
        </div>
      </div>

      {warningLog.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-lg font-semibold text-ink font-display">{warningLog.length}</p>
            <p className="text-xs text-muted">Checks run</p>
          </div>
          <div className="rounded-lg border border-critical/20 bg-critical-bg p-4">
            <p className="text-lg font-semibold text-critical font-display">{totalFlags}</p>
            <p className="text-xs text-muted">Flags raised</p>
          </div>
          <div className="rounded-lg border border-success/20 bg-success-bg p-4">
            <p className="text-lg font-semibold text-success font-display">{clean}</p>
            <p className="text-xs text-muted">Clean results</p>
          </div>
        </div>
      )}

      {warningLog.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No safety checks logged yet"
          description="Every time you analyze a prescription, MediGrid AI checks it for interactions, dosage issues, and data gaps. Results will appear here."
          action={
            <Link to="/analyzer">
              <Button size="sm">Analyze a prescription</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {warningLog.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                  entry.count > 0 ? 'bg-critical/10 text-critical' : 'bg-success/10 text-success'
                }`}
              >
                {entry.count > 0 ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{formatName(entry.patientName)}</p>
                <p className="text-xs text-muted mt-0.5">{timeAgo(entry.createdAt)}</p>
              </div>
              <Badge color={entry.count > 0 ? 'critical' : 'success'}>
                {entry.count > 0 ? `${entry.count} flag${entry.count === 1 ? '' : 's'}` : 'All clear'}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          clearWarningLog()
          setConfirmClear(false)
        }}
        title="Clear the warning log?"
        description="This removes the local log of safety checks on this device. It doesn't affect saved patient records."
        confirmLabel="Clear log"
        danger
      />
    </div>
  )
}
