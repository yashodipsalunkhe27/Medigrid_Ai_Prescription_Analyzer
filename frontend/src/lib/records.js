import { safe, formatName } from './utils'

/**
 * The backend's /get_Saved_data endpoint returns one flat list of rows
 * (PATIENT_NAME, MEDICATION_NAME, DOSAGE, FREQUENCY, DURATION, MAP_LINK,
 * Data_Saved), with a blank row inserted between save batches. This module
 * turns that into structured "prescriptions" (one per save batch) and
 * "patients" (grouped by name) for the UI.
 */

function isBlankRow(row) {
  return !row || Object.values(row).every((v) => v === '' || v === null || v === undefined)
}

/** Groups raw rows into one prescription entry per save batch. */
export function groupPrescriptions(rows) {
  if (!Array.isArray(rows)) return []
  const groups = []
  let current = null

  for (const row of rows) {
    if (isBlankRow(row)) {
      current = null
      continue
    }
    const key = `${row.PATIENT_NAME}__${row.Data_Saved}`
    if (!current || current.key !== key) {
      current = {
        key,
        id: key,
        patientName: formatName(row.PATIENT_NAME),
        rawPatientName: row.PATIENT_NAME,
        savedAt: row.Data_Saved,
        medicines: [],
      }
      groups.push(current)
    }
    current.medicines.push({
      name: safe(row.MEDICATION_NAME),
      dosage: safe(row.DOSAGE),
      frequency: safe(row.FREQUENCY),
      duration: safe(row.DURATION),
      mapLink: row.MAP_LINK || null,
    })
  }

  // Most recent first
  return groups.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
}

/** Groups prescriptions further into per-patient summaries. */
export function groupPatients(rows) {
  const prescriptions = groupPrescriptions(rows)
  const byName = new Map()

  for (const rx of prescriptions) {
    const key = rx.rawPatientName || rx.patientName
    if (!byName.has(key)) {
      byName.set(key, {
        id: key,
        name: rx.patientName,
        prescriptions: [],
        lastVisit: rx.savedAt,
        medicineCount: 0,
      })
    }
    const patient = byName.get(key)
    patient.prescriptions.push(rx)
    patient.medicineCount += rx.medicines.length
    if (new Date(rx.savedAt) > new Date(patient.lastVisit)) {
      patient.lastVisit = rx.savedAt
    }
  }

  const patients = Array.from(byName.values()).map((p) => ({
    ...p,
    riskLevel: deriveRiskLevel(p),
  }))

  return patients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
}

/**
 * Since the backend does not persist AI risk scoring per patient, this
 * derives a light-weight, transparent heuristic purely from prescription
 * volume so the UI never fabricates a false sense of precision.
 */
function deriveRiskLevel(patient) {
  if (patient.medicineCount >= 6) return 'high'
  if (patient.medicineCount >= 3) return 'medium'
  return 'low'
}

export function findPatient(rows, patientId) {
  const patients = groupPatients(rows)
  return patients.find((p) => p.id === patientId) || null
}
