// Utility: renders a simple markdown-like string to JSX
export function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Table rows
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      const isSep = cells.every(c => /^[-:]+$/.test(c));
      if (!isSep) {
        const isHeader = i > 0 && lines[i + 1]?.startsWith('|---');
        result.push(
          isHeader
            ? <tr key={i}>{cells.map((c, j) => <th key={j}>{renderInline(c)}</th>)}</tr>
            : <tr key={i}>{cells.map((c, j) => <td key={j}>{renderInline(c)}</td>)}</tr>
        );
      }
      return;
    }

    // Bullets
    if (line.startsWith('• ') || line.startsWith('- ')) {
      result.push(<p key={i} style={{ paddingLeft: 8, marginBottom: 2 }}>• {renderInline(line.slice(2))}</p>);
      return;
    }

    // Headings (markdown style)
    if (line.startsWith('## ')) {
      result.push(<p key={i} style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{renderInline(line.slice(3))}</p>);
      return;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      result.push(<br key={i} />);
      return;
    }

    result.push(<p key={i} style={{ marginBottom: 2 }}>{renderInline(line)}</p>);
  });

  // Wrap table rows in table
  const tableStart = result.findIndex(n => (n as React.ReactElement)?.type === 'tr');
  if (tableStart >= 0) {
    const rows: React.ReactNode[] = [];
    const nonTable: React.ReactNode[] = [];
    let inTable = false;
    result.forEach((node, i) => {
      const el = node as React.ReactElement;
      if (el?.type === 'tr') { inTable = true; rows.push(node); }
      else if (inTable) { inTable = false; nonTable.push(<table key={`t${i}`} className="md-table">{rows}</table>); rows.length = 0; nonTable.push(node); }
      else { nonTable.push(node); }
    });
    if (rows.length > 0) nonTable.push(<table key="t-end" className="md-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0', fontSize: 12.5 }}>{rows}</table>);
    return nonTable;
  }

  return result;
}

function renderInline(text: string): React.ReactNode {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
