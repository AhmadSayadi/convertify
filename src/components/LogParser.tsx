import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function LogParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const parseLogLine = (line: string): Record<string, any> | null => {
    line = line.trim();
    if (!line) return null;

    const timestampPattern = /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)/;
    const levelPattern = /\b(DEBUG|INFO|WARN|WARNING|ERROR|FATAL|TRACE)\b/i;

    const result: Record<string, any> = {};
    let remaining = line;

    const timestampMatch = remaining.match(timestampPattern);
    if (timestampMatch) {
      result.timestamp = timestampMatch[1];
      remaining = remaining.slice(timestampMatch[0].length).trim();
    }

    const levelMatch = remaining.match(levelPattern);
    if (levelMatch) {
      result.level = levelMatch[1].toUpperCase();
      remaining = remaining.replace(levelMatch[0], '').trim();
    }

    const ipPattern = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/;
    const ipMatch = remaining.match(ipPattern);
    if (ipMatch) {
      result.ip = ipMatch[1];
      remaining = remaining.replace(ipMatch[0], '').trim();
    }

    const statusPattern = /\b(GET|POST|PUT|DELETE|PATCH)\s+([^\s]+)\s+(\d{3})\b/;
    const statusMatch = remaining.match(statusPattern);
    if (statusMatch) {
      result.method = statusMatch[1];
      result.path = statusMatch[2];
      result.status = parseInt(statusMatch[3]);
      remaining = remaining.replace(statusMatch[0], '').trim();
    }

    const userPattern = /user[:\s]+([^\s,]+)/i;
    const userMatch = remaining.match(userPattern);
    if (userMatch) {
      result.user = userMatch[1];
      remaining = remaining.replace(userMatch[0], '').trim();
    }

    if (remaining) {
      result.message = remaining
        .replace(/^[-:\[\]]+\s*/, '')
        .replace(/\s*[-:\[\]]+$/, '')
        .trim();
    }

    return Object.keys(result).length > 0 ? result : { message: line };
  };

  const handleParse = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const lines = input.trim().split('\n');
    const parsed = lines
      .map(line => parseLogLine(line))
      .filter(obj => obj !== null);

    setOutput(JSON.stringify(parsed, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Log Parser</h2>
        <p className="text-slate-600">Parse log lines into structured JSON</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Log Input (one per line)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="2024-01-15 10:30:45 INFO User authentication successful&#10;2024-01-15 10:31:12 ERROR Failed to connect to database&#10;2024-01-15T10:32:00Z WARN 192.168.1.1 GET /api/users 404&#10;[2024-01-15 10:33:15] DEBUG Processing request from user: john_doe"
        />
      </div>

      <button
        onClick={handleParse}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Parse Logs
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
