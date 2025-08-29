import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import SEOWrapper from '@/components/SEOWrapper'
import { migrationService } from './services/MigrationService'

// Run migration on app start if needed
if (migrationService.isMigrationNeeded()) {
  migrationService.runCompleteMigration().catch(console.error);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <SEOWrapper>
        <App />
      </SEOWrapper>
    </HelmetProvider>
  </React.StrictMode>
)