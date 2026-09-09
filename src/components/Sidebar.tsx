import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Sliders, Users, Briefcase,
  ChevronLeft, ChevronRight, TrendingUp, GitCompare, Gauge
} from 'lucide-react';

const NAV = [
  { section: 'Principale', items: [
    { path: '/',            icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { path: '/chatbot',     icon: <MessageSquare size={18} />,   label: 'Agente AI' },
    { path: '/whatif',      icon: <Sliders size={18} />,         label: 'Simulazione What-If' },
  ]},
  { section: 'Analisi Avanzata', items: [
    { path: '/modello',     icon: <GitCompare size={18} />,      label: 'Modello Integrato' },
    { path: '/pressione',   icon: <Gauge size={18} />,           label: 'Pressione Fiscale' },
    { path: '/cluster',     icon: <Users size={18} />,           label: 'Cluster Contribuenti' },
  ]},
  { section: 'Report', items: [
    { path: '/riscossione', icon: <Briefcase size={18} />,       label: 'Riscossione' },
    { path: '/forecast',    icon: <TrendingUp size={18} />,      label: 'Previsioni Gettito' },
  ]},
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛️</div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <h2>Regione Veneto</h2>
            <span>Fiscal Intelligence</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <div
                key={item.path}
                className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="sidebar-footer">
        <div
          className="nav-item"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Espandi' : 'Comprimi'}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Comprimi</span></>}
        </div>
      </div>
    </aside>
  );
}
