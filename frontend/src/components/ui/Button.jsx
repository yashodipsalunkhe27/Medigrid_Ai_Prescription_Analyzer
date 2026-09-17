import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-sm disabled:bg-primary/50',
  secondary:
    'bg-surface text-ink border border-border hover:bg-surface-alt disabled:opacity-50',
  danger:
    'bg-critical text-white hover:brightness-95 shadow-sm disabled:opacity-50',
  ghost:
    'bg-transparent text-ink hover:bg-surface-alt disabled:opacity-50',
  icon:
    'bg-transparent text-muted hover:text-ink hover:bg-surface-alt rounded-full p-2',
}

const SIZES = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
}

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className,
    children,
    ...props
  },
  ref,
) {
  const isIcon = variant === 'icon'
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:cursor-not-allowed select-none',
        !isIcon && 'rounded-md',
        VARIANTS[variant],
        !isIcon && SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={16} aria-hidden="true" />
      )}
      {!isIcon && children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={16} aria-hidden="true" />}
    </button>
  )
})

export default Button
