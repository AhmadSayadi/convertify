import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type FormatMode = 'minify' | 'beautify';

export default function SqlFormatter() {
  const [mode, setMode] = useState<FormatMode>('beautify');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const minifySql = (sql: string): string => {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;=<>])\s*/g, '$1')
      .trim();
  };

  const beautifySql = (sql: string): string => {
    let formatted = sql.replace(/\s+/g, ' ').trim();

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
      'AND', 'OR', 'ON'
    ];

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    formatted = formatted.replace(/,/g, ',\n  ');
    formatted = formatted.replace(/\(/g, '(\n  ');
    formatted = formatted.replace(/\)/g, '\n)');

    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line);
    let indentLevel = 0;
    const result: string[] = [];

    lines.forEach(line => {
      if (line.startsWith(')')) indentLevel = Math.max(0, indentLevel - 1);

      result.push('  '.repeat(indentLevel) + line);

      if (line.endsWith('(')) indentLevel++;
    });

    return result.join('\n');
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'minify') {
      setOutput(minifySql(input));
    } else {
      setOutput(beautifySql(input));
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">SQL Formatter</h2>
        <p className="text-slate-600">Minify or beautify SQL queries</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Format Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('beautify')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'beautify'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Beautify
          </button>
          <button
            onClick={() => setMode('minify')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'minify'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Minify
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          SQL Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="SELECT id, name, email FROM users WHERE active = true AND role = 'admin' ORDER BY created_at DESC;"
        />
      </div>

      <button
        onClick={handleFormat}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        {mode === 'beautify' ? 'Beautify SQL' : 'Minify SQL'}
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Output
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
