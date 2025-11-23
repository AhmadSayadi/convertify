import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type ConversionMode = 'timestamp-to-datetime' | 'datetime-to-timestamp';

export default function TimestampConverter() {
  const [mode, setMode] = useState<ConversionMode>('timestamp-to-datetime');
  const [input, setInput] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertTimestampToDatetime = () => {
    const lines = input.trim().split('\n');
    const results: string[] = ['Input | Output', '--- | ---'];

    for (const line of lines) {
      const timestamp = line.trim();
      if (!timestamp) continue;

      try {
        const ts = parseInt(timestamp);
        const date = new Date(ts * 1000);

        let dateStr = '';
        if (timezone === 'UTC') {
          dateStr = date.toISOString().replace('T', ' ').substring(0, 19);
        } else {
          dateStr = date.toLocaleString('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
        }

        results.push(`${timestamp} | ${dateStr}`);
      } catch {
        results.push(`${timestamp} | Invalid timestamp`);
      }
    }

    setOutput(results.join('\n'));
  };

  const convertDatetimeToTimestamp = () => {
    const lines = input.trim().split('\n');
    const results: string[] = ['Input | Output', '--- | ---'];

    for (const line of lines) {
      const dateStr = line.trim();
      if (!dateStr) continue;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          results.push(`${dateStr} | Invalid datetime`);
        } else {
          const timestamp = Math.floor(date.getTime() / 1000);
          results.push(`${dateStr} | ${timestamp}`);
        }
      } catch {
        results.push(`${dateStr} | Invalid datetime`);
      }
    }

    setOutput(results.join('\n'));
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'timestamp-to-datetime') {
      convertTimestampToDatetime();
    } else {
      convertDatetimeToTimestamp();
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Unix Timestamp ↔ Datetime</h2>
        <p className="text-slate-600">Convert between Unix timestamps and human-readable dates</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Conversion Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('timestamp-to-datetime')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'timestamp-to-datetime'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Timestamp → Datetime
          </button>
          <button
            onClick={() => setMode('datetime-to-timestamp')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'datetime-to-timestamp'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Datetime → Timestamp
          </button>
        </div>
      </div>

      {mode === 'timestamp-to-datetime' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST/EDT)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {mode === 'timestamp-to-datetime' ? 'Unix Timestamps (one per line)' : 'Datetimes (one per line)'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder={
            mode === 'timestamp-to-datetime'
              ? '1703548800\n1704153600\n1706745600'
              : '2023-12-26 00:00:00\n2024-01-02 00:00:00\n2024-02-01 00:00:00'
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
              Conversion Results
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
