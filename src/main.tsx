import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { LeadProvider } from './LeadContext';
import { BrandProvider } from './hooks/useBrand';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandProvider>
      <LeadProvider>
        <App />
      </LeadProvider>
    </BrandProvider>
  </StrictMode>,
)
