import { cn } from '../../lib/utils'

const COLOR_MAP = {
  primary: 'bg-primary/10 text-primary-dark dark:text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  critical: 'bg-critical/10 text-critical',
  info: 'bg-info/10 text-info',
  neutral: 'bg-surface-alt text-muted',
}

export default function Badge({ color = 'neutral', icon: Icon, children, className, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none',
        COLOR_MAP[color] || COLOR_MAP.neutral,
        className,
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-primary': color === 'primary',
            'bg-success': color === 'success',
            'bg-warning': color === 'warning',
            'bg-critical': color === 'critical',
            'bg-info': color === 'info',
            'bg-muted': color === 'neutral',
          })}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}
