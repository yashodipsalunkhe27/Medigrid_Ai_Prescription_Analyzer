import { cn } from '../../lib/utils'

/**
 * Thin, reusable table shell: horizontal scroll on small screens (per the
 * brief) with consistent header/row styling. Pages compose <thead>/<tbody>
 * themselves so column sets can differ (Patients, History, etc.).
 */
export default function DataTable({ children, className }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className={cn('w-full min-w-[720px] text-sm', className)}>{children}</table>
    </div>
  )
}

export function Th({ children, className }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-muted border-b border-border bg-surface-alt/60',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }) {
  return <td className={cn('px-4 py-3.5 text-ink align-middle', className)}>{children}</td>
}

export function Tr({ children, className, ...props }) {
  return (
    <tr className={cn('border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors', className)} {...props}>
      {children}
    </tr>
  )
}
