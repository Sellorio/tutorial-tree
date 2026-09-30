import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/Global.module.css'
import { WorkspaceApp as App } from './shared/WorkspaceApp/WorkspaceApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
