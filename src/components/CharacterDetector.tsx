import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Copy, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CharacterInfo {
  char: string;
  code: number;
  hex: string;
  description: string;
  position: number;
  isSpecial: boolean;
  category: string;
}

export default function CharacterDetector() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [specialCount, setSpecialCount] = useState(0);

  const getCharacterDescription = (code: number): { description: string; category: string; isSpecial: boolean } => {
    const invisibleChars: { [key: number]: { desc: string; cat: string } } = {
      0: { desc: 'NULL', cat: 'Control' },
      9: { desc: 'TAB (Horizontal Tab)', cat: 'Whitespace' },
      10: { desc: 'LF (Line Feed / Newline)', cat: 'Whitespace' },
      11: { desc: 'VT (Vertical Tab)', cat: 'Whitespace' },
      12: { desc: 'FF (Form Feed)', cat: 'Whitespace' },
      13: { desc: 'CR (Carriage Return)', cat: 'Whitespace' },
      32: { desc: 'Space', cat: 'Whitespace' },
      160: { desc: 'NBSP (Non-Breaking Space)', cat: 'Whitespace' },
      8203: { desc: 'ZWSP (Zero Width Space)', cat: 'Invisible' },
      8204: { desc: 'ZWNJ (Zero Width Non-Joiner)', cat: 'Invisible' },
      8205: { desc: 'ZWJ (Zero Width Joiner)', cat: 'Invisible' },
      8206: { desc: 'LRM (Left-to-Right Mark)', cat: 'Invisible' },
      8207: { desc: 'RLM (Right-to-Left Mark)', cat: 'Invisible' },
      8232: { desc: 'LS (Line Separator)', cat: 'Whitespace' },
      8233: { desc: 'PS (Paragraph Separator)', cat: 'Whitespace' },
      8288: { desc: 'WJ (Word Joiner)', cat: 'Invisible' },
      65279: { desc: 'BOM (Zero Width No-Break Space)', cat: 'Invisible' }
    };

    if (invisibleChars[code]) {
      return {
        description: invisibleChars[code].desc,
        category: invisibleChars[code].cat,
        isSpecial: true
      };
    }

    if (code < 32) {
      return {
        description: `Control Character (${code})`,
        category: 'Control',
        isSpecial: true
      };
    }

    if (code >= 127 && code < 160) {
      return {
        description: `Control Character (${code})`,
        category: 'Control',
        isSpecial: true
      };
    }

    if (code >= 8192 && code <= 8303) {
      return {
        description: 'Special Unicode Space',
        category: 'Whitespace',
        isSpecial: true
      };
    }

    return {
      description: 'Regular Character',
      category: 'Normal',
      isSpecial: false
    };
  };

  useEffect(() => {
    if (!input) {
      setCharacters([]);
      setSpecialCount(0);
      return;
    }

    const charList: CharacterInfo[] = [];
    let specialChars = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const code = char.charCodeAt(0);
      const { description, category, isSpecial } = getCharacterDescription(code);

      if (isSpecial) specialChars++;

      charList.push({
        char: char,
        code: code,
        hex: '0x' + code.toString(16).toUpperCase().padStart(4, '0'),
        description: description,
        position: i + 1,
        isSpecial: isSpecial,
        category: category
      });
    }

    setCharacters(charList);
    setSpecialCount(specialChars);
  }, [input]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearInput = () => {
    setInput('');
  };

  const removeSpecialCharacters = () => {
    const cleaned = input.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\u202A-\u202E\u2060\uFEFF]/g, '');
    setInput(cleaned);
  };

  const specialCharacters = characters.filter(c => c.isSpecial);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">
              {language === 'en' ? 'Character Detector' : 'Pendeteksi Karakter'}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {language === 'en'
                ? 'Detects invisible and special characters like tabs, newlines, zero-width spaces, and control characters that are not visible to the eye.'
                : 'Mendeteksi karakter invisible dan spesial seperti tab, baris baru, spasi lebar nol, dan karakter kontrol yang tidak terlihat oleh mata.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {language === 'en' ? 'Input Text' : 'Teks Input'}
          </label>
          <div className="flex items-center gap-2">
            {specialCount > 0 && (
              <button
                onClick={removeSpecialCharacters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                {language === 'en' ? 'Remove Special' : 'Hapus Spesial'}
              </button>
            )}
            <button
              onClick={clearInput}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {language === 'en' ? 'Clear' : 'Hapus'}
            </button>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'en' ? 'Paste or type text to analyze...' : 'Tempel atau ketik teks untuk dianalisis...'}
          className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="font-semibold">{characters.length}</span>
            <span>{language === 'en' ? 'total characters' : 'total karakter'}</span>
          </div>
          {specialCount > 0 && (
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">{specialCount}</span>
              <span>{language === 'en' ? 'special characters found' : 'karakter spesial ditemukan'}</span>
            </div>
          )}
        </div>
      </div>

      {specialCount > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {language === 'en' ? 'Special Characters Detected' : 'Karakter Spesial Terdeteksi'}
          </h3>
          <div className="space-y-2">
            {specialCharacters.map((char, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/50 rounded p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 rounded font-mono text-xs font-bold">
                        Position {char.position}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold">
                        {char.category}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mb-1">
                      {char.description}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span>Unicode: U+{char.code.toString(16).toUpperCase().padStart(4, '0')}</span>
                      <span>Decimal: {char.code}</span>
                      <span>Hex: {char.hex}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(char.hex)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all"
                    title={language === 'en' ? 'Copy code' : 'Salin kode'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {characters.length > 0 && specialCount === 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="text-green-600 dark:text-green-400 font-semibold">
            ✓ {language === 'en' ? 'No special characters detected' : 'Tidak ada karakter spesial terdeteksi'}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            {language === 'en' ? 'All characters are regular and visible' : 'Semua karakter normal dan terlihat'}
          </p>
        </div>
      )}

      {!input && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'en' ? 'Paste text above to detect special characters' : 'Tempel teks di atas untuk mendeteksi karakter spesial'}</p>
        </div>
      )}
    </div>
  );
}
