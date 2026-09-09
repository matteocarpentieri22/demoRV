import { useState, useMemo } from 'react';
import { SIM_BASE, SCENARI_PRESET, formatEuro, formatNum, FASCE_REDDITO, CLASSI_EMISSIVE } from '../data/mockData';
import { SimCompareChart, FasceRedditoChart, ClassiEmissiveChart } from '../components/Charts';
import { Play, RefreshCw, CheckCircle } from 'lucide-react';

type Mode = 'custom' | 'preset';

export default function WhatIf() {
  const [mode, setMode] = useState<Mode>('custom');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Custom sliders: sconto % per fascia reddito (0–50)
  const [sconti, setSconti] = useState([0, 0, 0, 0, 0]);
  // Sovrattasse emissive
  const [sovTasse, setSovTasse] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [simulated, setSimulated] = useState(false);

  const preset = SCENARI_PRESET.find(s => s.id === selectedPreset);

  // Compute simulated gettito per fascia
  const simFasceGettito = useMemo(() => {
    const discounts = mode === 'preset' && preset ? preset.sconti : sconti;
    return SIM_BASE.gettito.map((g, i) => {
      const factor = 1 - (discounts[i] ?? 0) / 100;
      return parseFloat((g / 1_000_000 * factor).toFixed(2));
    });
  }, [sconti, mode, preset]);

  const simEmissiveGettito = useMemo(() => {
    const overs = mode === 'preset' && preset ? preset.sovrattasse_emissive : sovTasse;
    return CLASSI_EMISSIVE.gettito.map((g, i) => {
      const factor = 1 + (overs[i] ?? 0) / 100;
      return g * factor;
    });
  }, [sovTasse, mode, preset]);

  const totaleAttuale  = SIM_BASE.gettito.reduce((a, b) => a + b, 0);
  const totaleFasceSimulato = simFasceGettito.reduce((a, b) => a + b * 1_000_000, 0);
  const totaleEmissiveSimulato = simEmissiveGettito.reduce((a, b) => a + b, 0);
  const totaleSimulato = mode === 'preset' && preset
    ? totaleAttuale + preset.delta_gettito
    : (totaleFasceSimulato + totaleEmissiveSimulato) / 2;
  const delta = totaleSimulato - totaleAttuale;
  const deltaPct = ((delta / totaleAttuale) * 100).toFixed(1);

  const effBeneficiari = mode === 'preset' && preset
    ? preset.beneficiari
    : sconti.reduce((acc, s, i) => s > 0 ? acc + SIM_BASE.contribuenti[i] : acc, 0);
  const effPenalizzati = mode === 'preset' && preset
    ? preset.penalizzati
    : sovTasse.reduce((acc, s, i) => s > 0 ? acc + Math.round(CLASSI_EMISSIVE.veicoli[i] * 0.6) : acc, 0);

  function resetAll() {
    setSconti([0, 0, 0, 0, 0]);
    setSovTasse([0, 0, 0, 0, 0, 0, 0, 0]);
    setSelectedPreset(null);
    setSimulated(false);
    setMode('custom');
  }

  const TABS = ['Fasce di Reddito', 'Classi Emissive', 'Confronto Gettito'];

  return (
    <div className="animate-in">
      {/* Hero */}
      <div className="hero-banner" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="hero-title">🎛️ Simulazione What-If</h1>
            <p className="hero-subtitle">Simula manovre fiscali e calcola l'impatto su gettito, equità e distribuzione per fascia/veicolo</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn ${mode === 'preset' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('preset')}>Scenari preimpostati</button>
            <button className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('custom')}>Personalizzato</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

        {/* LEFT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Preset scenarios */}
          {mode === 'preset' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">🎯 Scenari Preimpostati</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SCENARI_PRESET.map(sc => (
                  <div
                    key={sc.id}
                    className={`scenario-card${selectedPreset === sc.id ? ' selected' : ''}`}
                    onClick={() => { setSelectedPreset(sc.id); setSimulated(true); }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                      {sc.titolo}
                      {sc.id === 'gettito_invariato' && <span className="badge badge-violet" style={{ fontSize: 9, padding: '2px 6px' }}>UC3</span>}
                      {sc.id === 'politica_verde' && <span className="badge badge-violet" style={{ fontSize: 9, padding: '2px 6px' }}>UC5</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, position: 'relative' }}>{sc.descrizione}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative' }}>
                      <span className={`badge ${sc.delta_pct <= 0 ? 'badge-amber' : 'badge-green'}`}>
                        Δ Gettito: {sc.delta_pct > 0 ? '+' : ''}{sc.delta_pct}%
                      </span>
                      <span className="badge badge-blue">{formatNum(sc.beneficiari)} beneficiari</span>
                    </div>
                    {selectedPreset === sc.id && (
                      <CheckCircle size={16} style={{ position: 'absolute', top: 14, right: 14, color: 'var(--accent-blue)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom sliders */}
          {mode === 'custom' && (
            <>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">👥 Sconto per Fascia Reddito</div>
                </div>
                {SIM_BASE.labels.map((label, i) => (
                  <div className="slider-group" key={label}>
                    <div className="slider-label">
                      <span>{label}</span>
                      <span className="slider-value">{sconti[i] > 0 ? `-${sconti[i]}%` : sconti[i] < 0 ? `+${Math.abs(sconti[i])}%` : '0%'}</span>
                    </div>
                    <input
                      type="range" min={-20} max={50} step={5}
                      value={sconti[i]}
                      onChange={e => { const v = [...sconti]; v[i] = +e.target.value; setSconti(v); setSimulated(true); }}
                      style={{ accentColor: FASCE_REDDITO.colors[i] }}
                    />
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">🚗 Variazione per Classe Emissiva</div>
                </div>
                {CLASSI_EMISSIVE.labels.map((label, i) => (
                  <div className="slider-group" key={label}>
                    <div className="slider-label">
                      <span style={{ fontSize: 12 }}>{label}</span>
                      <span className="slider-value">{sovTasse[i] > 0 ? `+${sovTasse[i]}%` : sovTasse[i] < 0 ? `${sovTasse[i]}%` : '0%'}</span>
                    </div>
                    <input
                      type="range" min={-50} max={50} step={5}
                      value={sovTasse[i]}
                      onChange={e => { const v = [...sovTasse]; v[i] = +e.target.value; setSovTasse(v); setSimulated(true); }}
                      style={{ accentColor: CLASSI_EMISSIVE.colors[i] }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setSimulated(true)}>
              <Play size={14} /> Simula
            </button>
            <button className="btn btn-secondary" onClick={resetAll}>
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Results */}
          {simulated && (
            <div className="card animate-in" style={{ background: 'linear-gradient(135deg, rgba(79,142,247,.06), rgba(139,92,246,.04))', borderColor: 'rgba(79,142,247,.2)' }}>
              <div className="card-header">
                <div className="card-title">📊 Risultati Simulazione</div>
                <span className="badge badge-violet">Simulato</span>
              </div>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-label">Gettito Attuale</div>
                  <div className="result-value" style={{ color: 'var(--accent-blue)' }}>{formatEuro(totaleAttuale)}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Gettito Simulato</div>
                  <div className="result-value" style={{ color: delta >= 0 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                    {formatEuro(totaleSimulato)}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Delta Gettito</div>
                  <div className="result-value" style={{ color: delta >= 0 ? 'var(--accent-green)' : 'var(--accent-amber)', fontSize: 18 }}>
                    {delta >= 0 ? '+' : ''}{formatEuro(delta)} ({delta >= 0 ? '+' : ''}{deltaPct}%)
                  </div>
                </div>
              </div>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-label">🟢 Beneficiari</div>
                  <div className="result-value" style={{ color: 'var(--accent-green)', fontSize: 18 }}>{formatNum(effBeneficiari)}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">🔴 Penalizzati</div>
                  <div className="result-value" style={{ color: 'var(--accent-red)', fontSize: 18 }}>{formatNum(effPenalizzati)}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">🟡 Invariati</div>
                  <div className="result-value" style={{ color: 'var(--accent-amber)', fontSize: 18 }}>
                    {formatNum(Math.max(0, 312_847 - effBeneficiari - effPenalizzati))}
                  </div>
                </div>
              </div>

              {/* Impact bar */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Distribuzione contribuenti impattati</div>
                <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
                  <div style={{ flex: effBeneficiari, background: 'var(--accent-green)' }} />
                  <div style={{ flex: Math.max(0, 312_847 - effBeneficiari - effPenalizzati), background: 'var(--accent-amber)', opacity: .6 }} />
                  <div style={{ flex: effPenalizzati, background: 'var(--accent-red)' }} />
                </div>
              </div>

              {/* UC5: Salvaguardia Sociale Matrix */}
              {selectedPreset === 'politica_verde' && (
                <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>🛡️ Matrice di Salvaguardia Sociale</div>
                    <span className="badge badge-green">UC5</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                    La sovrattassa per i veicoli Euro 0-2 (più inquinanti) viene sterilizzata per i contribuenti con reddito <strong>&lt; 28k€</strong> (cluster vulnerabili/fragili),
                    evitando un effetto regressivo.
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Fascia Reddito</th>
                        <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Euro 0–2</th>
                        <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Euro 3–4</th>
                        <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Euro 5–6 / Elettrico</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid rgba(15,23,65,.05)', fontWeight: 600 }}>&lt; 15k€ (Vulnerabili)</td>
                        <td style={{ padding: '8px', textAlign: 'center', background: 'rgba(5,150,105,.1)', color: 'var(--accent-green)', fontWeight: 700 }}>Esenzione (0%)</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Invariato</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700 }}>-10 / -50%</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid rgba(15,23,65,.05)', fontWeight: 600 }}>15–28k€ (Fragili)</td>
                        <td style={{ padding: '8px', textAlign: 'center', background: 'rgba(5,150,105,.1)', color: 'var(--accent-green)', fontWeight: 700 }}>Esenzione (0%)</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Invariato</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700 }}>-10 / -50%</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid rgba(15,23,65,.05)', fontWeight: 600 }}>&gt; 28k€ (Classe Media / Alto Reddito)</td>
                        <td style={{ padding: '8px', textAlign: 'center', background: 'rgba(220,38,38,.1)', color: 'var(--accent-red)', fontWeight: 700 }}>+40 / +30 / +20%</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--accent-red)' }}>+10%</td>
                        <td style={{ padding: '8px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 700 }}>-10 / -50%</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <strong>Impatto:</strong> 28.400 contribuenti vulnerabili protetti dall'aumento.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          <div className="card">
            <div className="tabs">
              {TABS.map((t, i) => (
                <button key={t} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
              ))}
            </div>
            <div className="chart-container tall">
              {activeTab === 0 && <FasceRedditoChart simValues={simulated ? simFasceGettito : undefined} />}
              {activeTab === 1 && <ClassiEmissiveChart simValues={simulated ? simEmissiveGettito.map(v => v / 1_000_000) : undefined} />}
              {activeTab === 2 && (simulated
                ? <SimCompareChart simGettito={simFasceGettito} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>Avvia una simulazione per vedere il confronto</div>
              )}
            </div>
          </div>

          {/* Info table */}
          {simulated && (
            <div className="card animate-in">
              <div className="card-header">
                <div className="card-title">📋 Dettaglio per Fascia di Reddito</div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fascia</th>
                    <th>Contribuenti</th>
                    <th>Gettito Attuale</th>
                    <th>Gettito Simulato</th>
                    <th>Δ Gettito</th>
                  </tr>
                </thead>
                <tbody>
                  {SIM_BASE.labels.map((label, i) => {
                    const att  = SIM_BASE.gettito[i];
                    const sim  = simFasceGettito[i] * 1_000_000;
                    const diff = sim - att;
                    return (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{formatNum(SIM_BASE.contribuenti[i])}</td>
                        <td>{formatEuro(att)}</td>
                        <td style={{ color: sim < att ? 'var(--accent-amber)' : 'var(--text-primary)' }}>{formatEuro(sim)}</td>
                        <td style={{ color: diff < 0 ? 'var(--accent-amber)' : diff > 0 ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {diff === 0 ? '—' : `${diff < 0 ? '' : '+'}${formatEuro(diff)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Province distribution */}
          {simulated && (
            <div className="card animate-in">
              <div className="card-header">
                <div className="card-title">📍 Impatto per Provincia – Territori più esposti</div>
                <span className="badge badge-violet">UC4</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provincia</th>
                    <th>Contribuenti coinvolti</th>
                    <th>Δ Gettito stimato</th>
                    <th>Impatto medio / soggetto</th>
                    <th>Impatto massimo</th>
                    <th>Esposizione</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prov: 'Venezia',  coinvolti: 18_400, delta: -780_000,   med: -42, max: -124 },
                    { prov: 'Verona',   coinvolti: 15_700, delta: -650_000,   med: -41, max: -118 },
                    { prov: 'Padova',   coinvolti: 14_800, delta: -590_000,   med: -40, max: -112 },
                    { prov: 'Vicenza',  coinvolti: 12_900, delta: -490_000,   med: -38, max: -105 },
                    { prov: 'Treviso',  coinvolti: 11_600, delta: -430_000,   med: -37, max: -98  },
                    { prov: 'Belluno',  coinvolti: 8_200,  delta: -310_000,   med: -38, max: -103 },
                    { prov: 'Rovigo',   coinvolti: 6_800,  delta: -280_000,   med: -41, max: -116 },
                  ].map(r => {
                    const scaledDelta = Math.round(r.delta * (1 - (sconti.reduce((a, b) => a + b, 0) === 0 ? 0 : 0.5)));
                    const esposizione = Math.abs(r.coinvolti / 312_847 * 100);
                    return (
                      <tr key={r.prov}>
                        <td>{r.prov}</td>
                        <td>{formatNum(r.coinvolti)}</td>
                        <td style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{formatEuro(r.delta)}</td>
                        <td style={{ color: 'var(--accent-green)' }}>{formatEuro(r.med)}/anno</td>
                        <td style={{ color: 'var(--accent-green)' }}>{formatEuro(r.max)}/anno</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 60, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${esposizione * 3}%`, background: esposizione > 5 ? 'var(--accent-amber)' : 'var(--accent-green)', borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: esposizione > 5 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                              {esposizione.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
