import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TextToSqlCreate() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [delimiter, setDelimiter] = useState<'line' | 'space' | 'comma'>('line');
  const [dataType, setDataType] = useState('VARCHAR(255)');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let columns: string[] = [];

    // Split based on delimiter
    switch (delimiter) {
      case 'line':
        columns = input.split('\n').map(c => c.trim()).filter(c => c);
        break;
      case 'space':
        columns = input.split(/\s+/).map(c => c.trim()).filter(c => c);
        break;
      case 'comma':
        columns = input.split(',').map(c => c.trim()).filter(c => c);
        break;
    }

    if (columns.length === 0) {
      setOutput('');
      return;
    }

    // Generate SQL CREATE TABLE
    const columnDefinitions = columns.map(col => {
      // Clean column name (remove special chars, replace spaces with underscore)
      const cleanName = col.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      return `  ${cleanName} ${dataType}`;
    }).join(',\n');

    const sql = `CREATE TABLE ${tableName} (\n${columnDefinitions}\n);`;
    setOutput(sql);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Table Name' : 'Nama Tabel'}
          </label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="my_table"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Delimiter' : 'Pemisah'}
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as 'line' | 'space' | 'comma')}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="line">{language === 'en' ? 'Per Line' : 'Per Baris'}</option>
            <option value="space">{language === 'en' ? 'Per Space' : 'Per Spasi'}</option>
            <option value="comma">{language === 'en' ? 'Per Comma' : 'Per Koma'}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Data Type' : 'Tipe Data'}
          </label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="VARCHAR(255)">VARCHAR(255)</option>
            <option value="TEXT">TEXT</option>
            <option value="INT">INT</option>
            <option value="BIGINT">BIGINT</option>
            <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
            <option value="DATE">DATE</option>
            <option value="DATETIME">DATETIME</option>
            <option value="TIMESTAMP">TIMESTAMP</option>
            <option value="BOOLEAN">BOOLEAN</option>
          </select>
        </div>
      </div>

      {/* Example */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>{language === 'en' ? 'Example:' : 'Contoh:'}</strong>
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
          {delimiter === 'line' && (language === 'en' ? 'Enter column names, one per line:\nid\nname\nemail\nage' : 'Masukkan nama kolom, satu per baris:\nid\nname\nemail\nage')}
          {delimiter === 'space' && (language === 'en' ? 'Enter column names separated by spaces:\nid name email age' : 'Masukkan nama kolom dipisah spasi:\nid name email age')}
          {delimiter === 'comma' && (language === 'en' ? 'Enter column names separated by commas:\nid, name, email, age' : 'Masukkan nama kolom dipisah koma:\nid, name, email, age')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Input (Column Names)' : 'Input (Nama Kolom)'}
            </label>
            <button
              onClick={handleClear}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {language === 'en' ? 'Clear' : 'Hapus'}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              delimiter === 'line'
                ? (language === 'en' ? 'id\nname\nemail\nage' : 'id\nnama\nemail\numur')
                : delimiter === 'space'
                ? (language === 'en' ? 'id name email age' : 'id nama email umur')
                : (language === 'en' ? 'id, name, email, age' : 'id, nama, email, umur')
            }
            className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Output (SQL CREATE TABLE)' : 'Output (SQL CREATE TABLE)'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  {language === 'en' ? 'Copied!' : 'Tersalin!'}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {language === 'en' ? 'Copy' : 'Salin'}
                </>
              )}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={language === 'en' ? 'SQL CREATE TABLE will appear here...' : 'SQL CREATE TABLE akan muncul di sini...'}
            className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={convert}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {language === 'en' ? 'Generate SQL' : 'Generate SQL'}
        </button>
      </div>
    </div>
  );
}
