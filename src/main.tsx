<<<<<<< HEAD
import App from './App.tsx'
import './shared/model/styles/globals.css'
import { createRoot } from 'react-dom/client'
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './shared/model/styles/globals.css'
>>>>>>> e62cc37e7610c759200e6cd6e96ce7ad34d0d7c6

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
