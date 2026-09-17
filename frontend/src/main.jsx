import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileProvider>
        <ThemeProvider>
          <ToastProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </ToastProvider>
        </ThemeProvider>
      </ProfileProvider>
    </BrowserRouter>
  </React.StrictMode>,
)