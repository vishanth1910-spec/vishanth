import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { StudioView } from './components/StudioView';
import { CreationWizardModal } from './components/modals/CreationWizardModal';
import { DeployModal } from './components/modals/DeployModal';
import { ExportModal } from './components/modals/ExportModal';
import { GitModal } from './components/modals/GitModal';
import { TemplateGalleryModal } from './components/modals/TemplateGalleryModal';
import { SettingsModal } from './components/modals/SettingsModal';

function MainAppContent() {
  const { currentView } = useProject();

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 flex overflow-hidden">
        {currentView === 'landing' && <LandingView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'studio' && <StudioView />}
      </main>

      {/* Global Modals */}
      <CreationWizardModal />
      <DeployModal />
      <ExportModal />
      <GitModal />
      <TemplateGalleryModal />
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <MainAppContent />
    </ProjectProvider>
  );
}
