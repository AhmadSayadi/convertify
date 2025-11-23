import { useState } from 'react';
import { Copy, Check, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MarkdownPreview() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string): string => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 dark:text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-800 dark:text-white mt-8 mb-4">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr class="border-slate-300 dark:border-slate-700 my-6" />');

    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">$1</blockquote>');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/(<li class="ml-6 list-disc">.*<\/li>)/s, '<ul class="my-4">$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');
    html = html.replace(/(<li class="ml-6 list-decimal">.*<\/li>)/s, '<ol class="my-4">$1</ol>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = html.replace(/\n/g, '<br />');

    // Wrap in paragraph
    html = '<p class="mb-4">' + html + '</p>';

    return html;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>{language === 'en' ? 'Supported Markdown:' : 'Markdown yang Didukung:'}</strong>
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
          {language === 'en' 
            ? 'Headers (#, ##, ###), Bold (**text**), Italic (*text*), Code (`code`), Links [text](url), Images ![alt](url), Lists (-, *), Blockquotes (>), Code blocks (```), Horizontal rules (---)'
            : 'Header (#, ##, ###), Tebal (**teks**), Miring (*teks*), Kode (`kode`), Link [teks](url), Gambar ![alt](url), List (-, *), Blockquote (>), Blok kode (```), Garis horizontal (---)'}
        </p>
      </div>

      {/* Input and Preview Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Markdown Input' : 'Input Markdown'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!input}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? (language === 'en' ? 'Copied!' : 'Tersalin!') : (language === 'en' ? 'Copy' : 'Salin')}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[600px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
            placeholder={language === 'en' 
              ? '# Hello World\n\nThis is **bold** and this is *italic*.\n\n## Features\n- Item 1\n- Item 2\n\n```javascript\nconst hello = "world";\n```'
              : '# Halo Dunia\n\nIni **tebal** dan ini *miring*.\n\n## Fitur\n- Item 1\n- Item 2\n\n```javascript\nconst halo = "dunia";\n```'}
          />
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Preview' : 'Pratinjau'}
            </label>
          </div>
          <div 
            className="w-full h-[600px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: input ? markdownToHtml(input) : `<p class="text-slate-400 dark:text-slate-500">${language === 'en' ? 'Preview will appear here...' : 'Pratinjau akan muncul di sini...'}</p>` }}
          />
        </div>
      </div>
    </div>
  );
}
