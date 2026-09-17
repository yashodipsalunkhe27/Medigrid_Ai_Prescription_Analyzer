import { useCallback, useRef, useState } from 'react'
import { UploadCloud, FileImage, FileText, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const MAX_SIZE_MB = 15

export default function UploadZone({ file, onSelect, onClear, disabled }) {
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const inputRef = useRef(null)

  const validate = useCallback((f) => {
    if (!f) return 'No file selected.'
    if (!ACCEPTED.includes(f.type)) return 'Unsupported file type. Please upload a JPG, PNG, or PDF.'
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`
    return null
  }, [])

  const handleFiles = useCallback(
    (fileList) => {
      const f = fileList?.[0]
      const err = validate(f)
      setValidationError(err)
      if (!err) onSelect(f)
    },
    [onSelect, validate],
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragActive(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles, disabled],
  )

  if (file) {
    const isPdf = file.type === 'application/pdf'
    const previewUrl = isPdf ? null : URL.createObjectURL(file)
    return (
      <div className="rounded-lg border border-border bg-surface-alt/40 p-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-surface border border-border overflow-hidden">
          {isPdf ? (
            <FileText size={22} className="text-primary" />
          ) : (
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{file.name}</p>
          <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button
          onClick={onClear}
          disabled={disabled}
          aria-label="Remove file"
          className="shrink-0 text-muted hover:text-critical p-1.5 rounded-md hover:bg-critical/10 transition-colors disabled:opacity-40"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        aria-disabled={disabled}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-surface-alt/40',
          disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <UploadCloud size={22} aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-ink">
          <span className="text-primary-dark dark:text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted mt-1">JPG, PNG, or PDF — up to {MAX_SIZE_MB}MB</p>
        <div className="flex items-center gap-3 mt-4 text-muted">
          <FileImage size={16} aria-hidden="true" />
          <FileText size={16} aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Upload prescription file"
        />
      </div>
      {validationError && <p className="mt-2 text-sm text-critical">{validationError}</p>}
    </div>
  )
}
