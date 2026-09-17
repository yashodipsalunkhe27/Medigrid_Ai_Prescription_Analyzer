export default function ChartCard({ title, description, action, children, className = '' }) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-5 shadow-card ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink font-display">{title}</h3>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
