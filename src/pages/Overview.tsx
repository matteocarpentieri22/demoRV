import { KpiGrid } from '../components/KpiCards';
import {
  GettitoProvincia, TrendStoricoChart, ComplianceChart,
  FasceRedditoChart,
} from '../components/Charts';
import { GETTITO_PER_PROVINCIA, formatEuro } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Sliders } from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();
  return (
    <div className="animate-in">
      {/* Hero */}
      <div className="hero-banner" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
              Fiscal Intelligence Platform · Anno fiscale 2025
            </div>
            <h1 className="hero-title">Tassa Auto – Regione Veneto</h1>
            <p className="hero-subtitle">Cruscotto integrato per l'analisi e la simulazione del gettito dalla tassa automobilistica regionale</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button className="btn btn-secondary" style={{ backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#fff' }} onClick={() => navigate('/chatbot')}>
              <Bot size={15} /> Agente AI <ArrowRight size={13} />
            </button>
            <button className="btn btn-secondary" style={{ backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#fff' }} onClick={() => navigate('/whatif')}>
              <Sliders size={15} /> Simulazione <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <KpiGrid />

      {/* Charts Row 1 */}
      <div className="chart-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📊 Gettito per Provincia</div>
              <div className="card-subtitle">Distribuzione del gettito annuo (€M)</div>
            </div>
            <span className="badge badge-blue">2025</span>
          </div>
          <div className="chart-container">
            <GettitoProvincia />
          </div>
          {/* Mini table */}
          <div style={{ marginTop: 14 }}>
            {GETTITO_PER_PROVINCIA.labels.map((prov, i) => (
              <div key={prov} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(99,120,255,.05)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{prov}</span>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(GETTITO_PER_PROVINCIA.values[i] / 38_200_000 * 100).toFixed(0)}%`, background: 'var(--accent-blue)', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', minWidth: 46, textAlign: 'right' }}>
                    {formatEuro(GETTITO_PER_PROVINCIA.values[i])}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <div className="card-title">📈 Trend Storico Gettito</div>
              <div className="card-subtitle">Evoluzione 2019–2025 (€M)</div>
            </div>
            <span className="badge badge-green">+8,9% 5Y</span>
          </div>
          <div className="chart-container" style={{ flex: 1, minHeight: 240 }}>
            <TrendStoricoChart />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="chart-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">👥 Gettito per Fascia di Reddito</div>
              <div className="card-subtitle">Distribuzione per capacità contributiva (€M)</div>
            </div>
          </div>
          <div className="chart-container">
            <FasceRedditoChart />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">✅ Trend Compliance Rate</div>
              <div className="card-subtitle">% contribuenti in regola 2019–2025</div>
            </div>
            <span className="badge badge-green">87,4%</span>
          </div>
          <div className="chart-container">
            <ComplianceChart />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79,142,247,.08), rgba(139,92,246,.04))', border: '1px solid rgba(79,142,247,.2)', cursor: 'pointer' }} onClick={() => navigate('/chatbot')}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#1e3a8a,#8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Agente Conversazionale AI</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fai domande in linguaggio naturale sui dati fiscali e ricevi analisi istantanee</div>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--accent-blue)', flexShrink: 0 }} />
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.06), rgba(6,182,212,.04))', border: '1px solid rgba(16,185,129,.2)', cursor: 'pointer' }} onClick={() => navigate('/whatif')}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#064e3b,#0e7490)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎛️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Simulazione What-If</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Simula manovre fiscali e calcola l'impatto su gettito, equità e contribuenti</div>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--accent-green)', flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
