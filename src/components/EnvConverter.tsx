import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type ConversionMode = 'env-to-json' | 'json-to-env' | 'env-to-yaml' | 'yaml-to-env';

export default function EnvConverter() {
  const [mode, setMode] = useState<ConversionMode>('env-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const envToJson = () => {
    const lines = input.trim().split('\n');
    const obj: Record<string, string> = {};

    lines.forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;

      const index = line.indexOf('=');
      if (index === -1) return;

      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      obj[key] = value;
    });

    setOutput(JSON.stringify(obj, null, 2));
  };

  const jsonToEnv = () => {
    try {
      const obj = JSON.parse(input);
      const lines: string[] = [];

      Object.entries(obj).forEach(([key, value]) => {
        const strValue = String(value);
        if (strValue.includes(' ') || strValue.includes('#')) {
          lines.push(`${key}="${strValue}"`);
        } else {
          lines.push(`${key}=${strValue}`);
        }
      });

      setOutput(lines.join('\n'));
    } catch {
      setOutput('Error: Invalid JSON');
    }
  };

  const envToYaml = () => {
    const lines = input.trim().split('\n');
    const yamlLines: string[] = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;

      const index = line.indexOf('=');
      if (index === -1) return;

      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (value.includes(':') || value.includes('#') || value.includes(' ')) {
        yamlLines.push(`${key}: "${value}"`);
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    });

    setOutput(yamlLines.join('\n'));
  };

  const yamlToEnv = () => {
    const lines = input.trim().split('\n');
    const envLines: string[] = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;

      const index = line.indexOf(':');
      if (index === -1) return;

      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (value.includes(' ') || value.includes('#')) {
        envLines.push(`${key}="${value}"`);
      } else {
        envLines.push(`${key}=${value}`);
      }
    });

    setOutput(envLines.join('\n'));
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    switch (mode) {
      case 'env-to-json':
        envToJson();
        break;
      case 'json-to-env':
        jsonToEnv();
        break;
      case 'env-to-yaml':
        envToYaml();
        break;
      case 'yaml-to-env':
        yamlToEnv();
        break;
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ENV File Converter</h2>
        <p className="text-slate-600">Convert between .env, JSON, and YAML formats</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Conversion Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode('env-to-json')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'env-to-json'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ENV → JSON
          </button>
          <button
            onClick={() => setMode('json-to-env')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'json-to-env'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            JSON → ENV
          </button>
          <button
            onClick={() => setMode('env-to-yaml')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'env-to-yaml'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ENV → YAML
          </button>
          <button
            onClick={() => setMode('yaml-to-env')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'yaml-to-env'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            YAML → ENV
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
            mode.startsWith('env-')
              ? 'DATABASE_URL=postgresql://localhost:5432/db\nAPI_KEY=abc123\nPORT=3000'
              : mode === 'json-to-env'
              ? '{\n  "DATABASE_URL": "postgresql://localhost:5432/db",\n  "API_KEY": "abc123"\n}'
              : 'DATABASE_URL: postgresql://localhost:5432/db\nAPI_KEY: abc123\nPORT: 3000'
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
