import { AlertOctagon, RotateCw } from 'lucide-react'
import Button from './Button'
import { cn } from '../../lib/utils'

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center py-14 px-6 rounded-lg border border-critical/20 bg-critical-bg',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-critical/10 text-critical">
        <AlertOctagon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-ink font-display">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" icon={RotateCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
