import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationService } from '@/services/TranslationService';

interface TranslatedTextProps {
  text: string;
  fallback?: string;
  context?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component that automatically translates text using AI when current language is not English
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  fallback, 
  context, 
  className,
  as: Component = 'span'
}) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const translateText = async () => {
      // If current language is English, no translation needed
      if (i18n.language === 'en') {
        setTranslatedText(text);
        return;
      }

      // If text is empty, use fallback or original
      if (!text.trim()) {
        setTranslatedText(fallback || text);
        return;
      }

      setIsLoading(true);
      
      try {
        const result = await TranslationService.translateText({
          text,
          targetLanguage: i18n.language,
          sourceLanguage: 'en',
          context
        });
        
        setTranslatedText(result.translatedText);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, i18n.language, fallback, context]);

  if (isLoading) {
    return (
      <Component className={className}>
        <span className="opacity-70">{text}</span>
      </Component>
    );
  }

  return (
    <Component className={className}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;