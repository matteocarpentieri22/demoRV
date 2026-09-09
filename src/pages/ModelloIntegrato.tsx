import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { formatEuro, formatNum } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dati mock: modello attuale (solo kW/classe) vs modello integrato (kW + profilo fiscale)
const CONFRONTO_DATA = {
  labels: ['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'],
  bollo_attuale:   [207, 430, 696, 1192, 1728],  // basato solo su kW medio per fascia
  bollo_integrato: [145, 360, 710, 1280, 1920],  // modello contribuente-centrico
  contribuenti:    [68_400, 112_300, 89_200, 28_700, 14_247],
};

// Chi paga meno, uguale, di più
const IMPATTO_DISTRIBUZIONE = [
  { label: 'Paga meno', n: 83_931, delta_medio: -142, color: '#059669', pct: 26.8 },
  { label: 'Paga uguale', n: 126_016, delta_medio: 0, color: '#d97706', pct: 40.3 },
  { label: 'Paga di più', n: 102_900, delta_medio: +89, color: '#dc2626', pct: 32.9 },
];

// Equità per provincia
const EQUITA_PROVINCE = [
  { prov: 'Venezia',  risparmio: -3_200_000, pct_beneficiari: 28.4 },
  { prov: 'Verona',   risparmio: -2_800_000, pct_beneficiari: 25.1 },
  { prov: 'Padova',   risparmio: -2_200_000, pct_beneficiari: 24.8 },
  { prov: 'Vicenza',  risparmio: -1_900_000, pct_beneficiari: 22.3 },
  { prov: 'Treviso',  risparmio: -1_600_000, pct_beneficiari: 21.7 },
  { prov: 'Rovigo',   risparmio: -3_200_000, pct_beneficiari: 31.2 },
  { prov: 'Belluno',  risparmio: -2_100_000, pct_beneficiari: 29.8 },
];

const CHART_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { color: '#475569', font: { size: 11 }, padding: 14 } },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(30,41,59,.3)', borderWidth: 1, padding: 10 },
  },
  scales: {
    x: { grid: { color: 'rgba(15,23,65,.06)' }, ticks: { color: '#64748b', font: { size: 11 } }, border: { display: false } },
    y: { grid: { color: 'rgba(15,23,65,.06)' }, ticks: { color: '#64748b', font: { size: 11 }, callback: (v: any) => `€${v}` }, border: { display: false } },
  },
};

export default function ModelloIntegrato() {
  const [activeView, setActiveView] = useState<'confronto' | 'equita' | 'matrice'>('confronto');

  const chartData = {
    labels: CONFRONTO_DATA.labels,
    datasets: [
      {
        label: 'Modello attuale (veicolo-centrico)',
        data: CONFRONTO_DATA.bollo_attuale,
        backgroundColor: 'rgba(37,99,235,.55)',
        borderColor: '#2563eb', borderWidth: 2, borderRadius: 6, borderSkipped: false,
      },
      {
        label: 'Modello integrato (contribuente-centrico)',
        data: CONFRONTO_DATA.bollo_integrato,
        backgroundColor: 'rgba(5,150,105,.55)',
        borderColor: '#059669', borderWidth: 2, borderRadius: 6, borderSkipped: false,
      },
    ],
  };

  return (
    <div className="animate-in">
      {/* Hero */}
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <h1 className="hero-title">⚖️ Modello Integrato: Veicolo-centrico → Contribuente-centrico</h1>
        <p className="hero-subtitle">
          Confronto tra il criterio attuale (basato su kW e classe ambientale) e il modello integrato
          che considera anche il profilo fiscale del proprietario del veicolo
        </p>
      </div>

      {/* Info banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ background: 'rgba(37,99,235,.04)', border: '1px solid rgba(37,99,235,.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(37,99,235,.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              🚗
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--accent-blue)' }}>Modello attuale – Veicolo-centrico</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Il bollo è calcolato esclusivamente in base a <strong>potenza del motore (kW)</strong> e <strong>classe ambientale (Euro 0→6)</strong>.
                Non considera la capacità economica del proprietario: un contribuente con reddito basso
                paga lo stesso di uno con reddito alto se ha lo stesso veicolo.
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: 'rgba(5,150,105,.04)', border: '1px solid rgba(5,150,105,.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(5,150,105,.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              👤
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--accent-green)' }}>Modello integrato – Contribuente-centrico</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Il bollo viene modulato combinando i criteri veicolo con il <strong>profilo fiscale del proprietario</strong>
                (reddito dichiarato, carichi familiari, capacità contributiva). Introduce progressività:
                stesso veicolo, bollo diverso in base alla capacità di pagare.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'confronto', label: '📊 Confronto Bollo Medio' },
          { id: 'equita',    label: '⚖️ Chi paga più / meno / uguale' },
          { id: 'matrice',   label: '🗺️ Equità territoriale' },
        ].map(t => (
          <button key={t.id} className={`tab${activeView === t.id ? ' active' : ''}`} onClick={() => setActiveView(t.id as any)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* View: Confronto */}
      {activeView === 'confronto' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Bollo medio per fascia di reddito</div>
            </div>
            <div className="chart-container tall">
              <Bar data={chartData} options={CHART_OPTS as any} />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Dettaglio variazione per fascia</div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fascia reddito</th>
                  <th>Bollo attuale</th>
                  <th>Bollo integrato</th>
                  <th>Variazione</th>
                  <th>Contribuenti</th>
                </tr>
              </thead>
              <tbody>
                {CONFRONTO_DATA.labels.map((label, i) => {
                  const delta = CONFRONTO_DATA.bollo_integrato[i] - CONFRONTO_DATA.bollo_attuale[i];
                  const isPos = delta > 0;
                  return (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{formatEuro(CONFRONTO_DATA.bollo_attuale[i])}</td>
                      <td style={{ color: isPos ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 700 }}>
                        {formatEuro(CONFRONTO_DATA.bollo_integrato[i])}
                      </td>
                      <td>
                        <span className={`badge ${isPos ? 'badge-red' : 'badge-green'}`}>
                          {isPos ? '+' : ''}{formatEuro(delta)}
                        </span>
                      </td>
                      <td>{formatNum(CONFRONTO_DATA.contribuenti[i])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(37,99,235,.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37,99,235,.15)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong>💡 Lettura:</strong> Il modello integrato riduce il bollo per le fasce basse (sotto i 28k€) e lo aumenta proporzionalmente per le fasce alte, mantenendo un <strong>delta gettito complessivo quasi nullo</strong> (–0,3%).
            </div>
          </div>
        </div>
      )}

      {/* View: Chi paga più/meno/uguale */}
      {activeView === 'equita' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Distribution bar */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">⚖️ Distribuzione dell'impatto sui contribuenti</div>
              <span className="badge badge-blue">312.847 totali</span>
            </div>
            <div style={{ display: 'flex', height: 32, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 16, gap: 3 }}>
              {IMPATTO_DISTRIBUZIONE.map(d => (
                <div
                  key={d.label}
                  style={{ flex: d.pct, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, transition: 'flex .6s ease' }}
                >
                  {d.pct.toFixed(0)}%
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {IMPATTO_DISTRIBUZIONE.map(d => (
                <div key={d.label} style={{ textAlign: 'center', padding: 18, background: d.color + '0a', border: `1px solid ${d.color}33`, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: d.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{d.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: d.color, marginBottom: 4 }}>{formatNum(d.n)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>contribuenti</div>
                  <div style={{ padding: '4px 10px', background: d.color + '15', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, color: d.color, display: 'inline-block' }}>
                    {d.delta_medio > 0 ? '+' : ''}{d.delta_medio === 0 ? '€0' : formatEuro(d.delta_medio)}/anno
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail by cluster */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🎯 Impatto per cluster di vulnerabilità</div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cluster</th>
                  <th>Contribuenti</th>
                  <th>Δ Bollo medio</th>
                  <th>Δ Bollo massimo</th>
                  <th>Impatto gettito</th>
                  <th>Valutazione</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cluster: '🔴 Vulnerabili ad alto rischio', n: 28_400, delta_med: -62,  delta_max: -124, impatto: -1_761_000, giudizio: 'Beneficiario', color: '#059669' },
                  { cluster: '🟠 Fragili ma complianti',       n: 42_100, delta_med: -43,  delta_max: -95,  impatto: -1_810_000, giudizio: 'Beneficiario', color: '#059669' },
                  { cluster: '🟡 Classe media stabile',        n: 118_300,delta_med: +14,  delta_max: +38,  impatto: +1_658_000, giudizio: 'Neutro/lieve↑', color: '#d97706' },
                  { cluster: '🟢 Benestanti complianti',       n: 89_200, delta_med: +88,  delta_max: +210, impatto: +7_850_000, giudizio: 'Penalizzato',   color: '#dc2626' },
                  { cluster: '🔵 Alto reddito',               n: 34_847, delta_med: +192, delta_max: +480, impatto: +6_690_000, giudizio: 'Penalizzato',   color: '#dc2626' },
                ].map(r => (
                  <tr key={r.cluster}>
                    <td>{r.cluster}</td>
                    <td>{formatNum(r.n)}</td>
                    <td style={{ color: r.delta_med < 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
                      {r.delta_med > 0 ? '+' : ''}{formatEuro(r.delta_med)}
                    </td>
                    <td style={{ color: r.delta_max < 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {r.delta_max > 0 ? '+' : ''}{formatEuro(r.delta_max)}
                    </td>
                    <td style={{ color: r.impatto > 0 ? 'var(--accent-blue)' : 'var(--accent-amber)', fontWeight: 600 }}>
                      {r.impatto > 0 ? '+' : ''}{formatEuro(r.impatto)}
                    </td>
                    <td>
                      <span className="badge" style={{ background: r.color + '15', color: r.color, border: `1px solid ${r.color}33` }}>
                        {r.giudizio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Equità territoriale */}
      {activeView === 'matrice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🗺️ Risparmio aggregato per provincia</div>
              <span className="badge badge-green">Cluster reddito basso</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EQUITA_PROVINCE.map(p => (
                <div key={p.prov} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 48, fontWeight: 700, fontSize: 13 }}>{p.prov.slice(0, 3).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{p.prov}</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{formatEuro(Math.abs(p.risparmio))} risparmio</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(Math.abs(p.risparmio) / 3_200_000 * 100).toFixed(0)}%`, background: 'var(--accent-green)', borderRadius: 99, transition: 'width .6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 50 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>{p.pct_beneficiari}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>beneficiari</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📐 Matrice Equità: kW × Fascia Reddito</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Δ bollo annuo nel modello integrato rispetto all'attuale (stesso veicolo, reddito diverso)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>kW \ Reddito</th>
                    {['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'].map(f => (
                      <th key={f} style={{ padding: '8px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center' }}>{f}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kw: '≤ 55 kW',    deltas: [-85, -40, 0, +30, +75] },
                    { kw: '56–100 kW',  deltas: [-60, -20, +10, +55, +120] },
                    { kw: '101–150 kW', deltas: [-30, 0, +25, +90, +180] },
                    { kw: '151–200 kW', deltas: [-15, +10, +40, +130, +250] },
                    { kw: '> 200 kW',   deltas: [0, +30, +70, +190, +380] },
                  ].map(row => (
                    <tr key={row.kw}>
                      <td style={{ padding: '8px 10px', border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-surface)' }}>{row.kw}</td>
                      {row.deltas.map((d, i) => {
                        const bg = d < -50 ? 'rgba(5,150,105,.15)' : d < 0 ? 'rgba(5,150,105,.08)' : d === 0 ? 'transparent' : d < 100 ? 'rgba(220,38,38,.08)' : 'rgba(220,38,38,.15)';
                        const col = d < 0 ? 'var(--accent-green)' : d === 0 ? 'var(--text-muted)' : 'var(--accent-red)';
                        return (
                          <td key={i} style={{ padding: '8px 10px', border: '1px solid var(--border)', textAlign: 'center', background: bg, color: col, fontWeight: 700 }}>
                            {d > 0 ? '+' : ''}{d === 0 ? '—' : `€${d}`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, background: 'rgba(5,150,105,.2)', borderRadius: 3, display: 'inline-block' }} /> Risparmio</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, background: 'transparent', border: '1px solid var(--border)', borderRadius: 3, display: 'inline-block' }} /> Invariato</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 12, background: 'rgba(220,38,38,.15)', borderRadius: 3, display: 'inline-block' }} /> Aumento</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
