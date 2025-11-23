import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function SqlToSchema() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertSqlToSchema = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const sql = input.trim();
      const tableNameMatch = sql.match(/CREATE TABLE\s+(\w+)/i);
      const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';

      const columnMatches = sql.matchAll(/(\w+)\s+([\w()]+)(\s+NOT NULL)?(\s+DEFAULT\s+([^,\n)]+))?/gi);
      const fields: any[] = [];

      for (const match of columnMatches) {
        const [, fieldName, dataType, notNull, , defaultValue] = match;

        if (['CREATE', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'CONSTRAINT', 'UNIQUE', 'INDEX'].includes(fieldName.toUpperCase())) {
          continue;
        }

        const field: any = {
          field: fieldName,
          type: dataType.toUpperCase(),
          nullable: !notNull
        };

        if (defaultValue) {
          field.default = defaultValue.trim();
        }

        fields.push(field);
      }

      const schema = {
        table: tableName,
        fields: fields
      };

      setOutput(JSON.stringify(schema, null, 2));
    } catch (error) {
      setOutput('Error: Invalid SQL format');
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2">SQL CREATE TABLE → JSON Schema</h2>
        <p className="text-slate-600">Convert SQL table definition to JSON schema</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          SQL CREATE TABLE
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
          placeholder="CREATE TABLE users (&#10;  id INT PRIMARY KEY,&#10;  name VARCHAR(100) NOT NULL,&#10;  email VARCHAR(255),&#10;  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP&#10;);"
        />
      </div>

      <button
        onClick={convertSqlToSchema}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Convert to JSON Schema
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              JSON Schema Output
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
