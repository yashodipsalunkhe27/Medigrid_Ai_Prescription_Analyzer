import { useMemo, useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download, Minimize2, FileText } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

export default function PrescriptionViewer({ file }) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  const isPdf = file?.type === 'application/pdf'

  const handleDownload = () => {
    if (!url || !file) return
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
  }

  return (
    <div className={cn('rounded-lg border border-border bg-surface flex flex-col', fullscreen && 'fixed inset-4 z-50 shadow-popover')}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="text-sm font-medium text-ink">Prescription Image</p>
        <div className="flex items-center gap-0.5">
          <Button variant="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} aria-label="Zoom out">
            <ZoomOut size={16} />
          </Button>
          <span className="text-xs text-muted w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <Button variant="icon" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} aria-label="Zoom in">
            <ZoomIn size={16} />
          </Button>
          <Button variant="icon" onClick={() => setRotation((r) => (r + 90) % 360)} aria-label="Rotate image">
            <RotateCw size={16} />
          </Button>
          <Button variant="icon" onClick={handleDownload} aria-label="Download file" disabled={!file}>
            <Download size={16} />
          </Button>
          <Button
            variant="icon"
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? 'Exit fullscreen' : 'View fullscreen'}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center bg-surface-alt/40 p-6 min-h-[320px]">
        {!file ? (
          <p className="text-sm text-muted">No image to preview yet.</p>
        ) : isPdf ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-3 text-primary hover:underline"
          >
            <FileText size={48} />
            <span className="text-sm">Open PDF in new tab</span>
          </a>
        ) : (
          <img
            src={url}
            alt="Uploaded prescription"
            className="max-w-full transition-transform duration-150 rounded-md shadow-card"
            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
          />
        )}
      </div>
    </div>
  )
}
