import { ForecastChart, TrendStoricoChart } from '../components/Charts';
import { formatEuro } from '../data/mockData';
import { FORECAST } from '../data/mockData';

export default function ForecastPage() {
  const scenarios = [
    { label: 'Scenario attuale', color: '#4f8ef7', values: FORECAST.scenario_attuale, desc: 'Regole fiscali invariate, crescita demografica stimata +0,8%/anno' },
    { label: 'Scenario alternativo', color: '#f97316', values: FORECAST.scenario_alternativo, desc: 'Manovra di equità fiscale: riduzione fascia bassa, compensazione fascia alta' },
    { label: 'Scenario ottimista', color: '#10b981', values: FORECAST.scenario_ottimista, desc: 'Aumento compliance +3 punti, crescita parco veicolare +2%/anno' },
  ];

  return (
    <div className="animate-in">
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <h1 className="hero-title">📈 Previsioni Gettito 2026–2028</h1>
        <p className="hero-subtitle">Forecast del gettito nei prossimi 3 anni con scenari alternativi e analisi degli scostamenti</p>
      </div>

      {/* Scenario summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {scenarios.map(sc => (
          <div key={sc.label} className="card" style={{ borderColor: sc.color + '44', background: sc.color + '08' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: sc.color, flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: sc.color }}>{sc.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{sc.desc}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {sc.values.slice(1).map((v, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px 6px', background: 'var(--bg-surface)', borderRadius: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: sc.color }}>{formatEuro(v)}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{FORECAST.labels[i + 1]}</div>
                  <div style={{ fontSize: 10, color: v >= sc.values[i] ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: 1 }}>
                    {v >= sc.values[i] ? '+' : ''}{((v - sc.values[i]) / sc.values[i] * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">📊 Confronto Scenari 2025–2028</div>
          <span className="badge badge-blue">3-year forecast</span>
        </div>
        <div className="chart-container" style={{ height: 320 }}>
          <ForecastChart />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Historical */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📉 Trend Storico di Riferimento</div>
          </div>
          <div className="chart-container">
            <TrendStoricoChart />
          </div>
        </div>

        {/* Analysis */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔍 Analisi degli Scostamenti</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { anno: '2026', attuale: 185_800_000, alternativo: 181_200_000, ottimista: 189_400_000 },
              { anno: '2027', attuale: 187_300_000, alternativo: 183_700_000, ottimista: 194_200_000 },
              { anno: '2028', attuale: 188_900_000, alternativo: 187_400_000, ottimista: 198_700_000 },
            ].map(r => (
              <div key={r.anno} style={{ padding: 14, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>Anno {r.anno}</div>
                {[
                  { label: 'Attuale', v: r.attuale, color: '#4f8ef7' },
                  { label: 'Alternativo', v: r.alternativo, color: '#f97316' },
                  { label: 'Ottimista', v: r.ottimista, color: '#10b981' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{formatEuro(s.v)}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: '5px 10px', background: 'rgba(16,185,129,.08)', borderRadius: 6, fontSize: 11, color: 'var(--accent-green)' }}>
                  Range: {formatEuro(r.alternativo)} – {formatEuro(r.ottimista)} (delta max: {formatEuro(r.ottimista - r.alternativo)})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
