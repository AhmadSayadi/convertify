import { useState } from 'react';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SqlMultiInsertConverter() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedMulti, setCopiedMulti] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const convertToSingleInsert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      // Remove comments and empty lines
      const lines = input
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('--') && !line.startsWith('/*'));

      // Extract INSERT statements
      const insertPattern = /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi;
      const matches: { table: string; columns: string; values: string }[] = [];

      lines.forEach(line => {
        let match;
        while ((match = insertPattern.exec(line)) !== null) {
          matches.push({
            table: match[1],
            columns: match[2].trim(),
            values: match[3].trim()
          });
        }
      });

      if (matches.length === 0) {
        setOutput(language === 'en' 
          ? 'Error: No valid INSERT statements found' 
          : 'Error: Tidak ditemukan statement INSERT yang valid');
        return;
      }

      // Group by table and columns
      const grouped: { [key: string]: string[] } = {};

      matches.forEach(({ table, columns, values }) => {
        const key = `${table}|${columns}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(`(${values})`);
      });

      // Generate single INSERT statements
      const results: string[] = [];
      let totalRows = 0;

      Object.entries(grouped).forEach(([key, valuesList]) => {
        const [table, columns] = key.split('|');
        const valuesStr = valuesList.join(',\n');
        results.push(`INSERT INTO ${table} (${columns}) VALUES\n${valuesStr};`);
        totalRows += valuesList.length;
      });

      setOutput(results.join('\n\n'));
      setRowCount(totalRows);
    } catch (error) {
      setOutput(language === 'en' 
        ? 'Error: Invalid SQL format' 
        : 'Error: Format SQL tidak valid');
    }
  };

  const convertToMultiInsert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      // Parse single INSERT with multiple VALUES
      const pattern = /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?);/gi;
      const results: string[] = [];
      let totalRows = 0;

      let match;
      while ((match = pattern.exec(input)) !== null) {
        const table = match[1];
        const columns = match[2].trim();
        const valuesBlock = match[3].trim();

        // Extract individual value tuples
        const valuePattern = /\(([^)]+)\)/g;
        const values: string[] = [];
        let valueMatch;

        while ((valueMatch = valuePattern.exec(valuesBlock)) !== null) {
          values.push(valueMatch[1].trim());
        }

        // Generate individual INSERT statements
        values.forEach(value => {
          results.push(`INSERT INTO ${table} (${columns}) VALUES (${value});`);
          totalRows++;
        });
      }

      if (results.length === 0) {
        setOutput(language === 'en' 
          ? 'Error: No valid INSERT statements found' 
          : 'Error: Tidak ditemukan statement INSERT yang valid');
        return;
      }

      setOutput(results.join('\n'));
      setRowCount(totalRows);
    } catch (error) {
      setOutput(language === 'en' 
        ? 'Error: Invalid SQL format' 
        : 'Error: Format SQL tidak valid');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exampleMulti = `INSERT INTO users (id, name) VALUES (1, 'John');
INSERT INTO users (id, name) VALUES (2, 'Jane');
INSERT INTO users (id, name) VALUES (3, 'Bob');`;

  const exampleSingle = `INSERT INTO users (id, name) VALUES
(1, 'John'),
(2, 'Jane'),
(3, 'Bob');`;

  const handleCopyMulti = async () => {
    await navigator.clipboard.writeText(exampleMulti);
    setCopiedMulti(true);
    setTimeout(() => setCopiedMulti(false), 2000);
  };

  const handleCopySingle = async () => {
    await navigator.clipboard.writeText(exampleSingle);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setRowCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>{language === 'en' ? 'SQL INSERT Converter' : 'Konverter SQL INSERT'}</strong>
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
          {language === 'en' 
            ? 'Convert between multiple INSERT statements and single INSERT with multiple VALUES'
            : 'Konversi antara multiple INSERT statements dan single INSERT dengan multiple VALUES'}
        </p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'SQL Input' : 'Input SQL'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
          placeholder={language === 'en' 
            ? "INSERT INTO users (id, name) VALUES (1, 'John');\nINSERT INTO users (id, name) VALUES (2, 'Jane');\nINSERT INTO users (id, name) VALUES (3, 'Bob');"
            : "INSERT INTO users (id, name) VALUES (1, 'John');\nINSERT INTO users (id, name) VALUES (2, 'Jane');\nINSERT INTO users (id, name) VALUES (3, 'Bob');"}
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={convertToSingleInsert}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <ArrowRightLeft className="w-5 h-5" />
          {language === 'en' ? 'Multi → Single' : 'Multi → Single'}
        </button>
        <button
          onClick={convertToMultiInsert}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <ArrowRightLeft className="w-5 h-5" />
          {language === 'en' ? 'Single → Multi' : 'Single → Multi'}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors"
        >
          {language === 'en' ? 'Clear' : 'Hapus'}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'SQL Output' : 'Output SQL'}
              {rowCount > 0 && <span className="text-blue-600 dark:text-blue-400 ml-2">({rowCount} rows)</span>}
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm resize-none"
            placeholder={language === 'en' ? 'Result will appear here...' : 'Hasil akan muncul di sini...'}
          />
        </div>
      )}

      {/* Examples */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {language === 'en' ? 'Examples:' : 'Contoh:'}
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div>
            <div className="flex items-center justify-between mb-1">
              <strong className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Multiple INSERT:' : 'Multiple INSERT:'}</strong>
              <button
                onClick={handleCopyMulti}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                {copiedMulti ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedMulti ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
              </button>
            </div>
            <pre className="text-slate-500 dark:text-slate-500 overflow-x-auto">
{exampleMulti}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <strong className="text-slate-600 dark:text-slate-400">{language === 'en' ? 'Single INSERT:' : 'Single INSERT:'}</strong>
              <button
                onClick={handleCopySingle}
                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                {copiedSingle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSingle ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
              </button>
            </div>
            <pre className="text-slate-500 dark:text-slate-500 overflow-x-auto">
{exampleSingle}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
