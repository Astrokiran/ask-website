import { Language } from '@/lib/gameLanguage';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full p-0.5 sm:p-1 w-full max-w-xs sm:max-w-sm mx-auto">
      <button
        onClick={() => onLanguageChange('en')}
        className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] touch-manipulation ${
          currentLanguage === 'en'
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md scale-105'
            : 'text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 hover:scale-105 active:scale-95'
        }`}
      >
        <span className="block truncate">English</span>
      </button>
      <button
        onClick={() => onLanguageChange('hi')}
        className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] touch-manipulation ${
          currentLanguage === 'hi'
            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md scale-105'
            : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:scale-105 active:scale-95'
        }`}
      >
        <span className="block truncate">हिन्दी</span>
      </button>
    </div>
  );
}