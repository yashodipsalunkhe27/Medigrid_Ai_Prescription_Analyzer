
# 🏥 MediGrid AI — Smarter Care. Safer Prescriptions.

An AI-powered healthcare dashboard designed to help analyze prescriptions, identify potential medication safety concerns, track patient prescription history, and interact with an AI assistant grounded in saved records.

MediGrid AI combines **Artificial Intelligence, Prescription Analysis, and Healthcare Data Management** in a modern, responsive web application.

---

## 🌐 Live Demo

| Service | Link |
|---|---|
| 🎨 Frontend (Vercel) |(medigridaiprescriptionanalyzer.vercel.app) |
| ⚡ Backend API (Render)(https://medigrid-ai-prescription-analyzer.onrender.com) |


> Replace the placeholder URLs with your deployed application links.

---

## 📸 Project Screenshots

Explore the MediGrid AI dashboard and its key features.

### 🏠 Dashboard

<!-- Replace the path with your actual screenshot -->
![MediGrid AI Dashboard]
(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3ea791b8-85b4-4741-a525-f7d9399f335f" />
)

### 📄 Prescription Analyzer

Upload and analyze prescription images using AI-powered extraction.

![Prescription Analyzer]
(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7b6fb00e-7376-4fca-9734-642f397462f0" />
)

### 🤖 AI Assistant

Interact with an AI assistant grounded in saved prescription records.

![AI Assistant]
(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f4356195-6d6e-480c-a44a-c04a8cae5d59" />
)

### 👤 Patient Profile

View patient-related prescription history and saved medication records.

![Patient Profile]
(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/90887578-4819-40e9-a6a4-cda8b5c6f148" />
)

### ⚠️ Critical Warnings

Review potential medication interactions, dosage concerns, and allergy-related warnings.

![Critical Warnings]
(<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/bb772f56-635a-4bfb-a138-0943ae1da822" />
)

### Report & Analytics <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/538fa9fb-ff58-43da-acbc-57fde0180298" />

---

## ✨ Key Features

- 📄 **AI Prescription Analysis**
  - Upload prescription images.
  - Extract prescription and medication information using a vision model.

- ⚠️ **Critical Safety Checks**
  - Analyze potential medication interactions.
  - Review dosage-related concerns.
  - Check allergy-related information.
  - Generate AI-assisted safety warnings.

- 👥 **Patient Management**
  - View saved patient prescription records.
  - Explore patient profiles and history.

- 🤖 **AI Healthcare Assistant**
  - Chat with an AI assistant.
  - Ground responses in saved prescription records.

- 📊 **Reports & Analytics**
  - Track prescription-related statistics.
  - Explore data through interactive charts.

- 💊 **Pharmacy & Location**
  - Request the user's location.
  - Generate Google Maps pharmacy search links.
  - Provide a generic pharmacy search fallback when location access is unavailable.

- 🌙 **Modern Responsive UI**
  - Light and dark themes.
  - Responsive dashboard.
  - Collapsible sidebar.
  - Mobile navigation drawer.
  - Loading states and error handling.
  - Toast notifications and confirmation dialogs.

---

## 🧩 Application Pages

The application includes the following pages:

| Page | Description |
|---|---|
| Dashboard | Overview and prescription statistics |
| Prescription Analyzer | Upload and analyze prescriptions |
| Patients | View saved patient records |
| Patient Profile | Review patient-specific data |
| AI Assistant | AI-powered healthcare chat |
| Prescription History | Review saved prescriptions |
| Critical Warnings | View safety check results |
| Pharmacy & Location | Find pharmacies using location |
| Reports & Analytics | Analyze prescription-related data |
| Settings | Manage application preferences |
| Clinician Profile | Edit clinician name and role |

---

## 🏗️ Project Architecture

```text
MediGrid-AI-main/
│
├── backend/
│   ├── fast_api_file.py
│   ├── requirements.txt
│   ├── .env
│   ├── MediGrid.db
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   │   └── screenshots/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Lucide React
- Recharts
- Motion

### Backend

- Python
- FastAPI
- SQLite
- Uvicorn

### Artificial Intelligence

- Groq API
- Vision model for prescription image analysis
- Text model for AI Assistant and safety analysis

### Deployment

- Frontend: Vercel
- Backend: Render

---

## 🔌 API Endpoints

The frontend communicates with the FastAPI backend through the following endpoints.

| Feature | HTTP Method | Endpoint |
|---|---|---|
| Prescription Analysis | POST | `/data_extraction` |
| Critical Safety Checks | POST | `/critical_warnings` |
| Save Prescription | POST | `/post_into_db` |
| Retrieve Saved Data | GET | `/get_Saved_data` |
| AI Assistant Chat | POST | `/chat` |

API documentation is available through FastAPI's Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd MediGrid-AI-main
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

### Create a Virtual Environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from:

https://console.groq.com/

> Never expose your API key in source code or commit your `.env` file to GitHub.

### Run the Backend

```bash
python -m uvicorn fast_api_file:api --reload --reload-exclude "*.db"
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Frontend Environment

Copy the example environment file:

**Windows:**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Update `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> Use your deployed Render backend URL when connecting the frontend to production.

### Start the Development Server

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

The production build is generated in:

```text
frontend/dist
```

Preview the production build:

```bash
npm run preview
```

---

## ☁️ Deployment

### Backend Deployment — Render

**Configuration**

| Setting | Value |
|---|---|
| Platform | Render |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn fast_api_file:api --host 0.0.0.0 --port $PORT` |
| Environment Variable | `GROQ_API_KEY` |

Add the `GROQ_API_KEY` environment variable through the Render dashboard.

**Backend URL:**

```text
YOUR_RENDER_BACKEND_URL
```

### Frontend Deployment — Vercel

**Configuration**

| Setting | Value |
|---|---|
| Platform | Vercel |
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Configure the frontend environment variable:

```env
VITE_API_URL=YOUR_RENDER_BACKEND_URL
```

**Frontend URL:**

```text
YOUR_VERCEL_FRONTEND_URL
```

> Ensure the deployed frontend uses the correct backend URL and that the backend is configured to accept requests from the frontend.

---

## 🗄️ Database

MediGrid AI uses **SQLite** to store prescription-related records.

### Database File

```text
backend/MediGrid.db
```

### Implementation Notes

- The database stores medication-related prescription rows.
- Patient risk badges use a documented prescription-volume heuristic because the current database does not store age, gender, or diagnosis.
- The History page's Delete action hides records from the local view; it does not delete them from SQLite because a DELETE endpoint is not implemented.
- Critical Warning results are not persisted in the backend. The frontend maintains a local, per-device log using `localStorage`.

### Production Consideration

Render's free-tier filesystem is ephemeral. SQLite data may be lost after service restarts or redeployments.

For production use, consider a hosted database such as:

- PostgreSQL
- Supabase
- Another managed database service

> Database persistence, access controls, and backup policies should be reviewed before using the application with real patient data.

---

## 🔐 Security & Privacy

- Never commit `.env` files or API keys.
- Do not expose Groq API keys in the frontend.
- Use environment variables for sensitive configuration.
- Review authentication and authorization before production deployment.
- Protect patient information and prescription data.
- Do not use AI-generated warnings as a substitute for professional medical judgment.

**Important:** This project is an AI-assisted healthcare application prototype. Its outputs should be reviewed by qualified healthcare professionals, and the application should not be relied upon as the sole basis for prescribing or treatment decisions.

---

## ⚠️ Project Limitations

1. The current SQLite database stores medication-related rows and does not include a complete clinical patient record.
2. Patient risk indicators are heuristic-based, not clinically validated risk scores.
3. The backend does not persist Critical Warning results.
4. The History Delete feature only hides records from the local interface.
5. Render free-tier storage is not persistent.
6. AI-generated prescription extraction and safety analysis may contain errors and require human verification.

---

## 📌 Future Improvements

- [ ] Add user authentication and role-based access.
- [ ] Implement secure patient data management.
- [ ] Add a DELETE endpoint for permanent record deletion.
- [ ] Store Critical Warning results in the backend.
- [ ] Migrate SQLite to a hosted production database.
- [ ] Add audit logging for prescription reviews.
- [ ] Improve prescription extraction validation.
- [ ] Add automated testing for backend endpoints.
- [ ] Add monitoring and error logging.
- [ ] Improve healthcare data privacy and security controls.

---

## 👨‍💻 Developer

**Yashodip Salunkhe**

Aspiring Data Analyst | Data Science & Generative AI Enthusiast

Interested in building AI-powered applications, data analytics solutions, and intelligent automation systems.

---

## ⭐ Support the Project

If you find **MediGrid AI** interesting or useful, please consider giving the repository a ⭐ star on GitHub.

Your support and feedback are appreciated!

If you have suggestions, improvements, or ideas, feel free to open an issue or contribute to the project.

---

## 📄 License

Add your preferred open-source license here, if applicable.
