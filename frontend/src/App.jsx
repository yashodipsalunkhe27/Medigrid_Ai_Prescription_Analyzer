import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import PrescriptionAnalyzer from './pages/PrescriptionAnalyzer'
import Patients from './pages/Patients'
import PatientProfile from './pages/PatientProfile'
import AIAssistant from './pages/AIAssistant'
import HistoryPage from './pages/History'
import Warnings from './pages/Warnings'
import Pharmacy from './pages/Pharmacy'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyzer" element={<PrescriptionAnalyzer />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:patientId" element={<PatientProfile />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/warnings" element={<Warnings />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
