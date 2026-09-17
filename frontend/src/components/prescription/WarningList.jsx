import { ShieldCheck } from 'lucide-react'
import WarningCard from './WarningCard'
import EmptyState from '../ui/EmptyState'
import { parseWarningLine } from '../../lib/utils'

/** `warnings` is the raw array of strings returned by POST /critical_warnings. */
export default function WarningList({ warnings, dismissible = true }) {
  const lines = (warnings || []).map((w) => String(w || '').trim()).filter(Boolean)

  const isAllClear =
    lines.length === 0 ||
    (lines.length === 1 && lines[0].toLowerCase().includes('no critical safety issues found'))

  if (isAllClear) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No critical safety issues found"
        description="The AI didn't detect any interactions, dosage issues, or data gaps in this prescription."
      />
    )
  }

  const parsed = lines.map(parseWarningLine)

  return (
    <div className="space-y-3">
      {parsed.map((w, i) => (
        <WarningCard key={i} severity={w.severity} tag={w.tag} text={w.text} onDismiss={dismissible ? undefined : false} />
      ))}
    </div>
  )
}
