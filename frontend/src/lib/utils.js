import clsx from 'clsx'

export function cn(...args) {
  return clsx(...args)
}

/** Returns a display-safe string, never "undefined", "null", "NaN", or "nan". */
export function safe(value, fallback = 'Not provided') {
  if (value === undefined || value === null) return fallback
  const str = String(value).trim()
  if (!str || ['undefined', 'null', 'nan', 'n/a'].includes(str.toLowerCase())) {
    return fallback
  }
  return str
}

export function initials(name) {
  const clean = safe(name, '')
  if (!clean) return '—'
  const parts = clean.replace(/_/g, ' ').split(' ').filter(Boolean)
  if (parts.length === 0) return '—'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatName(name) {
  const clean = safe(name, 'Unknown Patient')
  return clean.replace(/_/g, ' ')
}

/** Parses the DB's "%Y-%m-%d %H:%M:%S" timestamp (or common variants) safely. */
export function parseTimestamp(ts) {
  if (!ts) return null
  const isoish = String(ts).replace(' ', 'T')
  const d = new Date(isoish)
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(ts, opts = {}) {
  const d = parseTimestamp(ts)
  if (!d) return safe(null)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  })
}

export function formatDateTime(ts) {
  const d = parseTimestamp(ts)
  if (!d) return safe(null)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function timeAgo(ts) {
  const d = parseTimestamp(ts)
  if (!d) return safe(null)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(ts)
}

/** Classifies a free-text warning string (from /critical_warnings) into a severity. */
export function classifySeverity(text) {
  const t = String(text).toLowerCase()
  if (t.includes('[interaction]') || t.includes('severe') || t.includes('black box')) {
    return 'critical'
  }
  if (t.includes('[dosage issue]') || t.includes('high]') || t.includes('unusually high')) {
    return 'high'
  }
  if (t.includes('[side effect]')) return 'medium'
  if (t.includes('[data gap]')) return 'low'
  if (t.toLowerCase().includes('no critical safety issues')) return 'info'
  return 'medium'
}

export const SEVERITY_META = {
  critical: { label: 'Critical', color: 'critical' },
  high: { label: 'High', color: 'warning' },
  medium: { label: 'Medium', color: 'warning' },
  low: { label: 'Low', color: 'info' },
  info: { label: 'Information', color: 'success' },
}

/** Parses a raw "[TAG]: rest of message" warning line from /critical_warnings. */
export function parseWarningLine(line) {
  const trimmed = String(line || '').trim()
  const match = trimmed.match(/^\[([A-Z\s]+)\]:?\s*(.*)$/)
  if (match) {
    return { tag: match[1].trim(), text: match[2].trim(), severity: classifySeverity(trimmed) }
  }
  return { tag: null, text: trimmed, severity: classifySeverity(trimmed) }
}

export function debounce(fn, wait = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}
