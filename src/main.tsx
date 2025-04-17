import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { reportWebVitals } from './reportWebVitals.ts'
import './shared/model/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Web Vitals 측정 및 보고
reportWebVitals(console.log)
