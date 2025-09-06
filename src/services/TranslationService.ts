import { supabase } from '@/integrations/supabase/client';

export interface TranslationOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  context?: string;
}

export interface TranslationResult {
  translatedText: string;
  cached: boolean;
  sourceLanguage?: string;
  targetLanguage: string;
}

export class TranslationService {
  private static translationCache = new Map<string, string>();

  /**
   * Translate text using AI translation service
   */
  static async translateText(options: TranslationOptions): Promise<TranslationResult> {
    const { text, targetLanguage, sourceLanguage = 'en', context } = options;
    
    // Check local cache first
    const cacheKey = `${text}-${targetLanguage}`;
    const cachedResult = this.translationCache.get(cacheKey);
    if (cachedResult) {
      return {
        translatedText: cachedResult,
        cached: true,
        sourceLanguage,
        targetLanguage
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          text,
          targetLanguage,
          sourceLanguage,
          context
        }
      });

      if (error) {
        console.error('Translation service error:', error);
        return {
          translatedText: text, // Fallback to original text
          cached: false,
          sourceLanguage,
          targetLanguage
        };
      }

      const result = data as TranslationResult;
      
      // Cache the result locally
      this.translationCache.set(cacheKey, result.translatedText);
      
      return result;

    } catch (error) {
      console.error('Translation request failed:', error);
      return {
        translatedText: text, // Fallback to original text
        cached: false,
        sourceLanguage,
        targetLanguage
      };
    }
  }

  /**
   * Batch translate multiple texts
   */
  static async translateBatch(
    texts: string[], 
    targetLanguage: string, 
    sourceLanguage = 'en',
    context?: string
  ): Promise<TranslationResult[]> {
    const results = await Promise.all(
      texts.map(text => 
        this.translateText({ text, targetLanguage, sourceLanguage, context })
      )
    );
    
    return results;
  }

  /**
   * Check if a language is supported
   */
  static isSupportedLanguage(languageCode: string): boolean {
    const supportedLanguages = ['en', 'ar', 'ru', 'de'];
    return supportedLanguages.includes(languageCode);
  }

  /**
   * Get language direction (LTR or RTL)
   */
  static getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
  }

  /**
   * Clear translation cache
   */
  static clearCache(): void {
    this.translationCache.clear();
  }

  /**
   * Preload translations for common UI elements
   */
  static async preloadCommonTranslations(targetLanguage: string): Promise<void> {
    if (targetLanguage === 'en') return; // No need to translate English to English

    const commonTexts = [
      'Home',
      'About',
      'Contact',
      'Blog',
      'Login',
      'Sign Up',
      'Loading...',
      'Error',
      'Success',
      'Cancel',
      'Save',
      'Delete',
      'Edit'
    ];

    try {
      await this.translateBatch(commonTexts, targetLanguage, 'en', 'Common UI elements');
      console.log(`Preloaded ${commonTexts.length} common translations for ${targetLanguage}`);
    } catch (error) {
      console.error('Failed to preload common translations:', error);
    }
  }
}