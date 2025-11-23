import { useState, useEffect } from 'react';
import { FileText, Database, Braces, ArrowRightLeft, Table, Calendar, Clock, Link, Code2, Hash, FileJson, Settings, List, FileCode, Menu, X, Search, Sun, Moon, ChevronLeft, ChevronRight, Languages, Home as HomeIcon, Type, Eye, GitCompare, FileEdit } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import Home from './components/Home';
import CsvToSql from './components/CsvToSql';
import SqlToCsv from './components/SqlToCsv';
import JsonToSql from './components/JsonToSql';
import SqlToJson from './components/SqlToJson';
import ExcelToCsv from './components/ExcelToCsv';
import CsvJsonConverter from './components/CsvJsonConverter';
import SqlToSchema from './components/SqlToSchema';
import SchemaToSql from './components/SchemaToSql';
import DateConverter from './components/DateConverter';
import TimestampConverter from './components/TimestampConverter';
import UrlConverter from './components/UrlConverter';
import Base64Converter from './components/Base64Converter';
import SlugGenerator from './components/SlugGenerator';
import UuidGenerator from './components/UuidGenerator';
import JsonFormatter from './components/JsonFormatter';
import SqlFormatter from './components/SqlFormatter';
import SqlInConverter from './components/SqlInConverter';
import EnvConverter from './components/EnvConverter';
import HtmlTableConverter from './components/HtmlTableConverter';
import LogParser from './components/LogParser';
import JsonToTable from './components/JsonToTable';
import ConvertCase from './components/ConvertCase';
import CharacterDetector from './components/CharacterDetector';
import DiffChecker from './components/DiffChecker';
import TextToSqlCreate from './components/TextToSqlCreate';
import MarkdownPreview from './components/MarkdownPreview';
import MarkdownEditor from './components/MarkdownEditor';
import Footer from './components/Footer';

type ConverterType = 'home' | 'csv-to-sql' | 'sql-to-csv' | 'json-to-sql' | 'sql-to-json' | 'excel-to-csv' | 'csv-json' | 'sql-to-schema' | 'schema-to-sql' | 'date-converter' | 'timestamp-converter' | 'url-converter' | 'base64-converter' | 'slug-generator' | 'uuid-generator' | 'json-formatter' | 'sql-formatter' | 'sql-in-converter' | 'env-converter' | 'html-table-converter' | 'log-parser' | 'json-to-table' | 'convert-case' | 'character-detector' | 'diff-checker' | 'text-to-sql-create' | 'markdown-preview' | 'markdown-editor';

function App() {
  const { language, setLanguage, darkMode, setDarkMode, t } = useLanguage();
  
  // Get initial route from URL hash
  const getInitialRoute = (): ConverterType => {
    const hash = window.location.hash.slice(1); // Remove #
    if (hash && hash !== '') {
      return hash as ConverterType;
    }
    return 'home';
  };

  const [activeConverter, setActiveConverter] = useState<ConverterType>(getInitialRoute());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Handle route changes
  const handleRouteChange = (route: ConverterType) => {
    setActiveConverter(route);
    window.location.hash = route;
  };

  // Listen to hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveConverter(hash as ConverterType);
      } else {
        setActiveConverter('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save sidebar collapsed state to localStorage
  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  };

  const converters = [
    {
      id: 'csv-to-sql' as ConverterType,
      title: t('csv-to-sql'),
      icon: FileText,
      description: t('csv-to-sql-desc')
    },
    {
      id: 'sql-to-csv' as ConverterType,
      title: t('sql-to-csv'),
      icon: Database,
      description: t('sql-to-csv-desc')
    },
    {
      id: 'json-to-sql' as ConverterType,
      title: t('json-to-sql'),
      icon: Braces,
      description: t('json-to-sql-desc')
    },
    {
      id: 'sql-to-json' as ConverterType,
      title: t('sql-to-json'),
      icon: ArrowRightLeft,
      description: t('sql-to-json-desc')
    },
    {
      id: 'excel-to-csv' as ConverterType,
      title: t('excel-to-csv'),
      icon: Table,
      description: t('excel-to-csv-desc')
    },
    {
      id: 'csv-json' as ConverterType,
      title: t('csv-json'),
      icon: ArrowRightLeft,
      description: t('csv-json-desc')
    },
    {
      id: 'sql-to-schema' as ConverterType,
      title: t('sql-to-schema'),
      icon: Database,
      description: t('sql-to-schema-desc')
    },
    {
      id: 'schema-to-sql' as ConverterType,
      title: t('schema-to-sql'),
      icon: Braces,
      description: t('schema-to-sql-desc')
    },
    {
      id: 'date-converter' as ConverterType,
      title: t('date-converter'),
      icon: Calendar,
      description: t('date-converter-desc')
    },
    {
      id: 'timestamp-converter' as ConverterType,
      title: t('timestamp'),
      icon: Clock,
      description: t('timestamp-desc')
    },
    {
      id: 'url-converter' as ConverterType,
      title: t('url-encode'),
      icon: Link,
      description: t('url-encode-desc')
    },
    {
      id: 'base64-converter' as ConverterType,
      title: t('base64'),
      icon: Code2,
      description: t('base64-desc')
    },
    {
      id: 'slug-generator' as ConverterType,
      title: t('slug'),
      icon: Hash,
      description: t('slug-desc')
    },
    {
      id: 'uuid-generator' as ConverterType,
      title: t('uuid'),
      icon: Hash,
      description: t('uuid-desc')
    },
    {
      id: 'json-formatter' as ConverterType,
      title: t('json-formatter'),
      icon: FileJson,
      description: t('json-formatter-desc')
    },
    {
      id: 'sql-formatter' as ConverterType,
      title: t('sql-formatter'),
      icon: Database,
      description: t('sql-formatter-desc')
    },
    {
      id: 'sql-in-converter' as ConverterType,
      title: t('sql-in'),
      icon: List,
      description: t('sql-in-desc')
    },
    {
      id: 'env-converter' as ConverterType,
      title: t('env-converter'),
      icon: Settings,
      description: t('env-converter-desc')
    },
    {
      id: 'html-table-converter' as ConverterType,
      title: t('html-table'),
      icon: Table,
      description: t('html-table-desc')
    },
    {
      id: 'log-parser' as ConverterType,
      title: t('log-parser'),
      icon: FileCode,
      description: t('log-parser-desc')
    },
    {
      id: 'json-to-table' as ConverterType,
      title: language === 'en' ? 'JSON to Table' : 'JSON ke Tabel',
      icon: Table,
      description: language === 'en' ? 'Convert JSON to HTML table' : 'Konversi JSON ke tabel HTML'
    },
    {
      id: 'convert-case' as ConverterType,
      title: language === 'en' ? 'Convert Case' : 'Konversi Case',
      icon: Type,
      description: language === 'en' ? 'Convert text to different cases' : 'Konversi teks ke berbagai case'
    },
    {
      id: 'character-detector' as ConverterType,
      title: language === 'en' ? 'Character Detector' : 'Pendeteksi Karakter',
      icon: Eye,
      description: language === 'en' ? 'Detect invisible and special characters' : 'Deteksi karakter invisible dan spesial'
    },
    {
      id: 'diff-checker' as ConverterType,
      title: language === 'en' ? 'Diff Checker' : 'Pembanding Teks',
      icon: GitCompare,
      description: language === 'en' ? 'Compare two texts and find differences' : 'Bandingkan dua teks dan temukan perbedaan'
    },
    {
      id: 'text-to-sql-create' as ConverterType,
      title: language === 'en' ? 'Text to SQL CREATE' : 'Text ke SQL CREATE',
      icon: Database,
      description: language === 'en' ? 'Convert text to SQL CREATE TABLE' : 'Konversi text ke SQL CREATE TABLE'
    },
    {
      id: 'markdown-preview' as ConverterType,
      title: language === 'en' ? 'Markdown Preview' : 'Preview Markdown',
      icon: Eye,
      description: language === 'en' ? 'Preview markdown with live rendering' : 'Preview markdown dengan rendering langsung'
    },
    {
      id: 'markdown-editor' as ConverterType,
      title: language === 'en' ? 'Markdown Editor' : 'Editor Markdown',
      icon: FileEdit,
      description: language === 'en' ? 'WYSIWYG markdown editor with toolbar' : 'Editor markdown WYSIWYG dengan toolbar'
    }
  ];


  const activeConverterInfo = converters.find(c => c.id === activeConverter);
  const ActiveIcon = activeConverterInfo?.icon || FileText;

  const renderConverter = () => {
    switch (activeConverter) {
      case 'home':
        return <Home onSelectConverter={(id) => setActiveConverter(id as ConverterType)} />;
      case 'csv-to-sql':
        return <CsvToSql />;
      case 'sql-to-csv':
        return <SqlToCsv />;
      case 'json-to-sql':
        return <JsonToSql />;
      case 'sql-to-json':
        return <SqlToJson />;
      case 'excel-to-csv':
        return <ExcelToCsv />;
      case 'csv-json':
        return <CsvJsonConverter />;
      case 'sql-to-schema':
        return <SqlToSchema />;
      case 'schema-to-sql':
        return <SchemaToSql />;
      case 'date-converter':
        return <DateConverter />;
      case 'timestamp-converter':
        return <TimestampConverter />;
      case 'url-converter':
        return <UrlConverter />;
      case 'base64-converter':
        return <Base64Converter />;
      case 'slug-generator':
        return <SlugGenerator />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'sql-formatter':
        return <SqlFormatter />;
      case 'sql-in-converter':
        return <SqlInConverter />;
      case 'env-converter':
        return <EnvConverter />;
      case 'html-table-converter':
        return <HtmlTableConverter />;
      case 'log-parser':
        return <LogParser />;
      case 'json-to-table':
        return <JsonToTable />;
      case 'convert-case':
        return <ConvertCase />;
      case 'character-detector':
        return <CharacterDetector />;
      case 'diff-checker':
        return <DiffChecker />;
      case 'text-to-sql-create':
        return <TextToSqlCreate />;
      case 'markdown-preview':
        return <MarkdownPreview />;
      case 'markdown-editor':
        return <MarkdownEditor />;
      default:
        return null;
    }
  };

  const categories = [
    {
      name: t('dataConversion'),
      items: converters.filter(c => ['csv-to-sql', 'sql-to-csv', 'json-to-sql', 'sql-to-json', 'excel-to-csv'].includes(c.id))
    },
    {
      name: t('textTools'),
      items: converters.filter(c => ['csv-json', 'sql-in-converter', 'html-table-converter', 'json-to-table', 'convert-case', 'character-detector', 'diff-checker', 'markdown-preview', 'markdown-editor'].includes(c.id))
    },
    {
      name: t('sqlTools'),
      items: converters.filter(c => ['sql-to-schema', 'schema-to-sql', 'sql-formatter', 'text-to-sql-create'].includes(c.id))
    },
    {
      name: language === 'en' ? 'Date & Time' : 'Tanggal & Waktu',
      items: converters.filter(c => ['date-converter', 'timestamp-converter'].includes(c.id))
    },
    {
      name: language === 'en' ? 'Encoding' : 'Encoding',
      items: converters.filter(c => ['url-converter', 'base64-converter', 'slug-generator'].includes(c.id))
    },
    {
      name: language === 'en' ? 'Utilities' : 'Utilitas',
      items: converters.filter(c => ['uuid-generator', 'json-formatter', 'env-converter', 'log-parser'].includes(c.id))
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{t('appTitle')}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('appSubtitle')}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 300)}
                placeholder={language === 'en' ? 'Search converter...' : 'Cari konverter...'}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />

              {showSearchDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {converters
                    .filter(c =>
                      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((converter) => {
                      const Icon = converter.icon;
                      return (
                        <button
                          key={converter.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleRouteChange(converter.id);
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                            setSidebarOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                        >
                          <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {converter.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {converter.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  {converters.filter(c =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.description.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      {language === 'en' ? 'No results found' : 'Tidak ada hasil'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
            >
              <Languages className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">{language === 'en' ? 'ID' : 'EN'}</span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto overflow-x-hidden transition-all duration-300 z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} ${sidebarOpen ? 'w-72' : 'w-0'}`}
        >
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => handleSidebarCollapse(!sidebarCollapsed)}
            className="hidden lg:flex absolute -right-4 top-6 w-8 h-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-md hover:shadow-lg z-50"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
          </button>

          <div className="p-6">
            {!sidebarCollapsed && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  {language === 'en' ? 'Navigation' : 'Navigasi'}
                </h2>
              </div>
            )}

            {/* Home Button */}
            <button
              onClick={() => {
                handleRouteChange('home');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-lg transition-all group relative mb-6 ${
                sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
              } ${
                activeConverter === 'home'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-3 border-blue-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title={sidebarCollapsed ? (language === 'en' ? 'Home' : 'Beranda') : ''}
            >
              <HomeIcon className={`flex-shrink-0 ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${
                activeConverter === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
              }`} />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">
                  {language === 'en' ? 'Home' : 'Beranda'}
                </span>
              )}

              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {language === 'en' ? 'Home' : 'Beranda'}
                </div>
              )}
            </button>

            {!sidebarCollapsed && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  {language === 'en' ? 'All Tools' : 'Semua Tool'}
                </h2>
              </div>
            )}

            {categories.map((category, index) => (
              <div key={category.name} className={index > 0 ? 'mt-6' : ''}>
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
                    {category.name}
                  </h3>
                )}
                <div className="space-y-1">
                  {category.items.map((converter) => {
                    const Icon = converter.icon;
                    const isActive = activeConverter === converter.id;

                    return (
                      <button
                        key={converter.id}
                        onClick={() => {
                          handleRouteChange(converter.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${
                          sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
                        } ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-3 border-blue-600'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        title={sidebarCollapsed ? converter.title : ''}
                      >
                        <Icon className={`flex-shrink-0 ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                        }`} />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium truncate">{converter.title}</span>
                        )}

                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {converter.title}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeConverter !== 'home' ? (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <button
                    onClick={() => handleRouteChange('home')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {language === 'en' ? 'Home' : 'Beranda'}
                  </button>
                  <span>/</span>
                  <span className="text-slate-700 dark:text-slate-300">{activeConverterInfo?.title}</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ActiveIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{activeConverterInfo?.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{activeConverterInfo?.description}</p>
                  </div>
                </div>
              </div>

              {/* Converter Content */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                {renderConverter()}
              </div>
            </>
          ) : (
            <div className="py-8">
              {renderConverter()}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
