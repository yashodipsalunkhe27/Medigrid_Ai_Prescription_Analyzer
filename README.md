# MediGrid AI — Smarter Care. Safer Prescriptions.

A premium healthcare SaaS frontend built on top of your existing MEDI_AI FastAPI
backend. The backend logic, AI prompts, and database code are **untouched** —
this delivery adds a new production-quality React frontend and wires it to
your existing endpoints.

```
MediGrid_AI/
├── backend/     ← your original FastAPI project, unmodified
└── frontend/    ← new React + Vite + Tailwind frontend (MediGrid AI)
```

---

## 1. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` (this was intentionally **not** copied into this zip
for security — your original key was visible in plain text in the uploaded
project, so it has not been re-embedded here):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Then start the API exactly as before:

```bash
python -m uvicorn fast_api_file:api --reload --reload-exclude "*.db"
```

The API will be available at `http://127.0.0.1:8000`. CORS is already open
(`allow_origins=["*"]`) in `fast_api_file.py`, so the new frontend can call it
straight away — no backend changes were needed.

> **Security note:** rotate the Gemini API key that was visible in your
> original `.env` before pushing this project anywhere public (GitHub, a
> shared drive, etc.), since it was exposed in plain text in the upload.

---

## 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will start on `http://localhost:5173`. It talks to the backend at
`http://127.0.0.1:8000` by default — override this by copying
`.env.example` to `.env` and changing `VITE_API_URL` if your backend runs
elsewhere.

```bash
cp .env.example .env
npm run build      # production build → frontend/dist
npm run preview    # preview the production build locally
```

---

## What's implemented

**Pages:** Dashboard, Prescription Analyzer, Patients, Patient Profile, AI
Assistant, Prescription History, Critical Warnings, Pharmacy & Location,
Reports & Analytics, Settings.

**Every page is wired to your real endpoints — nothing is hard-coded mock
data once the backend is running:**

| Frontend feature | Backend endpoint |
|---|---|
| Upload & analyze a prescription | `POST /data_extraction` |
| Interaction / dosage / allergy checks | `POST /critical_warnings` |
| Save a reviewed prescription | `POST /post_into_db` |
| Patients, History, Dashboard stats, Analytics | `GET /get_Saved_data` |
| AI Assistant chat | `POST /chat` |

**Global UI:** collapsible sidebar with mobile drawer, top header with
search/notifications/theme toggle/profile, full dark mode (hand-tuned, not
inverted), toasts, loading skeletons, empty states, error states with retry,
confirm dialogs, responsive tables that collapse into cards on mobile.

**Design tokens** (light & dark) live as CSS variables in
`frontend/src/index.css` and are mapped into Tailwind in
`frontend/tailwind.config.js`, using the exact palette you specified
(`#0F9D94` primary, `#2563EB` accent, etc.).

### A few honest implementation notes

Your backend doesn't currently expose endpoints for **patient age/gender
persistence**, **deleting a saved record**, or a **pharmacy directory /
places search** — so the frontend handles those gracefully instead of
faking data:

- **Patients & Risk level:** since the database only stores medication rows
  (no age/gender/diagnosis), patient risk badges are a transparent,
  documented heuristic based on prescription volume (see
  `frontend/src/lib/records.js`), not a fabricated AI score.
- **Delete (History page):** there's no `DELETE` endpoint yet, so "Delete"
  hides the record from your local view only, and says so explicitly in the
  confirmation dialog — it does not silently pretend to remove it from
  SQLite.
- **Pharmacy & Location:** the page requests geolocation and generates the
  same Google Maps search link your backend already attaches to
  prescriptions (`location.py`), rather than inventing fictitious pharmacy
  names/addresses.
- **Critical Warnings history:** the backend doesn't persist warning
  results, so the Warnings page keeps a local, per-device log (in
  `localStorage`) of the checks you've run this session/device.

None of this required backend changes — it's all frontend-side handling of
gaps that exist today. If you add endpoints for these later (e.g. a
`DELETE /prescription/{id}` or a places-search integration), the relevant
frontend pages are already structured to swap the placeholder logic for a
real API call — see `frontend/src/services/api.js`.

---

## Verification performed

Because this environment has no network access, `npm install` / a live
`npm run dev` could not be executed here. Instead, everything was verified
statically before packaging:

- ✅ Every `.jsx`/`.js` file passed a TypeScript syntax check (loose mode,
  JSX-aware) — no unbalanced tags, bad imports, or syntax errors.
- ✅ Every relative import path resolves to a real file.
- ✅ Every named/default import matches an actual export in its source file.
- ✅ Backend files were copied **byte-for-byte unmodified** (verified
  against the original upload) — including `static/test1.html`, which
  `GET /` still serves, so the existing root route keeps working.
- ✅ No `undefined`/`null`/`NaN` are ever rendered — all display values go
  through a `safe()` formatter that falls back to readable text.

**Please still run `npm install && npm run dev` yourself** and click through
the app once against your live backend — this checks structure and wiring
exhaustively, but a real browser run is the only way to catch runtime issues
like a mistyped icon name or an API response shape that differs from what
`Extracting_prescription_data.py` currently returns. If anything doesn't
render, the browser console will point straight at the file/line.

---

## Tech stack (as requested)

- React + Vite + Tailwind CSS
- `lucide-react` for icons (no emoji anywhere in the UI)
- `recharts` for the Analytics charts
- `motion` (the Motion library) for subtle page/modal transitions
- Your existing FastAPI + Gemini + SQLite backend, untouched
