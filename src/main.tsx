/**
 * @file main.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-23
 * @project Feature Cost Calculator
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
