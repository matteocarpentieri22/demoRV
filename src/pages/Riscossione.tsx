import { RISCOSSIONE, KPI, formatEuro, formatNum } from '../data/mockData';
import { RiscossioneChart } from '../components/Charts';
import { Target, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

const DETAIL_ROWS = [
  { segmento: 'Recuperabile – priorità alta', contribuenti: 12_400, importo: 6_200_000, eta_media: 42, storico_compliance: '> 3 anni', azione: 'Accertamento immediato', color: '#16a34a', icon: <CheckCircle2 size={14} /> },
  { segmento: 'Recuperabile – priorità media', contribuenti: 18_700, importo: 4_840_000, eta_media: 51, storico_compliance: '1–3 anni', azione: 'Avviso bonario', color: '#3b82f6', icon: <Target size={14} /> },
  { segmento: 'Fragile – da sospendere', contribuenti: 7_200, importo: 1_420_000, eta_media: 68, storico_compliance: '< 1 anno', azione: 'Valutazione caso per caso', color: '#f97316', icon: <AlertCircle size={14} /> },
  { segmento: 'Inesigibile', contribuenti: 2_903, importo: 380_000, eta_media: 74, storico_compliance: 'Nessuno', azione: 'Archiviazione', color: '#ef4444', icon: <XCircle size={14} /> },
];

export default function Riscossione() {
  return (
    <div className="animate-in">
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <h1 className="hero-title">💼 Riscossione & Compliance</h1>
        <p className="hero-subtitle">Segmentazione delle posizioni scadute e strategie di recupero per priorità e capacità fiscale</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Posizioni Scadute', value: formatNum(KPI.posizioni_scadute), color: 'var(--accent-amber)', bg: 'rgba(245,158,11,.1)' },
          { label: 'Gettito Recuperabile', value: formatEuro(KPI.gettito_recuperabile), color: 'var(--accent-green)', bg: 'rgba(16,185,129,.1)' },
          { label: 'Recuperabile Prioritario', value: '€6,2M', color: 'var(--accent-blue)', bg: 'rgba(79,142,247,.1)' },
          { label: 'Compliance Rate', value: `${KPI.compliance_rate}%`, color: 'var(--accent-violet)', bg: 'rgba(139,92,246,.1)' },
        ].map(k => (
           <div key={k.label} className="card" style={{ textAlign: 'center', background: k.bg, border: `1px solid ${k.color}44` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, opacity: 0.7 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20, marginBottom: 20 }}>
        {/* Donut chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 Segmentazione per Recuperabilità</div>
          </div>
          <div className="chart-container tall">
            <RiscossioneChart />
          </div>
        </div>

        {/* Segment cards */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Analisi per Segmento</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DETAIL_ROWS.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: `1px solid ${r.color}33` }}>
                <div style={{ width: 4, background: r.color, borderRadius: 99, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: r.color }}>
                      {r.icon} {r.segmento}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{formatEuro(r.importo)}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Contribuenti', val: formatNum(r.contribuenti) },
                      { label: 'Età media', val: `${r.eta_media} anni` },
                      { label: 'Storico compliance', val: r.storico_compliance },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center', padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: '5px 10px', background: r.color + '15', borderRadius: 6, fontSize: 12, color: r.color, fontWeight: 500 }}>
                    → Azione raccomandata: {r.azione}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Province table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📍 Posizioni Scadute per Provincia</div>
          <span className="badge badge-amber">41.203 totali</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Provincia</th>
              <th>Posizioni scadute</th>
              <th>Importo totale</th>
              <th>% su totale regionale</th>
              <th>Recuperabile</th>
              <th>Compliance locale</th>
            </tr>
          </thead>
          <tbody>
            {[
              { prov: 'Venezia',  posizioni: 8_420,  importo: 2_840_000, compliance: 85.2 },
              { prov: 'Verona',   posizioni: 7_210,  importo: 2_430_000, compliance: 88.1 },
              { prov: 'Padova',   posizioni: 6_830,  importo: 2_190_000, compliance: 87.3 },
              { prov: 'Vicenza',  posizioni: 5_940,  importo: 1_820_000, compliance: 89.0 },
              { prov: 'Treviso',  posizioni: 5_320,  importo: 1_640_000, compliance: 88.7 },
              { prov: 'Belluno',  posizioni: 4_210,  importo: 1_110_000, compliance: 82.4 },
              { prov: 'Rovigo',   posizioni: 3_273,  importo: 810_000,   compliance: 84.1 },
            ].map(r => (
              <tr key={r.prov}>
                <td>{r.prov}</td>
                <td>{formatNum(r.posizioni)}</td>
                <td>{formatEuro(r.importo)}</td>
                <td>{((r.posizioni / 41_203) * 100).toFixed(1)}%</td>
                <td style={{ color: 'var(--accent-green)' }}>{formatEuro(r.importo * 0.68)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${r.compliance}%`, height: '100%', background: r.compliance > 87 ? 'var(--accent-green)' : 'var(--accent-amber)', borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: r.compliance > 87 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {r.compliance}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
