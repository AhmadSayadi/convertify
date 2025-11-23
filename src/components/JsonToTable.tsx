import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function JsonToTable() {
  const [input, setInput] = useState('');
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const convertJsonToTable = () => {
    if (!input.trim()) {
      setTableData(null);
      setError('');
      return;
    }

    try {
      const jsonData = JSON.parse(input);
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

      if (dataArray.length === 0) {
        setError('Error: JSON array is empty');
        setTableData(null);
        return;
      }

      setTableData(dataArray);
      setError('');
    } catch (err) {
      setError('Error: Invalid JSON format');
      setTableData(null);
    }
  };

  const getHeaders = () => {
    if (!tableData || tableData.length === 0) return [];
    return Object.keys(tableData[0]);
  };

  const copyToClipboard = () => {
    if (!tableData) return;
    const headers = getHeaders();
    const csvLines = [headers.join(',')];

    tableData.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      });
      csvLines.push(values.join(','));
    });

    navigator.clipboard.writeText(csvLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!tableData) return;

    const headers = getHeaders();
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Table Export</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4a5568; color: white; }
    tr:nth-child(even) { background-color: #f8fafc; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableData.map(row => `
      <tr>
        ${headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '<td></td>';
          if (typeof val === 'object') return `<td>${JSON.stringify(val)}</td>`;
          return `<td>${String(val)}</td>`;
        }).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">JSON to Table Converter</h2>
        <p className="text-slate-600">Paste your JSON data to visualize as a table</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder='[&#10;  {"id": 1, "name": "John Doe", "email": "john@example.com"},&#10;  {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}&#10;]'
        />
      </div>

      <button
        onClick={convertJsonToTable}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Generate Table
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {tableData && tableData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Table Output <span className="text-blue-600">({tableData.length} rows)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadHtml}
                className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied as CSV!' : 'Copy as CSV'}
              </button>
            </div>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-auto max-h-96">
            <table className="w-full">
              <thead className="bg-slate-700 text-white sticky top-0">
                <tr>
                  {getHeaders().map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    {getHeaders().map((header, colIdx) => {
                      const value = row[header];
                      const displayValue = value === null || value === undefined
                        ? ''
                        : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value);

                      return (
                        <td key={colIdx} className="px-4 py-2 text-sm border-b border-slate-200">
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
