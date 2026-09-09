import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, Title, Tooltip, Legend,
} from 'chart.js';
import { formatEuro, formatNum } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

// Indicatore sintetico: bollo/reddito per fascia
const PRESSIONE_DATA = {
  labels: ['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'],
  incidenza_pct: [1.85, 1.96, 1.69, 1.64, 1.44],   // bollo medio / reddito medio × 100
  bollo_medio:   [207, 430, 696, 1192, 1728],
  reddito_medio: [11_200, 21_900, 41_200, 72_700, 119_800],
  soglia_sostenibilita: 2.0, // % soglia critica
};

// Scatter: reddito vs bollo per cluster
const SCATTER_CLUSTERS = [
  { x: 11_200,  y: 218,   r: 28_400,  label: 'Vulnerabili',   color: '#dc2626' },
  { x: 19_800,  y: 387,   r: 42_100,  label: 'Fragili',       color: '#ea580c' },
  { x: 38_400,  y: 631,   r: 118_300, label: 'Classe media',  color: '#d97706' },
  { x: 62_100,  y: 1_124, r: 89_200,  label: 'Benestanti',    color: '#059669' },
  { x: 98_700,  y: 1_842, r: 34_847,  label: 'Alto reddito',  color: '#2563eb' },
];

const CHART_OPTS_BAR = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8', borderColor: 'rgba(30,41,59,.3)', borderWidth: 1, padding: 10, callbacks: { label: (c: any) => ` ${c.raw.toFixed(2)}%` } },
  },
  scales: {
    x: { grid: { color: 'rgba(15,23,65,.06)' }, ticks: { color: '#64748b', font: { size: 11 } }, border: { display: false } },
    y: { grid: { color: 'rgba(15,23,65,.06)' }, ticks: { color: '#64748b', font: { size: 11 }, callback: (v: any) => `${v}%` }, border: { display: false }, max: 3 },
  },
};

export default function PressioneFiscale() {
  const barData = {
    labels: PRESSIONE_DATA.labels,
    datasets: [{
      label: 'Incidenza bollo su reddito (%)',
      data: PRESSIONE_DATA.incidenza_pct,
      backgroundColor: PRESSIONE_DATA.incidenza_pct.map(v =>
        v >= PRESSIONE_DATA.soglia_sostenibilita ? 'rgba(220,38,38,.6)' : 'rgba(37,99,235,.5)'
      ),
      borderColor: PRESSIONE_DATA.incidenza_pct.map(v =>
        v >= PRESSIONE_DATA.soglia_sostenibilita ? '#dc2626' : '#2563eb'
      ),
      borderWidth: 2, borderRadius: 6, borderSkipped: false,
    }],
  };

  return (
    <div className="animate-in">
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <h1 className="hero-title">📐 Pressione Fiscale Auto sul Contribuente</h1>
        <p className="hero-subtitle">
          Indicatore sintetico di sostenibilità: bollo dovuto / capacità fiscale stimata, con distribuzione per fasce e cluster di vulnerabilità
        </p>
      </div>

      {/* KPI sintetici */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Incidenza media regionale', value: '1,72%', sub: 'bollo / reddito dichiarato', color: 'var(--accent-blue)', bg: 'rgba(37,99,235,.07)' },
          { label: 'Fascia più gravata', value: '15–28k€', sub: 'incidenza 1,96%', color: 'var(--accent-red)', bg: 'rgba(220,38,38,.07)' },
          { label: 'Contribuenti > soglia 2%', value: '28.400', sub: 'profilo ad alto rischio', color: 'var(--accent-amber)', bg: 'rgba(217,119,6,.08)' },
          { label: 'Fascia a minor carico', value: '> 75k€', sub: 'incidenza 1,44%', color: 'var(--accent-green)', bg: 'rgba(5,150,105,.07)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ textAlign: 'center', background: k.bg, border: `1px solid ${k.color}33` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, opacity: 0.75 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Bar chart incidenza */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Incidenza bollo su reddito per fascia</div>
            <span className="badge badge-red">Soglia critica: 2%</span>
          </div>
          <div className="chart-container tall">
            <Bar data={barData} options={CHART_OPTS_BAR as any} />
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(220,38,38,.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(220,38,38,.15)', fontSize: 12, color: 'var(--text-secondary)' }}>
            🔴 La fascia <strong>15–28k€</strong> registra la <strong>maggiore pressione relativa</strong> (1,96%).
            Paradosso: chi ha redditi bassi-medi paga proporzionalmente di più rispetto alle fasce alte.
            Questo è il classico segnale di un tributo <strong>regressivo</strong>.
          </div>
        </div>

        {/* Tabella dettaglio */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Indicatore di sostenibilità per fascia</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fascia reddito</th>
                <th>Reddito medio</th>
                <th>Bollo medio</th>
                <th>Incidenza %</th>
                <th>Sostenibilità</th>
              </tr>
            </thead>
            <tbody>
              {PRESSIONE_DATA.labels.map((label, i) => {
                const inc = PRESSIONE_DATA.incidenza_pct[i];
                const sost = inc < 1.5 ? { label: 'Alta', color: 'var(--accent-green)' }
                  : inc < 1.8 ? { label: 'Media', color: 'var(--accent-blue)' }
                  : inc < 2.0 ? { label: 'Bassa', color: 'var(--accent-amber)' }
                  : { label: 'Critica', color: 'var(--accent-red)' };
                return (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{formatEuro(PRESSIONE_DATA.reddito_medio[i])}</td>
                    <td>{formatEuro(PRESSIONE_DATA.bollo_medio[i])}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${inc / 3 * 100}%`, background: sost.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontWeight: 700, color: sost.color }}>{inc.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: sost.color + '15', color: sost.color, border: `1px solid ${sost.color}33` }}>
                        {sost.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Insight box */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '⚠️', text: 'La fascia 15–28k€ ha incidenza più alta della fascia <15k€ — molti di questi contribuenti hanno veicoli leggermente più potenti pur restando vulnerabili.', color: 'rgba(220,38,38,.05)', border: 'rgba(220,38,38,.2)' },
              { icon: '💡', text: 'Una riduzione del 20% per le prime 2 fasce porterebbe l\'incidenza media sotto l\'1,5% per tutti i contribuenti con reddito < 28k€.', color: 'rgba(37,99,235,.05)', border: 'rgba(37,99,235,.2)' },
            ].map((ins, i) => (
              <div key={i} style={{ padding: '9px 13px', background: ins.color, border: `1px solid ${ins.border}`, borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {ins.icon} {ins.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cluster pressione */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🎯 Pressione fiscale per cluster di contribuenti</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {SCATTER_CLUSTERS.map(c => {
            const inc = ((c.y / c.x) * 100).toFixed(2);
            const incNum = parseFloat(inc);
            return (
              <div key={c.label} style={{ textAlign: 'center', padding: 16, background: c.color + '08', border: `1px solid ${c.color}33`, borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.color, margin: '0 auto 10px' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 2 }}>{inc}%</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>bollo / reddito</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Bollo: <strong>{formatEuro(c.y)}</strong><br />
                  Reddito: <strong>{formatEuro(c.x)}</strong>
                </div>
                <div className="progress-bar" style={{ marginTop: 10 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(incNum / 2.5 * 100, 100)}%`, background: c.color }} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className="badge" style={{ fontSize: 10, background: c.color + '15', color: c.color, border: `1px solid ${c.color}33` }}>
                    {formatNum(c.r)} contribuenti
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(37,99,235,.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37,99,235,.15)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong>📌 Nota metodologica:</strong> L'indicatore di pressione fiscale <em>bollo / reddito dichiarato</em> è un proxy della sostenibilità del tributo per il contribuente.
          Valori superiori al <strong>2%</strong> indicano una pressione potenzialmente critica che può aumentare il rischio di morosità.
          Il modello integrato (contribuente-centrico) punta a portare tutti i cluster sotto la soglia dell'1,8%.
        </div>
      </div>
    </div>
  );
}
