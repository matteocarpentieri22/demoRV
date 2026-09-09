import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatEuro, formatNum, KPI } from '../data/mockData';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down' | 'neutral';
  iconBg: string;
  icon: React.ReactNode;
  delay?: number;
}

export function KpiCard({ label, value, delta, deltaDir = 'neutral', iconBg, icon, delay = 0 }: KpiCardProps) {
  return (
    <div className="kpi-card animate-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {delta && (
        <div className={`kpi-delta ${deltaDir}`}>
          {deltaDir === 'up'      && <TrendingUp size={12} />}
          {deltaDir === 'down'    && <TrendingDown size={12} />}
          {deltaDir === 'neutral' && <Minus size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}

export function KpiGrid() {
  return (
    <div className="kpi-grid">
      <KpiCard
        label="Gettito Totale"
        value={formatEuro(KPI.gettito_totale)}
        delta="+1,2% vs 2024"
        deltaDir="up"
        iconBg="linear-gradient(135deg,#1e3a8a,#3b82f6)"
        icon={<span style={{ fontSize: 20 }}>💰</span>}
        delay={0}
      />
      <KpiCard
        label="Contribuenti"
        value={formatNum(KPI.contribuenti_totali)}
        delta="+0,8% vs 2024"
        deltaDir="up"
        iconBg="linear-gradient(135deg,#064e3b,#10b981)"
        icon={<span style={{ fontSize: 20 }}>👥</span>}
        delay={50}
      />
      <KpiCard
        label="Veicoli"
        value={formatNum(KPI.veicoli_totali)}
        delta="+2,1% vs 2024"
        deltaDir="up"
        iconBg="linear-gradient(135deg,#1e1b4b,#7c3aed)"
        icon={<span style={{ fontSize: 20 }}>🚗</span>}
        delay={100}
      />
      <KpiCard
        label="Compliance Rate"
        value={`${KPI.compliance_rate}%`}
        delta="+0,4 punti vs 2024"
        deltaDir="up"
        iconBg="linear-gradient(135deg,#065f46,#34d399)"
        icon={<span style={{ fontSize: 20 }}>✅</span>}
        delay={150}
      />
      <KpiCard
        label="Posizioni Scadute"
        value={formatNum(KPI.posizioni_scadute)}
        delta="-3,2% vs 2024"
        deltaDir="up"
        iconBg="linear-gradient(135deg,#7c2d12,#f97316)"
        icon={<span style={{ fontSize: 20 }}>⚠️</span>}
        delay={200}
      />
      <KpiCard
        label="Gettito Recuperabile"
        value={formatEuro(KPI.gettito_recuperabile)}
        delta="Priorità alta: €6,2M"
        deltaDir="neutral"
        iconBg="linear-gradient(135deg,#1c1917,#f59e0b)"
        icon={<span style={{ fontSize: 20 }}>🎯</span>}
        delay={250}
      />
    </div>
  );
}
