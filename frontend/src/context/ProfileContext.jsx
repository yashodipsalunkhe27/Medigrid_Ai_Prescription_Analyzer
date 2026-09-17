import { createContext, useContext, useEffect, useState } from 'react'

const ProfileContext = createContext(null)

const STORAGE_KEY = 'medigrid_profile'

const DEFAULT_PROFILE = {
  name: 'Dr. Alex Rivera',
  role: 'Healthcare Professional',
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw)
    return {
      name: parsed.name || DEFAULT_PROFILE.name,
      role: parsed.role || DEFAULT_PROFILE.role,
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  function updateProfile(next) {
    setProfile((prev) => ({ ...prev, ...next }))
  }

  // Same two initials logic used by the sidebar avatar, kept here so
  // any component can derive it from the current name.
  function initials() {
    const parts = profile.name.replace(/^dr\.?\s*/i, '').trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'DR'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <ProfileContext.Provider value={{ ...profile, updateProfile, initials }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider')
  return ctx
}