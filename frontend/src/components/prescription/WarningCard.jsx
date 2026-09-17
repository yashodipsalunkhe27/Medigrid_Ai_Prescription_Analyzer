import { useState } from 'react'
import { AlertTriangle, ShieldAlert, HelpCircle, Info, ChevronDown, X } from 'lucide-react'
import Badge from '../ui/Badge'
import { cn, SEVERITY_META } from '../../lib/utils'

const ICONS = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: AlertTriangle,
  low: HelpCircle,
  info: Info,
}

const CARD_TONE = {
  critical: 'border-critical/30 bg-critical-bg',
  high: 'border-warning/30 bg-warning-bg',
  medium: 'border-warning/30 bg-warning-bg',
  low: 'border-info/30 bg-info-bg',
  info: 'border-success/30 bg-success-bg',
}

/**
 * `warning` is a raw string from /critical_warnings, e.g.
 * "[INTERACTION]: Metformin + Aspirin: Potential interaction detected."
 */
export default function WarningCard({ severity, tag, text, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const meta = SEVERITY_META[severity] || SEVERITY_META.medium
  const Icon = ICONS[severity] || AlertTriangle

  if (dismissed) return null

  const isLong = text.length > 140

  return (
    <div className={cn('rounded-lg border p-4', CARD_TONE[severity] || CARD_TONE.medium)}>
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          className="shrink-0 mt-0.5"
          style={{ color: `var(--color-${meta.color})` }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color={meta.color}>{meta.label}</Badge>
            {tag && <span className="text-xs font-medium text-muted">{tag}</span>}
          </div>
          <p className={cn('text-sm text-ink mt-1.5', !expanded && isLong && 'line-clamp-2')}>{text}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary-dark dark:text-primary hover:underline"
            >
              {expanded ? 'Show less' : 'View details'}
              <ChevronDown size={12} className={cn('transition-transform', expanded && 'rotate-180')} />
            </button>
          )}
        </div>
        {onDismiss !== false && (
          <button
            onClick={() => {
              setDismissed(true)
              onDismiss?.()
            }}
            aria-label="Dismiss warning"
            className="shrink-0 text-muted hover:text-ink p-1 rounded hover:bg-black/5"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
