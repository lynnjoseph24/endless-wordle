import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Global styles
import App from './App.jsx' // Main application component

// Initialize React application with StrictMode for additional development checks
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
