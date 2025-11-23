import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export default function CsvToSql() {
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('table_name');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState<',' | '|'>(',');
  const [rowCount, setRowCount] = useState(0);

  const convertCsvToSql = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        setOutput('Error: CSV must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(delimiter).map(h => h.trim());
      const dataLines = lines.slice(1);

      const valueRows = dataLines.map(line => {
        const values = line.split(delimiter).map(val => {
          val = val.trim();
          if (val === '' || val.toLowerCase() === 'null') {
            return 'NULL';
          }
          if (!isNaN(Number(val)) && val !== '') {
            return val;
          }
          return `'${val.replace(/'/g, "''")}'`;
        });
        return `(${values.join(', ')})`;
      });

      const columns = headers.join(', ');
      const sqlStatement = `INSERT INTO ${tableName} (${columns}) VALUES\n${valueRows.join(',\n')};`;

      setOutput(sqlStatement);
      setRowCount(dataLines.length);
    } catch (error) {
      setOutput('Error: Invalid CSV format');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">CSV to SQL Converter</h2>
        <p className="text-slate-600">Paste your CSV data below (first row should be column names)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Table Name
          </label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter table name"
          />
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
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          CSV Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="id, name, email&#10;1, John Doe, john@example.com&#10;2, Jane Smith, jane@example.com"
        />
      </div>

      <button
        onClick={convertCsvToSql}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert to SQL
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              SQL Output <span className="text-blue-600">({rowCount} rows)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadSql}
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
