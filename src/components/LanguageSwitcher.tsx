import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSwitcherProps {
  transparent?: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ transparent = false }) => {
  const { i18n } = useTranslation();
  const [translationsEnabled, setTranslationsEnabled] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const checkTranslationStatus = async () => {
      try {
        const enabled = await SiteSettingsService.getSetting('translation_system_enabled');
        setTranslationsEnabled(enabled === true);
      } catch (error) {
        console.error('Error checking translation status:', error);
        setTranslationsEnabled(false);
      }
    };
    checkTranslationStatus();
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    
    // Update document direction for RTL languages
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  if (!translationsEnabled) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            transparent
              ? "text-white border border-white/30 hover:border-white/50 hover:bg-white/10"
              : "text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="inline">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{language.nativeName}</span>
            </div>
            {currentLanguage.code === language.code && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;