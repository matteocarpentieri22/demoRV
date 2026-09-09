import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview    from './pages/Overview';
import Chatbot     from './pages/Chatbot';
import WhatIf      from './pages/WhatIf';
import ClusterPage from './pages/Cluster';
import Riscossione from './pages/Riscossione';
import ForecastPage from './pages/Forecast';
import ModelloIntegrato from './pages/ModelloIntegrato';
import PressioneFiscale from './pages/PressioneFiscale';

const PAGE_TITLES: Record<string, string> = {
  '/':            'Overview · Dashboard Principale',
  '/chatbot':     'Agente Conversazionale AI',
  '/whatif':      'Simulazione What-If',
  '/modello':     'Modello Integrato Contribuente-centrico',
  '/pressione':   'Pressione Fiscale Auto',
  '/cluster':     'Cluster Contribuenti',
  '/riscossione': 'Riscossione & Compliance',
  '/forecast':    'Previsioni Gettito',
};

function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title    = PAGE_TITLES[location.pathname] ?? 'Fiscal Intelligence';

  // Chat page needs full height without scroll padding
  const isChatPage = location.pathname === '/chatbot';

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <span className="topbar-badge">🔒 Demo · Dati Mock</span>
          <span className="topbar-date">
            {new Date().toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Page content */}
        {isChatPage ? (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
        ) : (
          <div className="page-content">
            <Routes>
              <Route path="/"            element={<Overview />} />
              <Route path="/whatif"      element={<WhatIf />} />
              <Route path="/modello"     element={<ModelloIntegrato />} />
              <Route path="/pressione"   element={<PressioneFiscale />} />
              <Route path="/cluster"     element={<ClusterPage />} />
              <Route path="/riscossione" element={<Riscossione />} />
              <Route path="/forecast"    element={<ForecastPage />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
