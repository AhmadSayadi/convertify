import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function SchemaToSql() {
  const [input, setInput] = useState('');
  const [database, setDatabase] = useState('PostgreSQL');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertSchemaToSql = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const schema = JSON.parse(input);
      const tableName = schema.table || 'table_name';
      const fields = schema.fields || [];

      if (fields.length === 0) {
        setOutput('Error: No fields found in schema');
        return;
      }

      const sqlLines = [`CREATE TABLE ${tableName} (`];

      fields.forEach((field: any, index: number) => {
        let line = `  ${field.field} ${field.type}`;

        if (!field.nullable) {
          line += ' NOT NULL';
        }

        if (field.default !== undefined) {
          line += ` DEFAULT ${field.default}`;
        }

        if (index < fields.length - 1) {
          line += ',';
        }

        sqlLines.push(line);
      });

      sqlLines.push(');');

      setOutput(sqlLines.join('\n'));
    } catch (error) {
      setOutput('Error: Invalid JSON schema format');
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">JSON Schema → SQL CREATE TABLE</h2>
        <p className="text-slate-600">Convert JSON schema to SQL table definition</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Database Type
        </label>
        <select
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="PostgreSQL">PostgreSQL</option>
          <option value="MySQL">MySQL</option>
          <option value="SQLite">SQLite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          JSON Schema
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder='{&#10;  "table": "users",&#10;  "fields": [&#10;    {"field": "id", "type": "INT", "nullable": false},&#10;    {"field": "name", "type": "VARCHAR(100)", "nullable": false},&#10;    {"field": "email", "type": "VARCHAR(255)", "nullable": true}&#10;  ]&#10;}'
        />
      </div>

      <button
        onClick={convertSchemaToSql}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert to SQL
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              SQL Output
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
