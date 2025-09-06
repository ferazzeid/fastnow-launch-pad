import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationService } from '@/services/TranslationService';

interface UseAutoTranslationOptions {
  text: string;
  context?: string;
  fallback?: string;
  enabled?: boolean;
}

interface UseAutoTranslationResult {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  isTranslated: boolean;
}

/**
 * Hook for automatic translation of dynamic content
 */
export const useAutoTranslation = ({
  text,
  context,
  fallback,
  enabled = true
}: UseAutoTranslationOptions): UseAutoTranslationResult => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);

  useEffect(() => {
    const performTranslation = async () => {
      // Reset state
      setError(null);
      setIsTranslated(false);

      // If translation is disabled or language is English, use original text
      if (!enabled || i18n.language === 'en' || !text.trim()) {
        setTranslatedText(fallback || text);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const result = await TranslationService.translateText({
          text: text.trim(),
          targetLanguage: i18n.language,
          sourceLanguage: 'en',
          context
        });

        setTranslatedText(result.translatedText);
        setIsTranslated(true);
      } catch (translationError) {
        const errorMessage = translationError instanceof Error 
          ? translationError.message 
          : 'Translation failed';
        
        console.error('Auto-translation error:', errorMessage);
        setError(errorMessage);
        setTranslatedText(fallback || text);
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [text, i18n.language, context, fallback, enabled]);

  return {
    translatedText,
    isLoading,
    error,
    isTranslated
  };
};

/**
 * Hook for batch translation of multiple texts
 */
export const useBatchTranslation = (
  texts: string[],
  context?: string,
  enabled = true
): {
  translatedTexts: string[];
  isLoading: boolean;
  error: string | null;
} => {
  const { i18n } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performBatchTranslation = async () => {
      if (!enabled || i18n.language === 'en' || texts.length === 0) {
        setTranslatedTexts(texts);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await TranslationService.translateBatch(
          texts,
          i18n.language,
          'en',
          context
        );

        const translated = results.map(result => result.translatedText);
        setTranslatedTexts(translated);
      } catch (translationError) {
        const errorMessage = translationError instanceof Error 
          ? translationError.message 
          : 'Batch translation failed';
        
        console.error('Batch translation error:', errorMessage);
        setError(errorMessage);
        setTranslatedTexts(texts); // Fallback to original texts
      } finally {
        setIsLoading(false);
      }
    };

    performBatchTranslation();
  }, [texts, i18n.language, context, enabled]);

  return {
    translatedTexts,
    isLoading,
    error
  };
};