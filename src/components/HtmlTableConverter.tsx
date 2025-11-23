import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type ConversionMode = 'html-to-csv' | 'csv-to-html';

export default function HtmlTableConverter() {
  const [mode, setMode] = useState<ConversionMode>('html-to-csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const htmlToCsv = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      const table = doc.querySelector('table');

      if (!table) {
        setOutput('Error: No table found in HTML');
        return;
      }

      const rows: string[] = [];
      const allRows = table.querySelectorAll('tr');

      allRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        const values = cells.map(cell => {
          const text = cell.textContent?.trim() || '';
          if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
          }
          return text;
        });
        rows.push(values.join(','));
      });

      setOutput(rows.join('\n'));
    } catch {
      setOutput('Error: Invalid HTML');
    }
  };

  const csvToHtml = () => {
    const lines = input.trim().split('\n');
    if (lines.length === 0) {
      setOutput('Error: Empty CSV');
      return;
    }

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const dataRows = lines.slice(1).map(line => parseCSVLine(line));

    let html = '<table>\n  <thead>\n    <tr>\n';
    headers.forEach(header => {
      html += `      <th>${header}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n  <tbody>\n';

    dataRows.forEach(row => {
      html += '    <tr>\n';
      row.forEach(cell => {
        html += `      <td>${cell}</td>\n`;
      });
      html += '    </tr>\n';
    });

    html += '  </tbody>\n</table>';
    setOutput(html);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'html-to-csv') {
      htmlToCsv();
    } else {
      csvToHtml();
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">HTML Table Converter</h2>
        <p className="text-slate-600">Convert between HTML tables and CSV</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Conversion Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('html-to-csv')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'html-to-csv'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            HTML → CSV
          </button>
          <button
            onClick={() => setMode('csv-to-html')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'csv-to-html'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            CSV → HTML
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder={
            mode === 'html-to-csv'
              ? '<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>30</td>\n  </tr>\n</table>'
              : 'Name,Age,City\nJohn,30,New York\nJane,25,Los Angeles'
          }
        />
      </div>

      <button
        onClick={handleConvert}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert
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
