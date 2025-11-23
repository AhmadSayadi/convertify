import { useState } from 'react';
import { Copy, Check, GitCommit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type CommitType = 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'perf' | 'test' | 'chore' | 'build' | 'ci';
type CommitFormat = 'conventional' | 'detailed' | 'simple';

export default function CommitMessageGenerator() {
  const { language } = useLanguage();
  const [commitType, setCommitType] = useState<CommitType>('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [breakingChange, setBreakingChange] = useState('');
  const [issues, setIssues] = useState('');
  const [format, setFormat] = useState<CommitFormat>('conventional');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const commitTypes = [
    { value: 'feat', label: 'feat', emoji: '✨', desc: language === 'en' ? 'New feature' : 'Fitur baru' },
    { value: 'fix', label: 'fix', emoji: '🐛', desc: language === 'en' ? 'Bug fix' : 'Perbaikan bug' },
    { value: 'docs', label: 'docs', emoji: '📝', desc: language === 'en' ? 'Documentation' : 'Dokumentasi' },
    { value: 'style', label: 'style', emoji: '💄', desc: language === 'en' ? 'Code style' : 'Style kode' },
    { value: 'refactor', label: 'refactor', emoji: '♻️', desc: language === 'en' ? 'Code refactoring' : 'Refactoring kode' },
    { value: 'perf', label: 'perf', emoji: '⚡', desc: language === 'en' ? 'Performance' : 'Performa' },
    { value: 'test', label: 'test', emoji: '✅', desc: language === 'en' ? 'Tests' : 'Testing' },
    { value: 'chore', label: 'chore', emoji: '🔧', desc: language === 'en' ? 'Maintenance' : 'Maintenance' },
    { value: 'build', label: 'build', emoji: '📦', desc: language === 'en' ? 'Build system' : 'Sistem build' },
    { value: 'ci', label: 'ci', emoji: '👷', desc: language === 'en' ? 'CI/CD' : 'CI/CD' }
  ];

  const generateCommit = () => {
    if (!description.trim()) {
      setOutput('');
      return;
    }

    let message = '';

    if (format === 'simple') {
      // Simple format
      message = description;
      if (body) {
        message += `\n\n${body}`;
      }
    } else if (format === 'conventional') {
      // Conventional Commits format
      const scopeText = scope ? `(${scope})` : '';
      message = `${commitType}${scopeText}: ${description}`;
      
      if (body || breakingChange) {
        message += '\n';
        if (body) {
          message += `\n${body}`;
        }
        if (breakingChange) {
          message += `\n\nBREAKING CHANGE: ${breakingChange}`;
        }
      }
      
      if (issues) {
        message += `\n\n${issues}`;
      }
    } else {
      // Detailed format with emojis
      const emojiMap: Record<CommitType, string> = {
        feat: '✨',
        fix: '🐛',
        docs: '📝',
        style: '💄',
        refactor: '♻️',
        perf: '⚡',
        test: '✅',
        chore: '🔧',
        build: '📦',
        ci: '👷'
      };
      
      const scopeText = scope ? `(${scope})` : '';
      message = `${emojiMap[commitType]} ${commitType}${scopeText}: ${description}`;
      
      if (body) {
        message += `\n\n${body}`;
      }
      
      if (breakingChange) {
        message += `\n\n⚠️ BREAKING CHANGE: ${breakingChange}`;
      }
      
      if (issues) {
        message += `\n\n${issues}`;
      }
    }

    setOutput(message);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setDescription('');
    setBody('');
    setBreakingChange('');
    setIssues('');
    setScope('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>{language === 'en' ? 'Commit Message Generator' : 'Generator Pesan Commit'}</strong>
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
          {language === 'en' 
            ? 'Generate professional commit messages following Conventional Commits specification'
            : 'Generate pesan commit profesional mengikuti spesifikasi Conventional Commits'}
        </p>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Format' : 'Format'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setFormat('conventional')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              format === 'conventional'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Conventional
          </button>
          <button
            onClick={() => setFormat('detailed')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              format === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {language === 'en' ? 'Detailed' : 'Detail'}
          </button>
          <button
            onClick={() => setFormat('simple')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors ${
              format === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Simple
          </button>
        </div>
      </div>

      {/* Commit Type */}
      {format !== 'simple' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Commit Type' : 'Tipe Commit'}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {language === 'en' 
              ? 'Select the type of change you\'re committing:'
              : 'Pilih tipe perubahan yang Anda commit:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {commitTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setCommitType(type.value as CommitType)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  commitType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
                title={`${type.emoji} ${type.desc}`}
              >
                <span className="hidden sm:inline">{type.emoji} </span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scope */}
      {format !== 'simple' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Scope (optional)' : 'Scope (opsional)'}
          </label>
          <input
            type="text"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder={language === 'en' ? 'e.g., auth, api, ui' : 'contoh: auth, api, ui'}
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Description (required)' : 'Deskripsi (wajib)'}
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder={language === 'en' ? 'Brief description of changes' : 'Deskripsi singkat perubahan'}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Body (optional)' : 'Body (opsional)'}
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-24 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder={language === 'en' ? 'Detailed explanation of changes...' : 'Penjelasan detail perubahan...'}
        />
      </div>

      {/* Breaking Change */}
      {format !== 'simple' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Breaking Change (optional)' : 'Breaking Change (opsional)'}
          </label>
          <input
            type="text"
            value={breakingChange}
            onChange={(e) => setBreakingChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder={language === 'en' ? 'Describe breaking changes' : 'Jelaskan breaking changes'}
          />
        </div>
      )}

      {/* Issues */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {language === 'en' ? 'Issues (optional)' : 'Issues (opsional)'}
        </label>
        <input
          type="text"
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder={language === 'en' ? 'e.g., Closes #123, Fixes #456' : 'contoh: Closes #123, Fixes #456'}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={generateCommit}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <GitCommit className="w-5 h-5" />
          {language === 'en' ? 'Generate' : 'Generate'}
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
              {language === 'en' ? 'Generated Commit Message' : 'Pesan Commit yang Dihasilkan'}
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
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {language === 'en' ? 'Examples:' : 'Contoh:'}
        </h4>
        <div className="space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div>
            <strong>Conventional:</strong>
            <pre className="mt-1 text-slate-500 dark:text-slate-500">feat(auth): add login functionality</pre>
          </div>
          <div>
            <strong>Detailed:</strong>
            <pre className="mt-1 text-slate-500 dark:text-slate-500">✨ feat(auth): add login functionality</pre>
          </div>
          <div>
            <strong>Simple:</strong>
            <pre className="mt-1 text-slate-500 dark:text-slate-500">Add login functionality</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
