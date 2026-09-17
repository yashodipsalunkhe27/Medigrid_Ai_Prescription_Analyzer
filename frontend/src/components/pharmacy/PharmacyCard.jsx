import { MapPin, Navigation, Clock } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function PharmacyCard({ pharmacy, mapLink }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-dark dark:text-primary">
            <MapPin size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{pharmacy.name}</p>
            <p className="text-xs text-muted mt-0.5 truncate">{pharmacy.address}</p>
          </div>
        </div>
        <Badge color={pharmacy.open ? 'success' : 'neutral'} dot>
          {pharmacy.open ? 'Open now' : 'Closed'}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Navigation size={12} /> {pharmacy.distance}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {pharmacy.hours}
        </span>
      </div>
      <div className="flex gap-2 mt-1">
        <a href={mapLink} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            Directions
          </Button>
        </a>
        <a href={mapLink} target="_blank" rel="noreferrer" className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View Pharmacy
          </Button>
        </a>
      </div>
    </div>
  )
}
