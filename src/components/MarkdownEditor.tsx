import { useState, useRef } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, Image, List, ListOrdered, Quote, Minus, Eye, Copy, Check, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MarkdownEditor() {
  const { language } = useLanguage();
  const [markdown, setMarkdown] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert markdown syntax at cursor position
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = markdown.substring(0, start) + before + textToInsert + after + markdown.substring(end);
    setMarkdown(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Toolbar actions
  const makeBold = () => insertMarkdown('**', '**', 'bold text');
  const makeItalic = () => insertMarkdown('*', '*', 'italic text');
  const makeCode = () => insertMarkdown('`', '`', 'code');
  const makeCodeBlock = () => insertMarkdown('```\n', '\n```', 'code block');
  const makeLink = () => insertMarkdown('[', '](url)', 'link text');
  const makeImage = () => insertMarkdown('![', '](image-url)', 'alt text');
  const makeList = () => insertMarkdown('- ', '', 'list item');
  const makeOrderedList = () => insertMarkdown('1. ', '', 'list item');
  const makeQuote = () => insertMarkdown('> ', '', 'quote');
  const makeHR = () => insertMarkdown('\n---\n', '', '');
  const makeH1 = () => insertMarkdown('# ', '', 'Heading 1');
  const makeH2 = () => insertMarkdown('## ', '', 'Heading 2');
  const makeH3 = () => insertMarkdown('### ', '', 'Heading 3');

  // Convert markdown to HTML (same as MarkdownPreview)
  const markdownToHtml = (md: string): string => {
    let html = md;

    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 dark:text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-800 dark:text-white mt-8 mb-4">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400">$1</code>');
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    html = html.replace(/^---$/gim, '<hr class="border-slate-300 dark:border-slate-700 my-6" />');
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">$1</blockquote>');
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/(<li class="ml-6 list-disc">.*<\/li>)/s, '<ul class="my-4">$1</ul>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');
    html = html.replace(/(<li class="ml-6 list-decimal">.*<\/li>)/s, '<ol class="my-4">$1</ol>');
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = html.replace(/\n/g, '<br />');
    html = '<p class="mb-4">' + html + '</p>';

    return html;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2">
        <div className="flex flex-wrap gap-1">
          {/* Headings */}
          <button onClick={makeH1} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm font-semibold" title="Heading 1">
            H1
          </button>
          <button onClick={makeH2} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm font-semibold" title="Heading 2">
            H2
          </button>
          <button onClick={makeH3} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-sm font-semibold" title="Heading 3">
            H3
          </button>
          
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Text formatting */}
          <button onClick={makeBold} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={makeItalic} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={makeCode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Inline Code">
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Links & Images */}
          <button onClick={makeLink} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Link">
            <LinkIcon className="w-4 h-4" />
          </button>
          <button onClick={makeImage} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Image">
            <Image className="w-4 h-4" />
          </button>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Lists */}
          <button onClick={makeList} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button onClick={makeOrderedList} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

          {/* Others */}
          <button onClick={makeQuote} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Quote">
            <Quote className="w-4 h-4" />
          </button>
          <button onClick={makeCodeBlock} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-mono" title="Code Block">
            {'</>'}
          </button>
          <button onClick={makeHR} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Horizontal Rule">
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1" />

          {/* Actions */}
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className={`p-2 rounded ${showPreview ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            title="Toggle Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={handleCopy} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Copy Markdown">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={handleDownload} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {language === 'en' ? 'Markdown Editor' : 'Editor Markdown'}
          </label>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-[600px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
            placeholder={language === 'en' 
              ? 'Start writing your markdown here...\n\nUse the toolbar above for formatting!'
              : 'Mulai menulis markdown di sini...\n\nGunakan toolbar di atas untuk formatting!'}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {language === 'en' ? 'Live Preview' : 'Pratinjau Langsung'}
            </label>
            <div 
              className="w-full h-[600px] px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: markdown ? markdownToHtml(markdown) : `<p class="text-slate-400 dark:text-slate-500">${language === 'en' ? 'Preview will appear here...' : 'Pratinjau akan muncul di sini...'}</p>` 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
