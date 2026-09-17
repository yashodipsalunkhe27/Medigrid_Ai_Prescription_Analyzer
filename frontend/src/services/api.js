// Central API service layer for MediGrid AI.
// Every request to the FastAPI backend flows through this file so components
// never call fetch() directly.

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Safely parses a fetch Response, tolerating empty bodies and non-JSON
 * payloads instead of throwing "Unexpected end of JSON input".
 */
async function parseResponse(res) {
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const detail =
      (data && typeof data === 'object' && (data.detail || data.message)) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${res.status}`
    throw new ApiError(detail, res.status)
  }

  return data
}

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, options)
    return await parseResponse(res)
  } catch (err) {
    if (err instanceof ApiError) throw err
    // Network failure, CORS issue, backend not running, etc.
    throw new ApiError(
      'Could not reach the MediGrid AI server. Please check your connection and try again.',
      0,
    )
  }
}

/** GET / — basic health check for the backend root. */
export function getServerStatus() {
  return request('/')
}

/**
 * POST /data_extraction
 * Uploads a prescription image (and optional geolocation) and returns the
 * structured { patient_info, Prescription_info } payload from the AI model.
 */
export function extractPrescription(file, location) {
  const formData = new FormData()
  formData.append('image', file)
  if (location) {
    formData.append('user_location', JSON.stringify(location))
  }
  return request('/data_extraction', {
    method: 'POST',
    body: formData,
  })
}

/**
 * POST /critical_warnings
 * Accepts { Prescription_info: [...] } and returns an array of warning
 * strings such as "[INTERACTION]: Drug A + Drug B: ...".
 */
export function getCriticalWarnings(prescriptionInfo) {
  return request('/critical_warnings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Prescription_info: prescriptionInfo }),
  })
}

/**
 * POST /post_into_db
 * Persists a { patient_info, Prescription_info } record to SQLite.
 */
export function savePrescription(payload) {
  return request('/post_into_db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

/**
 * GET /get_Saved_data
 * Returns the full, flat Prescription table. Rows are grouped by save
 * batch (separated by blank rows) in the raw response; helpers in
 * lib/records.js reshape this into patients / prescriptions / medicines.
 */
export function getSavedData() {
  return request('/get_Saved_data')
}

/**
 * POST /chat
 * Sends a single message to the AI assistant and returns { response }.
 */
export function sendChatMessage(message) {
  return request('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
}

export { ApiError, API_URL }
