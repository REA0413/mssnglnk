import { Language } from '../config/languages';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded ${
          currentLanguage === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('id')}
        className={`px-3 py-1 rounded ${
          currentLanguage === 'id' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ID
      </button>
    </div>
  );
} 