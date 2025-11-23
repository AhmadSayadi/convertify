import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

type ConversionMode = 'list-to-in' | 'in-to-list';
type InputDelimiter = 'newline' | 'space' | 'comma';

export default function SqlInConverter() {
  const [mode, setMode] = useState<ConversionMode>('list-to-in');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isNumeric, setIsNumeric] = useState(false);
  const [valueCount, setValueCount] = useState(0);
  const [delimiter, setDelimiter] = useState<InputDelimiter>('newline');

  const listToSqlIn = () => {
    let values: string[];

    if (delimiter === 'newline') {
      values = input.trim().split('\n').map(v => v.trim()).filter(v => v);
    } else if (delimiter === 'space') {
      values = input.trim().split(/\s+/).filter(v => v);
    } else {
      values = input.trim().split(',').map(v => v.trim()).filter(v => v);
    }

    if (isNumeric) {
      values = values.filter(v => !isNaN(Number(v)));
      setOutput(`IN (${values.join(', ')})`);
    } else {
      const escaped = values.map(v => `'${v.replace(/'/g, "''")}'`);
      setOutput(`IN (${escaped.join(', ')})`);
    }
    setValueCount(values.length);
  };

  const sqlInToList = () => {
    const match = input.match(/IN\s*\((.*?)\)/i);
    if (!match) {
      setOutput('Error: No IN clause found');
      return;
    }

    const content = match[1];
    const values = content
      .split(',')
      .map(v => {
        v = v.trim();
        if (v.startsWith("'") && v.endsWith("'")) {
          return v.slice(1, -1).replace(/''/g, "'");
        }
        return v;
      })
      .filter(v => v);

    setOutput(values.join('\n'));
    setValueCount(values.length);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'list-to-in') {
      listToSqlIn();
    } else {
      sqlInToList();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const extension = mode === 'list-to-in' ? 'sql' : 'txt';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `values.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Conversion Mode
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('list-to-in')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'list-to-in'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              List → IN
            </button>
            <button
              onClick={() => setMode('in-to-list')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'in-to-list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              IN → List
            </button>
          </div>
        </div>

        {mode === 'list-to-in' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Input Delimiter
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDelimiter('newline')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    delimiter === 'newline'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Per Line (Enter)
                </button>
                <button
                  onClick={() => setDelimiter('space')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    delimiter === 'space'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Per Space
                </button>
                <button
                  onClick={() => setDelimiter('comma')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    delimiter === 'comma'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Per Comma
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="numeric"
                checked={isNumeric}
                onChange={(e) => setIsNumeric(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="numeric" className="text-sm text-slate-700 dark:text-slate-300">
                Numeric values (no quotes)
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Input and Output Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
            placeholder={
              mode === 'list-to-in'
                ? delimiter === 'newline'
                  ? 'value1\nvalue2\nvalue3'
                  : delimiter === 'space'
                  ? 'value1 value2 value3'
                  : 'value1, value2, value3'
                : "IN ('value1', 'value2', 'value3')"
            }
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Output {valueCount > 0 && <span className="text-blue-600 dark:text-blue-400">({valueCount} values)</span>}
            </label>
            <div className="flex gap-2">
              <button
                onClick={downloadFile}
                disabled={!output}
                className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Convert
        </button>
      </div>
    </div>
  );
}
