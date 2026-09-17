import { useEffect, useState } from 'react'
import { MapPin, LocateFixed, ExternalLink, Navigation } from 'lucide-react'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

function buildMapLink(lat, lng) {
  const query = encodeURIComponent('nearby pharmacies')
  return `https://www.google.com/maps/search/${query}/@${lat},${lng},15z`
}

const PLACEHOLDER_CARDS = [
  { label: 'Pharmacies within 1 km', hint: 'Closest results' },
  { label: 'Pharmacies within 3 km', hint: 'Wider search radius' },
  { label: '24-hour pharmacies nearby', hint: 'Open around the clock' },
]

export default function Pharmacy() {
  const [status, setStatus] = useState('idle') // idle | requesting | granted | denied
  const [coords, setCoords] = useState(null)

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setStatus('granted')
      },
      () => setStatus('denied'),
      { timeout: 6000 },
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  const mapLink = coords ? buildMapLink(coords.latitude, coords.longitude) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink font-display">Pharmacy & Location</h1>
        <p className="text-sm text-muted mt-1">Find pharmacies near your current location.</p>
      </div>

      {/* Location card */}
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-dark dark:text-primary">
          <LocateFixed size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink">Current Location</p>
          <p className="text-xs text-muted mt-0.5">
            {status === 'idle' && 'Waiting for permission...'}
            {status === 'requesting' && 'Requesting your location...'}
            {status === 'granted' && `Location enabled · ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`}
            {status === 'denied' && 'Location permission denied or unavailable. You can search manually in Maps instead.'}
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={Navigation} onClick={requestLocation}>
          {status === 'granted' ? 'Refresh location' : 'Enable location'}
        </Button>
      </div>

      {/* Nearby pharmacies */}
      <section>
        <h2 className="text-sm font-semibold text-ink font-display mb-3">Nearby Pharmacies</h2>

        {!coords ? (
          <EmptyState
            icon={MapPin}
            title="Location needed"
            description="Enable location access to search for pharmacies near you."
            action={
              <Button size="sm" onClick={requestLocation}>
                Enable location
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLACEHOLDER_CARDS.map((card) => (
              <div key={card.label} className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-dark dark:text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{card.label}</p>
                    <p className="text-xs text-muted mt-0.5">{card.hint}</p>
                  </div>
                </div>
                <a href={mapLink} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm" icon={ExternalLink} className="w-full">
                    Open in Google Maps
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted mt-4 max-w-xl">
          Pharmacy names, hours, and exact distances come from Google Maps directly — MediGrid AI generates a
          location-aware search link (the same one attached to each analyzed prescription) rather than storing its
          own pharmacy directory.
        </p>
      </section>
    </div>
  )
}
