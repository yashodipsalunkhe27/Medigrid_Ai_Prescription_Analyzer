import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
        <Compass size={24} />
      </div>
      <h1 className="text-lg font-semibold text-ink font-display">Page not found</h1>
      <p className="text-sm text-muted mt-1.5 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-5">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
