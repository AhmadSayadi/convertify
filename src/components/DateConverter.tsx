import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DateConverter() {
  const [input, setInput] = useState('');
  const [fromFormat, setFromFormat] = useState('dd-MM-yyyy');
  const [toFormat, setToFormat] = useState('yyyy-MM-dd');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const parseDate = (dateStr: string, format: string): Date | null => {
    try {
      const parts: Record<string, number> = {};
      const formatParts = format.match(/yyyy|MM|dd|HH|mm|ss/g) || [];
      let remaining = dateStr;

      for (const part of formatParts) {
        const length = part.length;
        const value = remaining.slice(0, length);
        remaining = remaining.slice(length);

        if (part === 'yyyy') parts.year = parseInt(value);
        else if (part === 'MM') parts.month = parseInt(value) - 1;
        else if (part === 'dd') parts.day = parseInt(value);
        else if (part === 'HH') parts.hour = parseInt(value);
        else if (part === 'mm') parts.minute = parseInt(value);
        else if (part === 'ss') parts.second = parseInt(value);

        if (remaining.length > 0 && /[^0-9]/.test(remaining[0])) {
          remaining = remaining.slice(1);
        }
      }

      const date = new Date(
        parts.year || 2000,
        parts.month || 0,
        parts.day || 1,
        parts.hour || 0,
        parts.minute || 0,
        parts.second || 0
      );

      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('yyyy', String(year))
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  };

  const convertDates = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines = input.trim().split('\n');
    const results: string[] = [];

    for (const line of lines) {
      const dateStr = line.trim();
      if (!dateStr) continue;

      const date = parseDate(dateStr, fromFormat);
      if (date) {
        results.push(formatDate(date, toFormat));
      } else {
        results.push(`Invalid: ${dateStr}`);
      }
    }

    setOutput(results.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Date/Time Format Converter</h2>
        <p className="text-slate-600">Convert dates between different formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            From Format
          </label>
          <select
            value={fromFormat}
            onChange={(e) => setFromFormat(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="dd-MM-yyyy">dd-MM-yyyy</option>
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
            <option value="dd-MM-yyyy HH:mm:ss">dd-MM-yyyy HH:mm:ss</option>
            <option value="MM/dd/yyyy HH:mm:ss">MM/dd/yyyy HH:mm:ss</option>
            <option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            To Format
          </label>
          <select
            value={toFormat}
            onChange={(e) => setToFormat(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="dd-MM-yyyy">dd-MM-yyyy</option>
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
            <option value="dd-MM-yyyy HH:mm:ss">dd-MM-yyyy HH:mm:ss</option>
            <option value="MM/dd/yyyy HH:mm:ss">MM/dd/yyyy HH:mm:ss</option>
            <option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Date Input (one per line)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="25-12-2023&#10;01-01-2024&#10;15-06-2024"
        />
      </div>

      <button
        onClick={convertDates}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert Dates
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Converted Output
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
