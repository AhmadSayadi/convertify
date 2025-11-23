import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function SqlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertSqlToJson = () => {
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
      const jsonArray = [];

      for (const statement of insertStatements) {
        const valuesMatch = statement.match(/VALUES\s*\((.*?)\)/i);
        if (valuesMatch) {
          const values = valuesMatch[1]
            .split(',')
            .map(v => {
              v = v.trim();
              if (v.toLowerCase() === 'null') return null;
              if (v.startsWith("'") && v.endsWith("'")) {
                return v.slice(1, -1).replace(/''/g, "'");
              }
              if (!isNaN(Number(v)) && v !== '') {
                return Number(v);
              }
              if (v === 'true') return true;
              if (v === 'false') return false;
              return v;
            });

          const obj: Record<string, any> = {};
          columns.forEach((col, idx) => {
            obj[col] = values[idx];
          });
          jsonArray.push(obj);
        }
      }

      setOutput(JSON.stringify(jsonArray, null, 2));
    } catch (error) {
      setOutput('Error: Invalid SQL format');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">SQL to JSON Converter</h2>
        <p className="text-slate-600">Paste your SQL INSERT statements below</p>
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
        onClick={convertSqlToJson}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert to JSON
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              JSON Output
            </label>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
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
