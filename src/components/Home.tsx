import { FileText, Database, Braces, ArrowRightLeft, Table, Calendar, Clock, Link, Code2, Hash, FileJson, Settings, List, FileCode, Type, Eye, GitCompare, FileEdit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onSelectConverter: (id: string) => void;
}

export default function Home({ onSelectConverter }: HomeProps) {
  const { language, t } = useLanguage();

  const allTools = [
    {
      id: 'csv-to-sql',
      title: t('csv-to-sql'),
      icon: FileText,
      description: t('csv-to-sql-desc'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'sql-to-csv',
      title: t('sql-to-csv'),
      icon: Database,
      description: t('sql-to-csv-desc'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'json-to-sql',
      title: t('json-to-sql'),
      icon: Braces,
      description: t('json-to-sql-desc'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'sql-to-json',
      title: t('sql-to-json'),
      icon: ArrowRightLeft,
      description: t('sql-to-json-desc'),
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'excel-to-csv',
      title: t('excel-to-csv'),
      icon: Table,
      description: t('excel-to-csv-desc'),
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'csv-json',
      title: t('csv-json'),
      icon: ArrowRightLeft,
      description: t('csv-json-desc'),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'sql-to-schema',
      title: t('sql-to-schema'),
      icon: Database,
      description: t('sql-to-schema-desc'),
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'schema-to-sql',
      title: t('schema-to-sql'),
      icon: Braces,
      description: t('schema-to-sql-desc'),
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'date-converter',
      title: t('date-converter'),
      icon: Calendar,
      description: t('date-converter-desc'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'timestamp-converter',
      title: t('timestamp'),
      icon: Clock,
      description: t('timestamp-desc'),
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'url-converter',
      title: t('url-encode'),
      icon: Link,
      description: t('url-encode-desc'),
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'base64-converter',
      title: t('base64'),
      icon: Code2,
      description: t('base64-desc'),
      color: 'from-violet-500 to-violet-600'
    },
    {
      id: 'slug-generator',
      title: t('slug'),
      icon: Hash,
      description: t('slug-desc'),
      color: 'from-lime-500 to-lime-600'
    },
    {
      id: 'uuid-generator',
      title: t('uuid'),
      icon: Hash,
      description: t('uuid-desc'),
      color: 'from-sky-500 to-sky-600'
    },
    {
      id: 'json-formatter',
      title: t('json-formatter'),
      icon: FileJson,
      description: t('json-formatter-desc'),
      color: 'from-fuchsia-500 to-fuchsia-600'
    },
    {
      id: 'sql-formatter',
      title: t('sql-formatter'),
      icon: Database,
      description: t('sql-formatter-desc'),
      color: 'from-rose-500 to-rose-600'
    },
    {
      id: 'sql-in-converter',
      title: t('sql-in'),
      icon: List,
      description: t('sql-in-desc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'env-converter',
      title: t('env-converter'),
      icon: Settings,
      description: t('env-converter-desc'),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'html-table-converter',
      title: t('html-table'),
      icon: Table,
      description: t('html-table-desc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'log-parser',
      title: t('log-parser'),
      icon: FileCode,
      description: t('log-parser-desc'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'json-to-table',
      title: language === 'en' ? 'JSON to Table' : 'JSON ke Tabel',
      icon: Table,
      description: language === 'en' ? 'Convert JSON to HTML table' : 'Konversi JSON ke tabel HTML',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'convert-case',
      title: language === 'en' ? 'Convert Case' : 'Konversi Case',
      icon: Type,
      description: language === 'en' ? 'Convert text to different cases' : 'Konversi teks ke berbagai case',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'character-detector',
      title: language === 'en' ? 'Character Detector' : 'Pendeteksi Karakter',
      icon: Eye,
      description: language === 'en' ? 'Detect invisible and special characters' : 'Deteksi karakter invisible dan spesial',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'diff-checker',
      title: language === 'en' ? 'Diff Checker' : 'Pembanding Teks',
      icon: GitCompare,
      description: language === 'en' ? 'Compare two texts and find differences' : 'Bandingkan dua teks dan temukan perbedaan',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'text-to-sql-create',
      title: language === 'en' ? 'Text to SQL CREATE' : 'Text ke SQL CREATE',
      icon: Database,
      description: language === 'en' ? 'Convert text to SQL CREATE TABLE' : 'Konversi text ke SQL CREATE TABLE',
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'markdown-preview',
      title: language === 'en' ? 'Markdown Preview' : 'Preview Markdown',
      icon: Eye,
      description: language === 'en' ? 'Preview markdown with live rendering' : 'Preview markdown dengan rendering langsung',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'markdown-editor',
      title: language === 'en' ? 'Markdown Editor' : 'Editor Markdown',
      icon: FileEdit,
      description: language === 'en' ? 'WYSIWYG markdown editor with toolbar' : 'Editor markdown WYSIWYG dengan toolbar',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'commit-generator',
      title: language === 'en' ? 'Commit Message Generator' : 'Generator Pesan Commit',
      icon: GitCompare,
      description: language === 'en' ? 'Generate professional commit messages' : 'Generate pesan commit profesional',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'sql-multi-insert',
      title: language === 'en' ? 'SQL Multi INSERT Converter' : 'Konverter SQL Multi INSERT',
      icon: Database,
      description: language === 'en' ? 'Convert between multiple and single INSERT statements' : 'Konversi antara multiple dan single INSERT statements',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'sql-update-generator',
      title: language === 'en' ? 'SQL UPDATE Generator' : 'Generator SQL UPDATE',
      icon: Database,
      description: language === 'en' ? 'Generate UPDATE with JOIN statements' : 'Generate statement UPDATE dengan JOIN',
      color: 'from-red-500 to-rose-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <ArrowRightLeft className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-4">
          {language === 'en' ? 'Convert Anything. Faster. Smarter.' : 'Konversi Apapun. Lebih Cepat. Lebih Pintar.'}
        </h1>
        <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-6">
          {language === 'en' ? 'Convertify - Developer Tools for Data Conversion' : 'Convertify - Alat Developer untuk Konversi Data'}
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'A web-based platform for converting and manipulating data in various formats: CSV, JSON, SQL, Excel, and more. Designed for developers, data engineers, and analysts who need fast, accurate, and practical conversion tools in one dashboard.'
            : 'Platform berbasis web untuk mengonversi dan memanipulasi data dalam berbagai format: CSV, JSON, SQL, Excel, dan banyak lainnya. Dirancang untuk developer, data engineer, dan analyst yang membutuhkan alat konversi cepat, akurat, dan praktis dalam satu dashboard.'}
        </p>
      </div>

      {/* Tools Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-8">
          {language === 'en' ? 'All Conversion Tools' : 'Semua Alat Konversi'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => {
                window.location.hash = tool.id;
                onSelectConverter(tool.id);
              }}
              className="group bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
