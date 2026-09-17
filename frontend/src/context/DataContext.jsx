import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getSavedData } from '../services/api'
import { groupPatients, groupPrescriptions } from '../lib/records'

const DataContext = createContext(null)

const WARNINGS_KEY = 'medigrid-warning-log'

function loadWarningLog() {
  try {
    const raw = localStorage.getItem(WARNINGS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function DataProvider({ children }) {
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)
  const [warningLog, setWarningLog] = useState(loadWarningLog)
  const hasFetched = useRef(false)

  const refresh = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const data = await getSavedData()
      setRows(Array.isArray(data) ? data : [])
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Unable to load saved records.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    refresh()
  }, [refresh])

  const logWarnings = useCallback((entry) => {
    setWarningLog((prev) => {
      const next = [{ ...entry, id: `${Date.now()}` }, ...prev].slice(0, 100)
      try {
        localStorage.setItem(WARNINGS_KEY, JSON.stringify(next))
      } catch {
        // storage may be unavailable; log stays in-memory for this session
      }
      return next
    })
  }, [])

  const clearWarningLog = useCallback(() => {
    setWarningLog([])
    try {
      localStorage.removeItem(WARNINGS_KEY)
    } catch {
      // ignore
    }
  }, [])

  const value = {
    rows,
    status,
    error,
    refresh,
    patients: groupPatients(rows),
    prescriptions: groupPrescriptions(rows),
    warningLog,
    logWarnings,
    clearWarningLog,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
