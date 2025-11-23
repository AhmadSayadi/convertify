import { useState } from "react";
import { Copy, Check, Upload, FileSpreadsheet, Download, BarChart3, Database, Braces } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function ExcelToCsv() {
  const { language } = useLanguage();
  const [csvOutput, setCsvOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [columnCount, setColumnCount] = useState(0);
  const [sqlOutput, setSqlOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [tableName, setTableName] = useState("my_table");
  const [delimiter, setDelimiter] = useState<',' | '|'>(',');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const data = event.target?.result;
        if (!data) {
          alert("Failed to read file");
          setLoading(false);
          return;
        }

        let csvData = '';

        if (file.name.endsWith('.csv')) {
          csvData = data as string;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // @ts-ignore - Dynamic import from CDN
          const xlsx: any = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
          const workbook = xlsx.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          csvData = xlsx.utils.sheet_to_csv(worksheet);
        } else {
          alert("Please upload a valid Excel (.xlsx, .xls) or CSV file");
          setLoading(false);
          return;
        }

        setCsvOutput(csvData);

        // Calculate row and column count
        const lines = csvData.trim().split('\n');
        const rows = lines.length;
        const cols = lines[0] ? lines[0].split(delimiter).length : 0;

        setRowCount(rows);
        setColumnCount(cols);
        setLoading(false);
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.(xlsx|xls)$/i, '.csv') || 'converted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToSql = () => {
    if (!csvOutput) return;

    const lines = csvOutput.trim().split('\n');
    if (lines.length === 0) return;

    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/[^a-zA-Z0-9_]/g, '_'));
    const dataLines = lines.slice(1);

    const valueRows = dataLines.map(line => {
      const values = line.split(delimiter).map(v => {
        const trimmed = v.trim();
        if (!trimmed || trimmed === '') return 'NULL';
        if (!isNaN(Number(trimmed))) return trimmed;
        return `'${trimmed.replace(/'/g, "''")}'`;
      });
      return `(${values.join(', ')})`;
    });

    const sql = `-- SQL INSERT Statement for ${tableName}\n\nINSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n${valueRows.join(',\n')};`;

    setSqlOutput(sql);
  };

  const convertToJson = () => {
    if (!csvOutput) return;

    const lines = csvOutput.trim().split('\n');
    if (lines.length === 0) return;

    const headers = lines[0].split(delimiter).map(h => h.trim());
    const dataLines = lines.slice(1);

    const jsonArray = dataLines.map(line => {
      const values = line.split(delimiter).map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (!isNaN(Number(value)) && value !== '') {
          obj[header] = Number(value);
        } else {
          obj[header] = value;
        }
      });
      return obj;
    });

    setJsonOutput(JSON.stringify(jsonArray, null, 2));
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlOutput);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonOutput);
  };

  const text = {
    en: {
      title: 'Upload Excel or CSV File',
      processing: 'Processing...',
      supports: 'Supports .xlsx, .xls, and .csv files',
      totalRows: 'Total Rows',
      columns: 'Columns',
      dataRows: 'Data Rows',
      csvOutput: 'CSV Output',
      copy: 'Copy',
      copied: 'Copied!',
      download: 'Download',
      convertToSql: 'Convert to SQL',
      convertToJson: 'Convert to JSON',
      tableName: 'Table Name',
      sqlOutput: 'SQL Output',
      jsonOutput: 'JSON Output',
      howToUse: 'How to use:',
      step1: 'Click the upload area or drag and drop your Excel/CSV file',
      step2: 'The file will be automatically converted to CSV format',
      step3: 'Copy the output or download it as a CSV file',
      step4: 'Supports multiple sheets (converts the first sheet)',
      step5: 'Convert CSV to SQL or JSON format as needed'
    },
    id: {
      title: 'Unggah File Excel atau CSV',
      processing: 'Memproses...',
      supports: 'Mendukung file .xlsx, .xls, dan .csv',
      totalRows: 'Total Baris',
      columns: 'Kolom',
      dataRows: 'Baris Data',
      csvOutput: 'Output CSV',
      copy: 'Salin',
      copied: 'Tersalin!',
      download: 'Unduh',
      convertToSql: 'Konversi ke SQL',
      convertToJson: 'Konversi ke JSON',
      tableName: 'Nama Tabel',
      sqlOutput: 'Output SQL',
      jsonOutput: 'Output JSON',
      howToUse: 'Cara menggunakan:',
      step1: 'Klik area unggah atau seret dan lepas file Excel/CSV Anda',
      step2: 'File akan otomatis dikonversi ke format CSV',
      step3: 'Salin output atau unduh sebagai file CSV',
      step4: 'Mendukung beberapa sheet (konversi sheet pertama)',
      step5: 'Konversi CSV ke format SQL atau JSON sesuai kebutuhan'
    }
  };

  const t = text[language];

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          id="excel-upload"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="excel-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            {loading ? (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {loading ? t.processing : t.title}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {t.supports}
            </p>
          </div>
          {fileName && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{fileName}</span>
            </div>
          )}
        </label>
      </div>

      {csvOutput && (
        <div className="space-y-4">
          {/* Data Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">{t.totalRows}</p>
                  <p className="text-2xl font-bold text-blue-900">{rowCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">{t.columns}</p>
                  <p className="text-2xl font-bold text-green-900">{columnCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium">{t.dataRows}</p>
                  <p className="text-2xl font-bold text-purple-900">{Math.max(0, rowCount - 1).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delimiter Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {language === 'en' ? 'CSV Delimiter' : 'Delimiter CSV'}
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as ',' | '|')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value=",">Comma (,)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>

          {/* Conversion Options */}
          <div className="flex gap-3">
            <button
              onClick={convertToSql}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <Database className="w-5 h-5" />
              <span className="font-medium">{t.convertToSql}</span>
            </button>
            <button
              onClick={convertToJson}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
            >
              <Braces className="w-5 h-5" />
              <span className="font-medium">{t.convertToJson}</span>
            </button>
          </div>

          {/* CSV Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                {t.csvOutput}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.copied : t.copy}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t.download}
                </button>
              </div>
            </div>
            <textarea
              value={csvOutput}
              readOnly
              className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
              placeholder="CSV output will appear here..."
            />
          </div>
        </div>
      )}

      {/* SQL Output */}
      {sqlOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-slate-700">
                {t.sqlOutput}
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder={t.tableName}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={convertToSql}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'en' ? 'Update' : 'Perbarui'}
              </button>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {t.copy}
            </button>
          </div>
          <textarea
            value={sqlOutput}
            readOnly
            className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
          />
        </div>
      )}

      {/* JSON Output */}
      {jsonOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              {t.jsonOutput}
            </label>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              {t.copy}
            </button>
          </div>
          <textarea
            value={jsonOutput}
            readOnly
            className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
          />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">{t.howToUse}</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>{t.step1}</li>
          <li>{t.step2}</li>
          <li>{t.step3}</li>
          <li>{t.step4}</li>
          <li>{t.step5}</li>
        </ol>
      </div>
    </div>
  );
}
