import { cn } from '../../lib/utils'

export function SkeletonLine({ className }) {
  return <div className={cn('skeleton rounded-md h-3.5', className)} />
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-5 space-y-3', className)}>
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="w-2/3 h-6" />
      <SkeletonLine className="w-1/2" />
    </div>
  )
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <SkeletonLine className="w-full" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  )
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
