import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    appTitle: 'Convertify',
    appSubtitle: 'Convert anything. Faster. Smarter.',

    // Categories
    textTools: 'Text Tools',
    dataConversion: 'Data Conversion',
    sqlTools: 'SQL Tools',
    generators: 'Generators',

    // Converter Names
    'json-formatter': 'JSON Formatter',
    'json-formatter-desc': 'Format and validate JSON data',
    'base64': 'Base64 Encode/Decode',
    'base64-desc': 'Encode and decode Base64 strings',
    'url-encode': 'URL Encode/Decode',
    'url-encode-desc': 'Encode and decode URL strings',
    'csv-to-sql': 'CSV → SQL',
    'csv-to-sql-desc': 'Convert CSV data to SQL',
    'sql-to-csv': 'SQL → CSV',
    'sql-to-csv-desc': 'Convert SQL to CSV format',
    'json-to-sql': 'JSON → SQL',
    'json-to-sql-desc': 'Convert JSON to SQL INSERT',
    'sql-to-json': 'SQL → JSON',
    'sql-to-json-desc': 'Convert SQL to JSON format',
    'excel-to-csv': 'Excel → CSV',
    'excel-to-csv-desc': 'Convert Excel data to CSV format',
    'sql-formatter': 'SQL Formatter',
    'sql-formatter-desc': 'Format and beautify SQL queries',
    'sql-to-schema': 'SQL → Schema',
    'sql-to-schema-desc': 'Extract schema from SQL',
    'schema-to-sql': 'Schema → SQL',
    'schema-to-sql-desc': 'Generate SQL from schema',
    'sql-in': 'SQL IN Converter',
    'sql-in-desc': 'Convert list to SQL IN clause',
    'uuid': 'UUID Generator',
    'uuid-desc': 'Generate random UUIDs',
    'slug': 'Slug Generator',
    'slug-desc': 'Generate URL-friendly slugs',
    'timestamp': 'Timestamp Converter',
    'timestamp-desc': 'Convert Unix timestamps',
    'date-converter': 'Date Converter',
    'date-converter-desc': 'Convert between date formats',
    'log-parser': 'Log Parser',
    'log-parser-desc': 'Parse and analyze log files',
    'env-converter': 'ENV Converter',
    'env-converter-desc': 'Convert between ENV formats',
    'csv-json': 'CSV ↔ JSON',
    'csv-json-desc': 'Convert between CSV and JSON',
    'html-table': 'HTML Table Converter',
    'html-table-desc': 'Convert tables to/from HTML',

    // Common UI
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    download: 'Download',
    upload: 'Upload',
    format: 'Format',
    minify: 'Minify',
    encode: 'Encode',
    decode: 'Decode',
    generate: 'Generate',
    parse: 'Parse',
    validate: 'Validate',

    // Messages
    errorInvalidJson: 'Invalid JSON format',
    errorInvalidSql: 'Invalid SQL syntax',
    errorInvalidCsv: 'Invalid CSV format',
    errorEmpty: 'Please enter some data',
    successCopied: 'Copied to clipboard',
    successGenerated: 'Generated successfully',

    // Placeholders
    enterJson: 'Enter JSON here...',
    enterSql: 'Enter SQL here...',
    enterCsv: 'Enter CSV here...',
    enterText: 'Enter text here...',
    resultHere: 'Result will appear here...',
  },
  id: {
    // Header
    appTitle: 'Convertify',
    appSubtitle: 'Konversi apapun. Lebih Cepat. Lebih Pintar.',

    // Categories
    textTools: 'Alat Teks',
    dataConversion: 'Konversi Data',
    sqlTools: 'Alat SQL',
    generators: 'Generator',

    // Converter Names
    'json-formatter': 'Format JSON',
    'json-formatter-desc': 'Format dan validasi data JSON',
    'base64': 'Encode/Decode Base64',
    'base64-desc': 'Encode dan decode string Base64',
    'url-encode': 'Encode/Decode URL',
    'url-encode-desc': 'Encode dan decode string URL',
    'csv-to-sql': 'CSV → SQL',
    'csv-to-sql-desc': 'Konversi data CSV ke SQL',
    'sql-to-csv': 'SQL → CSV',
    'sql-to-csv-desc': 'Konversi SQL ke format CSV',
    'json-to-sql': 'JSON → SQL',
    'json-to-sql-desc': 'Konversi JSON ke SQL INSERT',
    'sql-to-json': 'SQL → JSON',
    'sql-to-json-desc': 'Konversi SQL ke format JSON',
    'excel-to-csv': 'Excel → CSV',
    'excel-to-csv-desc': 'Konversi data Excel ke format CSV',
    'sql-formatter': 'Format SQL',
    'sql-formatter-desc': 'Format dan percantik query SQL',
    'sql-to-schema': 'SQL → Skema',
    'sql-to-schema-desc': 'Ekstrak skema dari SQL',
    'schema-to-sql': 'Skema → SQL',
    'schema-to-sql-desc': 'Generate SQL dari skema',
    'sql-in': 'Konversi SQL IN',
    'sql-in-desc': 'Konversi list ke klausa SQL IN',
    'uuid': 'Generator UUID',
    'uuid-desc': 'Generate UUID acak',
    'slug': 'Generator Slug',
    'slug-desc': 'Generate slug ramah URL',
    'timestamp': 'Konversi Timestamp',
    'timestamp-desc': 'Konversi Unix timestamp',
    'date-converter': 'Konversi Tanggal',
    'date-converter-desc': 'Konversi antar format tanggal',
    'log-parser': 'Parser Log',
    'log-parser-desc': 'Parse dan analisa file log',
    'env-converter': 'Konversi ENV',
    'env-converter-desc': 'Konversi antar format ENV',
    'csv-json': 'CSV ↔ JSON',
    'csv-json-desc': 'Konversi antara CSV dan JSON',
    'html-table': 'Konversi Tabel HTML',
    'html-table-desc': 'Konversi tabel ke/dari HTML',

    // Common UI
    input: 'Input',
    output: 'Output',
    convert: 'Konversi',
    copy: 'Salin',
    copied: 'Tersalin!',
    clear: 'Hapus',
    download: 'Unduh',
    upload: 'Unggah',
    format: 'Format',
    minify: 'Minify',
    encode: 'Encode',
    decode: 'Decode',
    generate: 'Generate',
    parse: 'Parse',
    validate: 'Validasi',

    // Messages
    errorInvalidJson: 'Format JSON tidak valid',
    errorInvalidSql: 'Sintaks SQL tidak valid',
    errorInvalidCsv: 'Format CSV tidak valid',
    errorEmpty: 'Silakan masukkan data',
    successCopied: 'Disalin ke clipboard',
    successGenerated: 'Berhasil di-generate',

    // Placeholders
    enterJson: 'Masukkan JSON di sini...',
    enterSql: 'Masukkan SQL di sini...',
    enterCsv: 'Masukkan CSV di sini...',
    enterText: 'Masukkan teks di sini...',
    resultHere: 'Hasil akan muncul di sini...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'id') ? saved : 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = (key: string): string => {
    const translation = translations[language as keyof typeof translations];
    return (translation as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, darkMode, setDarkMode, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
