import { useState } from 'react';
import { Copy, Download, Trash2, Type } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ConvertCase() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertToSentenceCase = (text: string): string => {
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  };

  const convertToLowerCase = (text: string): string => {
    return text.toLowerCase();
  };

  const convertToUpperCase = (text: string): string => {
    return text.toUpperCase();
  };

  const convertToCapitalizedCase = (text: string): string => {
    return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  const convertToAlternatingCase = (text: string): string => {
    return text.split('').map((char, index) =>
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('');
  };

  const convertToTitleCase = (text: string): string => {
    const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'via'];
    return text.toLowerCase().split(' ').map((word, index) => {
      if (index === 0 || !smallWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join(' ');
  };

  const convertToInverseCase = (text: string): string => {
    return text.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
  };

  const handleCaseConversion = (converter: (text: string) => string) => {
    if (input) {
      setInput(converter(input));
    }
  };

  const copyToClipboard = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadText = () => {
    if (!input) return;
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearInput = () => {
    setInput('');
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Type className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">
              {language === 'en' ? 'Convert Case' : 'Konversi Case'}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {language === 'en'
                ? 'Transform your text into different cases. Click any button below to instantly convert the text in the input field.'
                : 'Ubah teks Anda ke berbagai case. Klik tombol di bawah untuk langsung mengkonversi teks di kolom input.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {language === 'en' ? 'Input Text' : 'Teks Input'}
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'en' ? 'Type or paste your content here' : 'Ketik atau tempel konten Anda di sini'}
          className="w-full h-48 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Type className="w-4 h-4" />
          <span>{input.length} {language === 'en' ? 'characters' : 'karakter'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCaseConversion(convertToSentenceCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sentence case
        </button>

        <button
          onClick={() => handleCaseConversion(convertToLowerCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          lower case
        </button>

        <button
          onClick={() => handleCaseConversion(convertToUpperCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          UPPER CASE
        </button>

        <button
          onClick={() => handleCaseConversion(convertToCapitalizedCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Capitalized Case
        </button>

        <button
          onClick={() => handleCaseConversion(convertToAlternatingCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          aLtErNaTiNg cAsE
        </button>

        <button
          onClick={() => handleCaseConversion(convertToTitleCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Title Case
        </button>

        <button
          onClick={() => handleCaseConversion(convertToInverseCase)}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          InVeRsE CaSe
        </button>

        <button
          onClick={downloadText}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Text
        </button>

        <button
          onClick={copyToClipboard}
          disabled={!input}
          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? (language === 'en' ? 'Copied!' : 'Disalin!') : 'Copy to Clipboard'}
        </button>

        <button
          onClick={clearInput}
          disabled={!input}
          className="px-4 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {copied && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ {language === 'en' ? 'Text copied to clipboard!' : 'Teks disalin ke clipboard!'}
          </p>
        </div>
      )}

      {!input && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Type className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'en' ? 'Enter text above and use the buttons to convert' : 'Masukkan teks di atas dan gunakan tombol untuk konversi'}</p>
        </div>
      )}
    </div>
  );
}
