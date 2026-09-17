import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function StatCard({ icon: Icon, label, value, change, changeLabel, tone = 'primary' }) {
  const isPositive = typeof change === 'number' && change >= 0
  const hasChange = typeof change === 'number'

  const toneClasses = {
    primary: 'bg-primary/10 text-primary-dark dark:text-primary',
    critical: 'bg-critical/10 text-critical',
    info: 'bg-info/10 text-info',
    accent: 'bg-accent/10 text-accent',
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', toneClasses[tone])}>
          <Icon size={18} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-ink font-display tabular-nums">{value}</span>
      </div>
      {hasChange && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              isPositive ? 'text-success' : 'text-critical',
            )}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {isPositive ? '+' : ''}
            {change}%
          </span>
          <span className="text-muted">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}
