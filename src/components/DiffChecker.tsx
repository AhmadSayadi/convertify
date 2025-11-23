import { useState } from 'react';
import { Copy, Upload, Trash2, GitCompare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CharDiff {
  char: string;
  type: 'same' | 'add' | 'remove';
}

interface DiffResult {
  type: 'addition' | 'deletion' | 'unchanged' | 'modified';
  content: string;
  lineNumber: number;
  charDiffs?: CharDiff[];
}

export default function DiffChecker() {
  const { language } = useLanguage();
  const [originalText, setOriginalText] = useState('');
  const [changedText, setChangedText] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState<{ left: DiffResult[]; right: DiffResult[] }>({ left: [], right: [] });

  const getCharDiffs = (str1: string, str2: string): { left: CharDiff[]; right: CharDiff[] } => {
    const left: CharDiff[] = [];
    const right: CharDiff[] = [];

    const len1 = str1.length;
    const len2 = str2.length;

    let i = 0;
    let j = 0;

    while (i < len1 || j < len2) {
      if (i < len1 && j < len2 && str1[i] === str2[j]) {
        left.push({ char: str1[i], type: 'same' });
        right.push({ char: str2[j], type: 'same' });
        i++;
        j++;
      } else {
        let foundMatch = false;

        for (let lookAhead = 1; lookAhead <= 5 && !foundMatch; lookAhead++) {
          if (i + lookAhead < len1 && str1[i + lookAhead] === str2[j]) {
            for (let k = 0; k < lookAhead; k++) {
              left.push({ char: str1[i + k], type: 'remove' });
            }
            i += lookAhead;
            foundMatch = true;
          } else if (j + lookAhead < len2 && str1[i] === str2[j + lookAhead]) {
            for (let k = 0; k < lookAhead; k++) {
              right.push({ char: str2[j + k], type: 'add' });
            }
            j += lookAhead;
            foundMatch = true;
          }
        }

        if (!foundMatch) {
          if (i < len1) {
            left.push({ char: str1[i], type: 'remove' });
            i++;
          }
          if (j < len2) {
            right.push({ char: str2[j], type: 'add' });
            j++;
          }
        }
      }
    }

    return { left, right };
  };

  const computeDiff = () => {
    if (!originalText && !changedText) return;

    const originalLines = originalText.split('\n');
    const changedLines = changedText.split('\n');

    const leftDiff: DiffResult[] = [];
    const rightDiff: DiffResult[] = [];

    const maxLength = Math.max(originalLines.length, changedLines.length);

    for (let i = 0; i < maxLength; i++) {
      const origLine = originalLines[i] !== undefined ? originalLines[i] : null;
      const changeLine = changedLines[i] !== undefined ? changedLines[i] : null;

      if (origLine === changeLine && origLine !== null) {
        leftDiff.push({ type: 'unchanged', content: origLine, lineNumber: i + 1 });
        rightDiff.push({ type: 'unchanged', content: changeLine ?? '', lineNumber: i + 1 });
      } else if (origLine !== null && changeLine !== null) {
        const charDiffs = getCharDiffs(origLine, changeLine);

        leftDiff.push({
          type: 'modified',
          content: origLine,
          lineNumber: i + 1,
          charDiffs: charDiffs.left
        });
        rightDiff.push({
          type: 'modified',
          content: changeLine,
          lineNumber: i + 1,
          charDiffs: charDiffs.right
        });
      } else if (origLine !== null) {
        leftDiff.push({ type: 'deletion', content: origLine, lineNumber: i + 1 });
      } else if (changeLine !== null) {
        rightDiff.push({ type: 'addition', content: changeLine, lineNumber: i + 1 });
      }
    }

    setDiffResult({ left: leftDiff, right: rightDiff });
    setShowDiff(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'original' | 'changed') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (side === 'original') {
          setOriginalText(content);
        } else {
          setChangedText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setOriginalText('');
    setChangedText('');
    setShowDiff(false);
    setDiffResult({ left: [], right: [] });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderLineContent = (line: DiffResult) => {
    if (line.type === 'unchanged') {
      return <span className="text-slate-700 dark:text-slate-300">{line.content || ' '}</span>;
    }

    if (line.type === 'deletion') {
      return <span className="text-slate-700 dark:text-slate-300">{line.content || ' '}</span>;
    }

    if (line.type === 'addition') {
      return <span className="text-slate-700 dark:text-slate-300">{line.content || ' '}</span>;
    }

    if (line.type === 'modified' && line.charDiffs) {
      return (
        <span>
          {line.charDiffs.map((charDiff, idx) => {
            if (charDiff.type === 'same') {
              return <span key={idx} className="text-slate-700 dark:text-slate-300">{charDiff.char}</span>;
            } else if (charDiff.type === 'remove') {
              return (
                <span
                  key={idx}
                  className="bg-red-600 text-white font-bold px-0.5"
                >
                  {charDiff.char}
                </span>
              );
            } else if (charDiff.type === 'add') {
              return (
                <span
                  key={idx}
                  className="bg-red-600 text-white font-bold px-0.5"
                >
                  {charDiff.char}
                </span>
              );
            }
            return null;
          })}
        </span>
      );
    }

    return <span>{line.content || ' '}</span>;
  };

  const additions = diffResult.right.filter(d => d.type === 'addition' || d.type === 'modified').length;
  const deletions = diffResult.left.filter(d => d.type === 'deletion' || d.type === 'modified').length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <GitCompare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">
              {language === 'en' ? 'Diff Checker' : 'Pembanding Teks'}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              {language === 'en'
                ? 'Compare two texts and find the differences. Only the different characters are highlighted - additions in green, deletions in red.'
                : 'Bandingkan dua teks dan temukan perbedaannya. Hanya karakter yang berbeda yang dihighlight - penambahan hijau, penghapusan merah.'}
            </p>
          </div>
        </div>
      </div>

      {!showDiff ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Original Text' : 'Teks Asli'}
              </label>
              <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {language === 'en' ? 'Open file' : 'Buka file'}
                <input
                  type="file"
                  accept=".txt,.json,.js,.ts,.jsx,.tsx,.html,.css,.xml"
                  onChange={(e) => handleFileUpload(e, 'original')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder={language === 'en' ? 'Paste original text here...' : 'Tempel teks asli di sini...'}
              className="w-full h-96 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {originalText.split('\n').length} {language === 'en' ? 'lines' : 'baris'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Changed Text' : 'Teks Berubah'}
              </label>
              <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {language === 'en' ? 'Open file' : 'Buka file'}
                <input
                  type="file"
                  accept=".txt,.json,.js,.ts,.jsx,.tsx,.html,.css,.xml"
                  onChange={(e) => handleFileUpload(e, 'changed')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={changedText}
              onChange={(e) => setChangedText(e.target.value)}
              placeholder={language === 'en' ? 'Paste changed text here...' : 'Tempel teks berubah di sini...'}
              className="w-full h-96 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {changedText.split('\n').length} {language === 'en' ? 'lines' : 'baris'}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded"></span>
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                  {deletions} {language === 'en' ? 'changes with removals' : 'perubahan dengan penghapusan'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded"></span>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {additions} {language === 'en' ? 'changes with additions' : 'perubahan dengan penambahan'}
                </span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {Math.max(diffResult.left.length, diffResult.right.length)} {language === 'en' ? 'lines' : 'baris'}
              </div>
            </div>
            <button
              onClick={() => setShowDiff(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {language === 'en' ? 'Edit' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
              <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
                  <span className="text-lg">−</span>
                  {language === 'en' ? 'Original' : 'Asli'}
                </div>
                <button
                  onClick={() => copyToClipboard(originalText)}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  title={language === 'en' ? 'Copy' : 'Salin'}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 max-h-[600px] overflow-auto font-mono text-sm">
                {diffResult.left.map((line, index) => (
                  <div
                    key={index}
                    className="flex gap-3 px-2 py-1"
                  >
                    <span className="text-slate-400 dark:text-slate-500 select-none min-w-[2rem] text-right">
                      {line.lineNumber}
                    </span>
                    <span className="break-all">
                      {renderLineContent(line)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
                  <span className="text-lg">+</span>
                  {language === 'en' ? 'Changed' : 'Berubah'}
                </div>
                <button
                  onClick={() => copyToClipboard(changedText)}
                  className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                  title={language === 'en' ? 'Copy' : 'Salin'}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 max-h-[600px] overflow-auto font-mono text-sm">
                {diffResult.right.map((line, index) => (
                  <div
                    key={index}
                    className="flex gap-3 px-2 py-1"
                  >
                    <span className="text-slate-400 dark:text-slate-500 select-none min-w-[2rem] text-right">
                      {line.lineNumber}
                    </span>
                    <span className="break-all">
                      {renderLineContent(line)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        {!showDiff ? (
          <>
            <button
              onClick={computeDiff}
              disabled={!originalText && !changedText}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              <GitCompare className="w-5 h-5" />
              {language === 'en' ? 'Find difference' : 'Temukan perbedaan'}
            </button>
            {(originalText || changedText) && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                {language === 'en' ? 'Clear' : 'Hapus'}
              </button>
            )}
          </>
        ) : (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            {language === 'en' ? 'Clear' : 'Hapus'}
          </button>
        )}
      </div>

      {!showDiff && !originalText && !changedText && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'en' ? 'Enter texts above to compare' : 'Masukkan teks di atas untuk dibandingkan'}</p>
        </div>
      )}
    </div>
  );
}
