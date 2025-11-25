import { useState } from 'react';
import { Copy, Check, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SqlUpdateGenerator() {
  const { language } = useLanguage();
  const [targetTable, setTargetTable] = useState('target_table');
  const [targetAlias, setTargetAlias] = useState('t');
  const [subqueryAlias, setSubqueryAlias] = useState('x');
  const [selectQuery, setSelectQuery] = useState('SELECT mp.id, mp.email\nFROM datanew mp');
  const [setColumns, setSetColumns] = useState('email = x.email');
  const [joinCondition, setJoinCondition] = useState('x.id = t.id');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [sqlDialect, setSqlDialect] = useState<'postgresql' | 'sqlserver' | 'mysql'>('postgresql');

  const generateUpdate = () => {
    let sql = '';
    
    // Format SELECT query dengan indentasi
    const formattedSelect = selectQuery
      .split('\n')
      .map(line => '  ' + line.trim())
      .join('\n');

    if (sqlDialect === 'postgresql') {
      // PostgreSQL style dengan subquery
      sql = `UPDATE ${targetTable} ${targetAlias}\nSET ${setColumns}\nFROM (\n${formattedSelect}\n) ${subqueryAlias}\nWHERE ${joinCondition};`;
    } else if (sqlDialect === 'sqlserver') {
      // SQL Server style dengan subquery
      sql = `UPDATE ${targetTable} ${targetAlias}\nSET ${setColumns}\nFROM (\n${formattedSelect}\n) ${subqueryAlias}\nWHERE ${joinCondition};`;
    } else {
      // MySQL style dengan subquery
      sql = `UPDATE ${targetTable} ${targetAlias}\nINNER JOIN (\n${formattedSelect}\n) ${subqueryAlias}\n  ON ${joinCondition}\nSET ${setColumns};`;
    }

    setOutput(sql);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exampleSql = `UPDATE account r
SET email = x.email
FROM (
  SELECT mp.id, mp.email email
  FROM datanew mp
) x
WHERE x.id = r.id;`;

  const handleCopyExample = async () => {
    await navigator.clipboard.writeText(exampleSql);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleClear = () => {
    setTargetTable('target_table');
    setTargetAlias('t');
    setSubqueryAlias('x');
    setSelectQuery('SELECT mp.id, mp.email\nFROM datanew mp');
    setSetColumns('email = x.email');
    setJoinCondition('x.id = t.id');
    setOutput('');
  };

  const loadExample = () => {
    setTargetTable('account');
    setTargetAlias('r');
    setSubqueryAlias('x');
    setSelectQuery('SELECT mp.id, mp.email email\nFROM datanew mp');
    setSetColumns('email = x.email');
    setJoinCondition('x.id = r.id');
    setSqlDialect('sqlserver');
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>{language === 'en' ? 'SQL UPDATE with Subquery Generator' : 'Generator SQL UPDATE dengan Subquery'}</strong>
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
          {language === 'en' 
            ? 'Generate UPDATE statements with subquery for PostgreSQL, SQL Server, and MySQL. Input your SELECT query directly and specify the WHERE condition to join the target table with the subquery.'
            : 'Generate statement UPDATE dengan subquery untuk PostgreSQL, SQL Server, dan MySQL. Masukkan query SELECT langsung dan tentukan kondisi WHERE untuk join tabel target dengan subquery.'}
        </p>
      </div>

      {/* SQL Dialect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'SQL Dialect' : 'Dialek SQL'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSqlDialect('postgresql')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              sqlDialect === 'postgresql'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            PostgreSQL
          </button>
          <button
            onClick={() => setSqlDialect('sqlserver')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              sqlDialect === 'sqlserver'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            SQL Server
          </button>
          <button
            onClick={() => setSqlDialect('mysql')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              sqlDialect === 'mysql'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            MySQL
          </button>
        </div>
      </div>

      {/* Target Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Target Table' : 'Tabel Target'}
          </label>
          <input
            type="text"
            value={targetTable}
            onChange={(e) => setTargetTable(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="account"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Target Alias' : 'Alias Target'}
          </label>
          <input
            type="text"
            value={targetAlias}
            onChange={(e) => setTargetAlias(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="r"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Subquery Alias' : 'Alias Subquery'}
          </label>
          <input
            type="text"
            value={subqueryAlias}
            onChange={(e) => setSubqueryAlias(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="x"
          />
        </div>
      </div>

      {/* SELECT Query */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'SELECT Query (Subquery)' : 'Query SELECT (Subquery)'}
        </label>
        <textarea
          value={selectQuery}
          onChange={(e) => setSelectQuery(e.target.value)}
          className="w-full h-32 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
          placeholder="SELECT mp.id, mp.email&#10;FROM datanew mp"
        />
      </div>

      {/* SET Columns */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'SET Columns (comma separated)' : 'Kolom SET (dipisah koma)'}
        </label>
        <textarea
          value={setColumns}
          onChange={(e) => setSetColumns(e.target.value)}
          className="w-full h-24 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
          placeholder="email = x.email, name = x.name"
        />
      </div>

      {/* WHERE Condition (JOIN) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'WHERE Condition (JOIN between target and subquery)' : 'Kondisi WHERE (JOIN antara target dan subquery)'}
        </label>
        <input
          type="text"
          value={joinCondition}
          onChange={(e) => setJoinCondition(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="x.id = r.id"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={generateUpdate}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Database className="w-5 h-5" />
          {language === 'en' ? 'Generate UPDATE' : 'Generate UPDATE'}
        </button>
        <button
          onClick={loadExample}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          {language === 'en' ? 'Load Example' : 'Muat Contoh'}
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
              {language === 'en' ? 'Generated SQL' : 'SQL yang Dihasilkan'}
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
            </button>
          </div>
          <pre className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {output}
          </pre>
        </div>
      )}

      {/* Examples */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {language === 'en' ? 'Example Output:' : 'Contoh Output:'}
          </h4>
          <button
            onClick={handleCopyExample}
            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            {copiedExample ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedExample ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
          </button>
        </div>
        <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
{exampleSql}
        </pre>
      </div>
    </div>
  );
}
