import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

type ConversionMode = 'csv-to-json' | 'json-to-csv';

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<ConversionMode>('csv-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState<',' | '|'>(',');
  const [rowCount, setRowCount] = useState(0);

  const convertCsvToJson = () => {
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        setOutput('Error: CSV must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(delimiter).map(h => h.trim());
      const dataLines = lines.slice(1);

      const jsonArray = dataLines.map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const obj: Record<string, any> = {};
        headers.forEach((header, idx) => {
          const val = values[idx];
          if (!isNaN(Number(val)) && val !== '') {
            obj[header] = Number(val);
          } else {
            obj[header] = val;
          }
        });
        return obj;
      });

      setOutput(JSON.stringify(jsonArray, null, 2));
      setRowCount(jsonArray.length);
    } catch (error) {
      setOutput('Error: Invalid CSV format');
    }
  };

  const convertJsonToCsv = () => {
    try {
      const jsonData = JSON.parse(input);
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

      if (dataArray.length === 0) {
        setOutput('Error: JSON array is empty');
        return;
      }

      const headers = Object.keys(dataArray[0]);
      const csvLines = [headers.join(delimiter)];

      dataArray.forEach(obj => {
        const values = headers.map(header => {
          const val = obj[header];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val);
        });
        csvLines.push(values.join(delimiter));
      });

      setOutput(csvLines.join('\n'));
      setRowCount(dataArray.length);
    } catch (error) {
      setOutput('Error: Invalid JSON format');
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'csv-to-json') {
      convertCsvToJson();
    } else {
      convertJsonToCsv();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const extension = mode === 'csv-to-json' ? 'json' : 'csv';
    const mimeType = mode === 'csv-to-json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">CSV ↔ JSON Converter</h2>
        <p className="text-slate-600">Bidirectional conversion between CSV and JSON</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Conversion Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('csv-to-json')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'csv-to-json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              CSV → JSON
            </button>
            <button
              onClick={() => setMode('json-to-csv')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'json-to-csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              JSON → CSV
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            CSV Delimiter
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
          {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder={
            mode === 'csv-to-json'
              ? 'id,name,email\n1,John Doe,john@example.com\n2,Jane Smith,jane@example.com'
              : '[{"id": 1, "name": "John Doe", "email": "john@example.com"}]'
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
              {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'} <span className="text-blue-600">({rowCount} rows)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadFile}
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
