import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function SqlToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState<',' | '|'>(',');
  const [rowCount, setRowCount] = useState(0);

  const convertSqlToCsv = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const insertStatements = input.trim().split(';').filter(s => s.trim());

      if (insertStatements.length === 0) {
        setOutput('Error: No valid INSERT statements found');
        return;
      }

      const firstStatement = insertStatements[0].trim();
      const columnsMatch = firstStatement.match(/INSERT INTO\s+\w+\s*\((.*?)\)/i);

      if (!columnsMatch) {
        setOutput('Error: Could not extract column names from SQL');
        return;
      }

      const columns = columnsMatch[1].split(',').map(c => c.trim());
      const csvRows = [columns.join(delimiter)];

      for (const statement of insertStatements) {
        const valuesMatch = statement.match(/VALUES\s*\((.*?)\)/i);
        if (valuesMatch) {
          const values = valuesMatch[1]
            .split(',')
            .map(v => {
              v = v.trim();
              if (v.toLowerCase() === 'null') return '';
              if (v.startsWith("'") && v.endsWith("'")) {
                return v.slice(1, -1).replace(/''/g, "'");
              }
              return v;
            });
          csvRows.push(values.join(delimiter));
        }
      }

      setOutput(csvRows.join('\n'));
      setRowCount(csvRows.length - 1);
    } catch (error) {
      setOutput('Error: Invalid SQL format');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">SQL to CSV Converter</h2>
        <p className="text-slate-600">Paste your SQL INSERT statements below</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Delimiter
        </label>
        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value as ',' | '|')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value=",">Comma (,)</option>
          <option value="|">Pipe (|)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          SQL Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="INSERT INTO users (id, name, email) VALUES (1, 'John Doe', 'john@example.com');&#10;INSERT INTO users (id, name, email) VALUES (2, 'Jane Smith', 'jane@example.com');"
        />
      </div>

      <button
        onClick={convertSqlToCsv}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert to CSV
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              CSV Output <span className="text-blue-600">({rowCount} rows)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadCsv}
                className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
