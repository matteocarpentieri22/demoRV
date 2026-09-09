import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { GETTITO_PER_PROVINCIA, FASCE_REDDITO, CLASSI_EMISSIVE, TREND_STORICO, FORECAST, RISCOSSIONE } from '../data/mockData';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler,
);

const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(30,41,59,.3)',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(15,23,65,.06)', drawBorder: false },
      ticks: { color: '#64748b', font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(15,23,65,.06)', drawBorder: false },
      ticks: { color: '#64748b', font: { size: 11 } },
      border: { display: false },
    },
  },
};

/* ---- GETTITO PER PROVINCIA ---- */
export function GettitoProvincia() {
  const data = {
    labels: GETTITO_PER_PROVINCIA.labels.map(l => l.slice(0, 3).toUpperCase()),
    datasets: [{
      data: GETTITO_PER_PROVINCIA.values.map(v => v / 1_000_000),
      backgroundColor: ['#4f8ef7','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#f97316'],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    plugins: { ...CHART_OPTS_BASE.plugins, tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` } } },
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Bar data={data} options={opts as any} />;
}

/* ---- FASCE REDDITO ---- */
export function FasceRedditoChart({ simValues }: { simValues?: number[] }) {
  const values = simValues ?? FASCE_REDDITO.gettito.map(v => v / 1_000_000);
  const data = {
    labels: FASCE_REDDITO.labels,
    datasets: [
      {
        label: 'Gettito attuale',
        data: FASCE_REDDITO.gettito.map(v => v / 1_000_000),
        backgroundColor: FASCE_REDDITO.colors.map(c => c + '55'),
        borderColor: FASCE_REDDITO.colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      ...(simValues ? [{
        label: 'Gettito simulato',
        data: values,
        backgroundColor: FASCE_REDDITO.colors.map(c => c + '22'),
        borderColor: FASCE_REDDITO.colors.map(c => c + '88'),
        borderWidth: 2,
        borderDash: [5, 4],
        borderRadius: 6,
        borderSkipped: false,
      }] : []),
    ],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    plugins: {
      ...CHART_OPTS_BASE.plugins,
      legend: simValues ? { display: true, labels: { color: '#475569', font: { size: 11 } } } : { display: false },
      tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` } },
    },
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Bar data={data} options={opts as any} />;
}

/* ---- TREND STORICO ---- */
export function TrendStoricoChart() {
  const data = {
    labels: TREND_STORICO.labels,
    datasets: [{
      label: 'Gettito',
      data: TREND_STORICO.gettito.map(v => v / 1_000_000),
      borderColor: '#4f8ef7',
      backgroundColor: 'rgba(79,142,247,.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4f8ef7',
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2,
    }],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Line data={data} options={opts as any} />;
}

/* ---- COMPLIANCE TREND ---- */
export function ComplianceChart() {
  const data = {
    labels: TREND_STORICO.labels,
    datasets: [{
      label: 'Compliance %',
      data: TREND_STORICO.compliance,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 2,
    }],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, min: 75, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `${v}%` } } },
  };
  return <Line data={data} options={opts as any} />;
}

/* ---- CLASSI EMISSIVE ---- */
export function ClassiEmissiveChart({ simValues }: { simValues?: number[] }) {
  const values = simValues ?? CLASSI_EMISSIVE.gettito.map(v => v / 1_000_000);
  const data = {
    labels: CLASSI_EMISSIVE.labels,
    datasets: [
      {
        label: 'Gettito attuale',
        data: CLASSI_EMISSIVE.gettito.map(v => v / 1_000_000),
        backgroundColor: CLASSI_EMISSIVE.colors.map(c => c + '55'),
        borderColor: CLASSI_EMISSIVE.colors,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      },
      ...(simValues ? [{
        label: 'Gettito simulato',
        data: values,
        backgroundColor: CLASSI_EMISSIVE.colors.map(c => c + '22'),
        borderColor: CLASSI_EMISSIVE.colors.map(c => c + '99'),
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }] : []),
    ],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    plugins: {
      ...CHART_OPTS_BASE.plugins,
      legend: simValues ? { display: true, labels: { color: '#475569', font: { size: 11 } } } : { display: false },
      tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` } },
    },
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Bar data={data} options={opts as any} />;
}

/* ---- RISCOSSIONE DONUT ---- */
export function RiscossioneChart() {
  const data = {
    labels: ['Recuperabile priorità', 'Recuperabile medio', 'Fragile', 'Inesigibile'],
    datasets: [{
      data: RISCOSSIONE.importo.map(v => v / 1_000_000),
      backgroundColor: RISCOSSIONE.colors.map(c => c + 'cc'),
      borderColor: RISCOSSIONE.colors,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: true, position: 'bottom' as const, labels: { color: '#475569', font: { size: 11 }, padding: 12 } },
      tooltip: {
        backgroundColor: '#1e293b', titleColor: '#f8fafc', bodyColor: '#94a3b8',
        borderColor: 'rgba(30,41,59,.3)', borderWidth: 1, padding: 10,
        callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` },
      },
    },
  };
  return <Doughnut data={data} options={opts as any} />;
}

/* ---- FORECAST ---- */
export function ForecastChart() {
  const data = {
    labels: FORECAST.labels,
    datasets: [
      {
        label: 'Scenario attuale',
        data: FORECAST.scenario_attuale.map(v => v / 1_000_000),
        borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,.08)',
        fill: true, tension: 0.3, borderWidth: 2, pointRadius: 5, pointHoverRadius: 8,
      },
      {
        label: 'Scenario alternativo',
        data: FORECAST.scenario_alternativo.map(v => v / 1_000_000),
        borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.08)',
        fill: true, tension: 0.3, borderWidth: 2, borderDash: [6, 4], pointRadius: 5, pointHoverRadius: 8,
      },
      {
        label: 'Scenario ottimista',
        data: FORECAST.scenario_ottimista.map(v => v / 1_000_000),
        borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)',
        fill: true, tension: 0.3, borderWidth: 2, borderDash: [3, 3], pointRadius: 5, pointHoverRadius: 8,
      },
    ],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    plugins: {
      ...CHART_OPTS_BASE.plugins,
      legend: { display: true, labels: { color: '#475569', font: { size: 11 }, padding: 16 } },
      tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` } },
    },
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, min: 145, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Line data={data} options={opts as any} />;
}

/* ---- CLUSTER RADAR / BAR ---- */
export function ClusterBarChart() {
  const labels = ['Vulnerabili', 'Fragili', 'Classe media', 'Benestanti', 'Alto reddito'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Contribuenti (k)',
        data: [28.4, 42.1, 118.3, 89.2, 34.8],
        backgroundColor: ['#ef444466','#f9731666','#eab30866','#22c55e66','#3b82f666'],
        borderColor:      ['#ef4444',  '#f97316',  '#eab308',  '#22c55e',  '#3b82f6'],
        borderWidth: 2, borderRadius: 6, borderSkipped: false,
      },
    ],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `${v}k` } } },
  };
  return <Bar data={data} options={opts as any} />;
}

/* ---- GETTITO SIM COMPARISON ---- */
export function SimCompareChart({ simGettito }: { simGettito: number[] }) {
  const labels = ['< 15k€', '15–28k€', '28–55k€', '55–75k€', '> 75k€'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Gettito attuale',
        data: [14.2, 48.3, 62.1, 34.2, 24.6],
        backgroundColor: 'rgba(79,142,247,.5)', borderColor: '#4f8ef7',
        borderWidth: 2, borderRadius: 5, borderSkipped: false,
      },
      {
        label: 'Gettito simulato',
        data: simGettito,
        backgroundColor: 'rgba(139,92,246,.5)', borderColor: '#8b5cf6',
        borderWidth: 2, borderRadius: 5, borderSkipped: false,
      },
    ],
  };
  const opts = {
    ...CHART_OPTS_BASE,
    plugins: {
      ...CHART_OPTS_BASE.plugins,
      legend: { display: true, labels: { color: '#475569', font: { size: 11 } } },
      tooltip: { ...CHART_OPTS_BASE.plugins.tooltip, callbacks: { label: (c: any) => ` €${c.raw.toFixed(1)}M` } },
    },
    scales: { ...CHART_OPTS_BASE.scales, y: { ...CHART_OPTS_BASE.scales.y, ticks: { ...CHART_OPTS_BASE.scales.y.ticks, callback: (v: any) => `€${v}M` } } },
  };
  return <Bar data={data} options={opts as any} />;
}
