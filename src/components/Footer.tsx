import { Github, Mail, Heart, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">Convertify</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'en' 
                ? 'Convert anything. Faster. Smarter.' 
                : 'Konversi apapun. Lebih Cepat. Lebih Pintar.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {language === 'en' 
                ? 'Developer tools for data conversion' 
                : 'Alat developer untuk konversi data'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              {language === 'en' ? 'Resources' : 'Sumber Daya'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/AhmadSayadi/convertify#readme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {language === 'en' ? 'Documentation' : 'Dokumentasi'}
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/AhmadSayadi/convertify/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {language === 'en' ? 'Report Bug' : 'Laporkan Bug'}
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/AhmadSayadi/convertify/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {language === 'en' ? 'Request Feature' : 'Request Fitur'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
              {language === 'en' ? 'Connect' : 'Kontak'}
            </h3>
            <div className="space-y-2">
              <a 
                href="https://github.com/AhmadSayadi/convertify" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a 
                href="mailto:me@ahmadsayadi.com"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>me@ahmadsayadi.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
              © {currentYear} Convertify. {language === 'en' ? 'All rights reserved.' : 'Hak cipta dilindungi.'}
            </p>
            <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'Made with' : 'Dibuat dengan'} 
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 
              {language === 'en' ? 'by' : 'oleh'} 
              <a 
                href="https://ahmadsayadi.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ahmad Sayadi
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
