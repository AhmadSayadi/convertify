import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState('lowercase');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'generate' | 'format'>('generate');

  const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const formatUuid = (uuid: string, format: string): string => {
    const cleaned = uuid.replace(/[^a-f0-9]/gi, '');
    if (cleaned.length !== 32) return uuid;

    const formatted = `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`;

    if (format === 'uppercase') return formatted.toUpperCase();
    if (format === 'lowercase') return formatted.toLowerCase();
    if (format === 'no-dash') return cleaned;
    return formatted;
  };

  const handleGenerate = () => {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const uuid = generateUuid();
      uuids.push(formatUuid(uuid, format));
    }
    setOutput(uuids.join('\n'));
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines = input.trim().split('\n');
    const formatted = lines.map(line => formatUuid(line.trim(), format));
    setOutput(formatted.join('\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">UUID Generator & Formatter</h2>
        <p className="text-slate-600">Generate UUIDs or format existing ones</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setMode('format')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'format'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Format
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="lowercase">Lowercase with dashes</option>
          <option value="uppercase">Uppercase with dashes</option>
          <option value="no-dash">No dashes</option>
        </select>
      </div>

      {mode === 'generate' ? (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of UUIDs
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            UUIDs to Format (one per line)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
            placeholder="550e8400-e29b-41d4-a716-446655440000&#10;6ba7b810-9dad-11d1-80b4-00c04fd430c8"
          />
        </div>
      )}

      <button
        onClick={mode === 'generate' ? handleGenerate : handleFormat}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        {mode === 'generate' ? 'Generate UUIDs' : 'Format UUIDs'}
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
