// ============================================================
// DATI MOCK – Fiscal Intelligence Platform – Regione Veneto
// ============================================================

export const KPI = {
  gettito_totale: 183_420_000,
  contribuenti_totali: 312_847,
  veicoli_totali: 487_231,
  compliance_rate: 87.4,
  posizioni_scadute: 41_203,
  gettito_recuperabile: 12_840_000,
};

export const PROVINCE_LABELS = ['Venezia', 'Verona', 'Vicenza', 'Padova', 'Treviso', 'Belluno', 'Rovigo'];
export const PROVINCE_CODES  = ['VE', 'VR', 'VI', 'PD', 'TV', 'BL', 'RO'];

export const GETTITO_PER_PROVINCIA = {
  labels: PROVINCE_LABELS,
  values: [38_200_000, 35_800_000, 28_400_000, 32_100_000, 26_500_000, 12_300_000, 10_120_000],
};

export const FASCE_REDDITO = {
  labels:        ['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'],
  contribuenti:  [68_400, 112_300, 89_200, 28_700, 14_247],
  gettito:       [14_200_000, 48_300_000, 62_100_000, 34_200_000, 24_620_000],
  bollo_medio:   [207, 430, 696, 1192, 1728],
  colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
};

export const CLASSI_EMISSIVE = {
  labels:  ['Euro 0', 'Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'Elettrico/Ibrido'],
  veicoli: [8_200, 12_400, 28_300, 54_100, 148_200, 132_400, 88_100, 15_531],
  gettito: [2_100_000, 3_800_000, 7_200_000, 12_400_000, 58_300_000, 52_100_000, 38_200_000, 9_320_000],
  colors:  ['#dc2626','#ea580c','#d97706','#ca8a04','#65a30d','#16a34a','#0284c7','#7c3aed'],
};

export const TREND_STORICO = {
  labels:     ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  gettito:    [168_400_000, 152_100_000, 159_800_000, 171_200_000, 178_300_000, 181_900_000, 183_420_000],
  compliance: [83.1, 79.4, 81.2, 84.7, 86.1, 87.0, 87.4],
};

export const FORECAST = {
  labels:             ['2025', '2026', '2027', '2028'],
  scenario_attuale:   [183_420_000, 185_800_000, 187_300_000, 188_900_000],
  scenario_alternativo:[183_420_000, 181_200_000, 183_700_000, 187_400_000],
  scenario_ottimista: [183_420_000, 189_400_000, 194_200_000, 198_700_000],
};

export interface Cluster {
  nome: string;
  contribuenti: number;
  bollo_medio: number;
  reddito_medio: number;
  morosita: number;
  color: string;
  icon: string;
}

export const CLUSTER: Cluster[] = [
  { nome: 'Vulnerabili ad alto rischio', contribuenti: 28_400,  bollo_medio: 218,   reddito_medio: 11_200, morosita: 34.2, color: '#ef4444', icon: '🔴' },
  { nome: 'Fragili ma complianti',        contribuenti: 42_100,  bollo_medio: 387,   reddito_medio: 19_800, morosita:  8.1, color: '#f97316', icon: '🟠' },
  { nome: 'Classe media stabile',          contribuenti: 118_300, bollo_medio: 631,   reddito_medio: 38_400, morosita:  3.4, color: '#eab308', icon: '🟡' },
  { nome: 'Benestanti complianti',         contribuenti: 89_200,  bollo_medio: 1_124, reddito_medio: 62_100, morosita:  1.2, color: '#22c55e', icon: '🟢' },
  { nome: 'Alto reddito',                  contribuenti: 34_847,  bollo_medio: 1_842, reddito_medio: 98_700, morosita:  0.8, color: '#3b82f6', icon: '🔵' },
];

export const RISCOSSIONE = {
  labels:       ['Recuperabile\npriorità', 'Recuperabile\nmedio', 'Fragile\n(sospendere)', 'Inesigibile'],
  contribuenti: [12_400, 18_700, 7_200, 2_903],
  importo:      [6_200_000, 4_840_000, 1_420_000, 380_000],
  colors: ['#16a34a', '#3b82f6', '#f97316', '#ef4444'],
};

export const SIM_BASE = {
  labels:             ['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'],
  contribuenti:       [68_400, 112_300, 89_200, 28_700, 14_247],
  bollo_medio:        [207, 430, 696, 1192, 1728],
  gettito:            [14_200_000, 48_300_000, 62_100_000, 34_200_000, 24_620_000],
};

export interface ScenarioPreset {
  id: string;
  titolo: string;
  descrizione: string;
  delta_gettito: number;
  delta_pct: number;
  beneficiari: number;
  penalizzati: number;
  invariati: number;
  sconti: number[]; // % sconto per fascia reddito
  sovrattasse_emissive: number[]; // % sovrattassa per classe emissiva
}

export const SCENARI_PRESET: ScenarioPreset[] = [
  {
    id: 'equita_ambientale',
    titolo: 'Equità ambientale + protezione redditi bassi',
    descrizione: 'Aumento per Euro 0–3, riduzione per Elettrico/Ibrido, protezione contribuenti <15k€',
    delta_gettito: -1_840_000, delta_pct: -1.0,
    beneficiari: 83_931, penalizzati: 102_900, invariati: 126_016,
    sconti: [30, 0, 0, 0, 0],
    sovrattasse_emissive: [25, 20, 15, 10, 0, 0, 0, -40],
  },
  {
    id: 'gettito_invariato',
    titolo: 'Redistribuzione a gettito invariato',
    descrizione: 'Riduzione per fasce basse, compensazione sulle fasce alte, saldo netto ≈ 0',
    delta_gettito: 120_000, delta_pct: 0.07,
    beneficiari: 180_700, penalizzati: 43_000, invariati: 89_147,
    sconti: [25, 10, 0, -5, -15],
    sovrattasse_emissive: [10, 8, 5, 2, 0, 0, -5, -20],
  },
  {
    id: 'politica_verde',
    titolo: 'Politica verde con salvaguardia sociale',
    descrizione: 'Forte sovrattassa su Euro 0–2 per disincentivare inquinamento. I contribuenti vulnerabili (< 28k€) sono esentati dall\'aumento tramite salvaguardia sociale.',
    delta_gettito: 2_400_000, delta_pct: 1.3,
    beneficiari: 103_631, penalizzati: 20_800, invariati: 188_416,
    sconti: [0, 0, 0, 0, 0],
    sovrattasse_emissive: [40, 30, 20, 10, 0, 0, -10, -50],
  },
];

// Chat responses
export interface ChatResponse {
  risposta: string;
  suggestedChart?: string;
}

export function getAIResponse(input: string): ChatResponse {
  const q = input.toLowerCase();

  if (q.includes('gettito') && !q.includes('simul') && !q.includes('previs')) {
    return {
      risposta: `📊 **Analisi del Gettito Totale**\n\nIl gettito complessivo da tassa auto nella Regione Veneto ammonta a **€ 183,4M** per l'anno 2025.\n\n**Per provincia:**\n• Venezia: €38,2M (20,8%)\n• Verona: €35,8M (19,5%)\n• Padova: €32,1M (17,5%)\n• Vicenza: €28,4M (15,5%)\n• Treviso: €26,5M (14,4%)\n• Belluno: €12,3M (6,7%)\n• Rovigo: €10,1M (5,5%)\n\n📈 **Trend:** +1,2% rispetto al 2024, crescita costante dal 2021.`,
      suggestedChart: 'provincia',
    };
  }
  if (q.includes('riduz') || q.includes('simul') || (q.includes('bollo') && q.includes('reddito'))) {
    return {
      risposta: `🎯 **Simulazione Riduzione Bollo – Fasce Basse**\n\nUna riduzione del **30%** per contribuenti con reddito < €15.000:\n\n• **Contribuenti coinvolti:** 68.400\n• **Bollo medio:** €207 → **€145** (-€62)\n• **Perdita di gettito:** -€4.241.000 (-2,3%)\n• **Risparmio medio:** €62/anno per contribuente\n\n⚖️ Compensando con +5% sulla fascia >75k€:\n• Recupero: +€1.236.000\n• **Delta netto:** -€3.005.000 (-1,6%)\n\n💡 Puoi simulare questa manovra nel cruscotto **What-If →**`,
      suggestedChart: 'fasce',
    };
  }
  if (q.includes('equit') || q.includes('contribuente-centrico') || q.includes('profilo')) {
    return {
      risposta: `⚖️ **Analisi di Equità Fiscale – Modello Integrato**\n\nPassando da modello **veicolo-centrico** a **contribuente-centrico**:\n\n| Categoria | Contribuenti | Variazione media |\n|---|---|---|\n| Paga meno | 83.931 | -€142/anno |\n| Paga uguale | 126.016 | €0 |\n| Paga di più | 102.900 | +€89/anno |\n\n🔍 Principali beneficiari: contribuenti con reddito <28k€ e veicoli Euro 4.\n📍 Province più impattate positivamente: Rovigo (+€3,2M), Belluno (+€2,1M).`,
      suggestedChart: 'cluster',
    };
  }
  if (q.includes('vuln') || q.includes('fragil') || q.includes('rischio')) {
    return {
      risposta: `🗺️ **Mappa di Vulnerabilità Fiscale**\n\n🔴 **Vulnerabili ad alto rischio** — 28.400 soggetti\n• Reddito medio: €11.200 | Bollo medio: €218\n• Morosità: 34,2% | Veicoli: Euro 2–3 prevalenti\n\n🟠 **Fragili ma complianti** — 42.100 soggetti\n• Reddito medio: €19.800 | Bollo medio: €387\n• Morosità: 8,1% — attenzione in caso di aumenti\n\n⚠️ Un aumento >10% sulla fascia <28k€ aumenterebbe la morosità del **12–18%** secondo il modello predittivo.`,
      suggestedChart: 'cluster',
    };
  }
  if (q.includes('previs') || q.includes('forecast') || q.includes('futur') || q.includes('anni')) {
    return {
      risposta: `📈 **Previsione Gettito 2026–2028**\n\n**Scenario attuale (regole invariate):**\n• 2026: €185,8M (+1,3%)\n• 2027: €187,3M (+0,8%)\n• 2028: €188,9M (+0,9%)\n\n**Scenario alternativo (manovra equità):**\n• 2026: €181,2M (-1,2%)\n• 2027: €183,7M (+1,4%)\n• 2028: €187,4M (+2,0%)\n\n📊 A 3 anni lo scenario alternativo **converge** con quello attuale grazie all'aumento della compliance stimata (+3,2 punti percentuali).`,
      suggestedChart: 'forecast',
    };
  }
  if (q.includes('morosi') || q.includes('scadut') || q.includes('riscoss') || q.includes('recup')) {
    return {
      risposta: `💼 **Analisi Riscossione e Compliance**\n\nPosizioni scadute totali: **41.203 contribuenti** → €12.840.000\n\n🟢 **Recuperabile prioritario:** 12.400 soggetti, €6,2M\n🔵 **Recuperabile medio termine:** 18.700 soggetti, €4,8M\n🟠 **Fragili (sospendere):** 7.200 soggetti, €1,4M\n🔴 **Inesigibile:** 2.903 soggetti, €380k\n\n✅ **Raccomandazione:** Concentrare le azioni sui 12.400 soggetti prioritari con storico di compliance >3 anni.`,
      suggestedChart: 'riscossione',
    };
  }
  if (q.includes('scenar') || q.includes('alternativ') || q.includes('proponi') || q.includes('2%')) {
    return {
      risposta: `🤖 **3 Scenari AI – Vincolo: perdita max 2% gettito**\n\n**Scenario 1 – Equità progressiva (-1,0%)**\nRiduzione 20% per <15k€, invariato 15–28k€, +3% per >75k€.\n*Trade-off: buona equità, morosità -8%.*\n\n**Scenario 2 – Verde protetto (-0,8%)**\nAumento Euro 0–2 (+25%), incentivo Elettrico (-40%), esenzione totale per reddito <12k€.\n*Trade-off: massimo impatto ambientale.*\n\n**Scenario 3 – Redistribuzione graduata (-1,6%)**\nScala continua reddito/kW. Massima equità, complessità normativa alta.\n\n💡 Apri il **cruscotto What-If →** per simulare uno scenario.`,
      suggestedChart: 'scenario',
    };
  }
  if (q.includes('ambient') || q.includes('inquinant') || q.includes('emission') || q.includes('euro')) {
    return {
      risposta: `🌿 **Politica Ambientale Modulata sulla Capacità Fiscale**\n\nScenario "Verde Protetto":\n\n**Aumento per veicoli inquinanti:**\n• Euro 0: +40% | Euro 1: +30% | Euro 2: +20%\n\n**Incentivi per veicoli puliti:**\n• Euro 6: -10% | Elettrico/Ibrido: -50%\n\n**Protezione sociale:**\n• Contribuenti con reddito <15k€: esenzione dall'aumento\n\n📊 **Impatto stimato:**\n• Gettito: +€2,4M (+1,3%)\n• Beneficiari: 103.631 | Penalizzati: 20.800\n• Riduzione parco Euro 0–2 attesa: -8% in 3 anni`,
      suggestedChart: 'emissive',
    };
  }

  return {
    risposta: `👋 Sono il tuo **assistente fiscale AI** per la Regione Veneto.\n\nPosso aiutarti con:\n\n• 📊 **Analisi gettito** per provincia e fascia di reddito\n• ⚖️ **Simulazioni di manovre fiscali** e impatto sul gettito\n• 🗺️ **Vulnerabilità fiscale** e cluster di contribuenti\n• 📈 **Previsioni gettito** a 3 anni\n• 💼 **Riscossione** e priorità di recupero\n• 🌿 **Politiche ambientali** modulate sulla capacità fiscale\n\nProva a chiedermi: *"Simula una riduzione del bollo per i contribuenti con reddito sotto 15.000€"*`,
  };
}

export function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}k`;
  return `€${value.toLocaleString('it-IT')}`;
}

export function formatNum(value: number): string {
  return value.toLocaleString('it-IT');
}
