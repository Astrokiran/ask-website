'use client';

import { Languages } from "lucide-react";
import { useLanguageStore, type Language } from "@/stores/languageStore";
import { useEffect, useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // Optional: Show toast notification
    // toast.success(`Language changed to ${newLang === 'en' ? 'English' : 'हिन्दी'}`);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        aria-label="Select Language"
      >
        <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === 'en' ? 'EN' : 'हिं'}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[10001]">
        <div className="py-2">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              language === 'en'
                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">🇬🇧</span>
            English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              language === 'hi'
                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">🇮🇳</span>
            हिन्दी (Hindi)
          </button>
        </div>
      </div>
    </div>
  );
}
