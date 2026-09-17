import { useState } from 'react'
import {
  UserRound,
  Bell,
  Sparkles,
  MapPin,
  Palette,
  ShieldCheck,
  Info,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useProfile } from '../context/ProfileContext'
import { API_URL } from '../services/api'

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary-dark dark:text-primary">
          <Icon size={17} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink font-display">{title}</h2>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2.5 cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-alt border border-border'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </label>
  )
}

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const { name, role, updateProfile } = useProfile()

  // Local draft state so typing doesn't commit until "Save changes" is clicked
  const [draftName, setDraftName] = useState(name)
  const [draftRole, setDraftRole] = useState(role)

  const [notifs, setNotifs] = useState({ critical: true, newRx: true, digest: false })
  const [aiPrefs, setAiPrefs] = useState({ detailed: true, autoWarn: true })
  const [locationEnabled, setLocationEnabled] = useState(true)

  function save() {
    updateProfile({ name: draftName.trim() || name, role: draftRole.trim() || role })
    toast.success('Settings saved.')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-ink font-display">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your profile, preferences, and application behavior.</p>
      </div>

      <Section icon={UserRound} title="Profile" description="Your clinician profile shown across MediGrid AI">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted" htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="role">Role</label>
            <input
              id="role"
              value={draftRole}
              onChange={(e) => setDraftRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications" description="Choose what MediGrid AI should alert you about">
        <div className="divide-y divide-border">
          <Toggle checked={notifs.critical} onChange={(v) => setNotifs((n) => ({ ...n, critical: v }))} label="Critical warning alerts" />
          <Toggle checked={notifs.newRx} onChange={(v) => setNotifs((n) => ({ ...n, newRx: v }))} label="New prescription saved" />
          <Toggle checked={notifs.digest} onChange={(v) => setNotifs((n) => ({ ...n, digest: v }))} label="Weekly summary digest" />
        </div>
      </Section>

      <Section icon={Sparkles} title="AI Preferences" description="Control how the AI Assistant responds">
        <div className="divide-y divide-border">
          <Toggle checked={aiPrefs.detailed} onChange={(v) => setAiPrefs((p) => ({ ...p, detailed: v }))} label="Detailed AI explanations" />
          <Toggle checked={aiPrefs.autoWarn} onChange={(v) => setAiPrefs((p) => ({ ...p, autoWarn: v }))} label="Run safety check automatically after analysis" />
        </div>
      </Section>

      <Section icon={MapPin} title="Location" description="Used to suggest nearby pharmacies">
        <Toggle checked={locationEnabled} onChange={setLocationEnabled} label="Allow location access" />
      </Section>

      <Section icon={Palette} title="Appearance" description="Choose how MediGrid AI looks on this device">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                if (opt.value === 'system') {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                  setTheme(prefersDark ? 'dark' : 'light')
                } else {
                  setTheme(opt.value)
                }
              }}
              className={`flex flex-col items-center gap-2 rounded-md border py-3.5 text-xs font-medium transition-colors ${
                theme === opt.value ? 'border-primary bg-primary/5 text-primary-dark dark:text-primary' : 'border-border text-muted hover:bg-surface-alt'
              }`}
            >
              <opt.icon size={18} />
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={ShieldCheck} title="Security" description="Keep your account and patient data safe">
        <div className="space-y-2 text-sm">
          <button className="w-full text-left rounded-md border border-border px-3.5 py-2.5 hover:bg-surface-alt transition-colors">
            Change password
          </button>
          <button className="w-full text-left rounded-md border border-border px-3.5 py-2.5 hover:bg-surface-alt transition-colors">
            Two-factor authentication
          </button>
        </div>
      </Section>

      <Section icon={Info} title="About MediGrid AI">
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted">Version</dt>
            <dd className="text-ink">1.0.0</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">API endpoint</dt>
            <dd className="text-ink font-mono text-xs">{API_URL}</dd>
          </div>
        </dl>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={save}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  )
}