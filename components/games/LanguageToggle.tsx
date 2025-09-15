import { Language } from '@/lib/gameLanguage';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full p-1">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          currentLanguage === 'en'
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md'
            : 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange('hi')}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          currentLanguage === 'hi'
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md'
            : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}