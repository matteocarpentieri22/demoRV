import { CLUSTER, formatNum, formatEuro, FASCE_REDDITO } from '../data/mockData';
import { ClusterBarChart } from '../components/Charts';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';

export default function ClusterPage() {
  return (
    <div className="animate-in">
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <h1 className="hero-title">👥 Cluster Contribuenti & Vulnerabilità Fiscale</h1>
        <p className="hero-subtitle">Segmentazione dei contribuenti veneti per capacità fiscale, compliance e rischio di morosità</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Cluster chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Distribuzione Cluster</div>
            <span className="badge badge-violet">312.847 contribuenti</span>
          </div>
          <div className="chart-container tall">
            <ClusterBarChart />
          </div>
        </div>

        {/* Cluster cards */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🗺️ Mappa Vulnerabilità</div>
          </div>
          <div className="cluster-grid">
            {CLUSTER.map(c => (
              <div className="cluster-item" key={c.nome}>
                <div className="cluster-dot" style={{ background: c.color }} />
                <div style={{ flex: 1 }}>
                  <div className="cluster-name">{c.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Reddito medio: {formatEuro(c.reddito_medio)} · Bollo medio: {formatEuro(c.bollo_medio)}
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${c.morosita * 2.5}%`, background: c.color }} />
                  </div>
                </div>
                <div className="cluster-stat">
                  <div className="cluster-stat-value">{formatNum(c.contribuenti)}</div>
                  <div className="cluster-stat-label">contribuenti</div>
                  <div style={{ fontSize: 11, color: c.morosita > 15 ? 'var(--accent-red)' : c.morosita > 5 ? 'var(--accent-amber)' : 'var(--accent-green)', fontWeight: 600, marginTop: 2 }}>
                    {c.morosita}% morosi
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.03)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={20} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>⚠️ Attenzione – Cluster critico</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                I 28.400 contribuenti <strong>"Vulnerabili ad alto rischio"</strong> mostrano un tasso di morosità del 34,2%.
                Qualsiasi aumento del bollo su questo segmento rischia di far salire il tasso all'<strong>oltre 45%</strong>.
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ border: '1px solid rgba(245,158,11,.2)', background: 'rgba(245,158,11,.03)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <TrendingDown size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>📉 Pressione fiscale auto</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Per il cluster "Vulnerabili", il bollo auto rappresenta il <strong>1,9% del reddito dichiarato</strong>.
                Per "Alto reddito" è solo lo <strong>0,3%</strong>. Indicatore di regressività del tributo attuale.
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ border: '1px solid rgba(16,185,129,.2)', background: 'rgba(16,185,129,.03)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Shield size={20} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5 }}>🛡️ Cluster a basso rischio</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                I 124.047 contribuenti "Benestanti" e "Alto reddito" hanno morosità <strong>&lt;1,2%</strong> e
                possono sostenere moderate variazioni del bollo senza impatto sul gettito.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Dettaglio Cluster per Indicatori</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Contribuenti</th>
              <th>Reddito Medio</th>
              <th>Bollo Medio</th>
              <th>% Incidenza</th>
              <th>Morosità</th>
              <th>Rischio</th>
            </tr>
          </thead>
          <tbody>
            {CLUSTER.map(c => {
              const incidenza = ((c.bollo_medio / c.reddito_medio) * 100).toFixed(1);
              const rischio = c.morosita > 15 ? { label: 'Alto', color: 'var(--accent-red)' }
                : c.morosita > 5 ? { label: 'Medio', color: 'var(--accent-amber)' }
                : { label: 'Basso', color: 'var(--accent-green)' };
              return (
                <tr key={c.nome}>
                  <td>
                    <span style={{ marginRight: 6 }}>{c.icon}</span>{c.nome}
                  </td>
                  <td>{formatNum(c.contribuenti)}</td>
                  <td>{formatEuro(c.reddito_medio)}</td>
                  <td>{formatEuro(c.bollo_medio)}</td>
                  <td>{incidenza}%</td>
                  <td style={{ color: rischio.color }}>{c.morosita}%</td>
                  <td><span className="badge" style={{ background: rischio.color + '22', color: rischio.color, border: `1px solid ${rischio.color}44` }}>{rischio.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Fascia reddito vs bollo */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">💡 Bollo Medio per Fascia di Reddito</div>
          <span className="badge badge-blue">Analisi equità</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {FASCE_REDDITO.labels.map((label, i) => (
            <div key={label} style={{ textAlign: 'center', padding: 16, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: FASCE_REDDITO.colors[i] }}>
                {formatEuro(FASCE_REDDITO.bollo_medio[i])}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>bollo medio/anno</div>
              <div className="progress-bar" style={{ marginTop: 8 }}>
                <div className="progress-fill" style={{ width: `${(FASCE_REDDITO.bollo_medio[i] / 1728 * 100).toFixed(0)}%`, background: FASCE_REDDITO.colors[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
