import { supabase } from '@/integrations/supabase/client';
import { TranslationService } from './TranslationService';

export interface PageTranslationOptions {
  pageKey: string;
  pageType: 'page_content' | 'blog_posts' | 'fasting_timeline_posts' | 'system_motivators' | 'faqs';
  recordId: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslatableContent {
  title?: string;
  content?: string;
  excerpt?: string;
  meta_description?: string;
  question?: string;
  answer?: string;
}

export class PageTranslationService {
  /**
   * Detect and extract translatable content from a page
   */
  static async detectPageContent(pageKey: string, pageType: string): Promise<{
    recordId: string;
    content: TranslatableContent;
  } | null> {
    try {
      let query;
      let data;
      let error;

      switch (pageType) {
        case 'page_content':
          ({ data, error } = await supabase
            .from('page_content')
            .select('id, title, content, meta_description')
            .eq('page_key', pageKey)
            .single());
          break;
        
        case 'blog_posts':
          ({ data, error } = await supabase
            .from('blog_posts')
            .select('id, title, content, excerpt, meta_description')
            .eq('slug', pageKey)
            .single());
          break;
        
        case 'system_motivators':
          ({ data, error } = await supabase
            .from('system_motivators')
            .select('id, title, content')
            .eq('slug', pageKey)
            .single());
          break;

        default:
          return null;
      }

      if (error || !data) {
        console.error('Error detecting page content:', error);
        return null;
      }

      return {
        recordId: data.id,
        content: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          meta_description: data.meta_description,
          question: data.question,
          answer: data.answer
        }
      };
    } catch (error) {
      console.error('Error in detectPageContent:', error);
      return null;
    }
  }

  /**
   * Translate page content and save to database
   */
  static async translatePageContent(options: PageTranslationOptions): Promise<boolean> {
    const { pageType, recordId, targetLanguage, sourceLanguage = 'en' } = options;

    try {
      // First get the original content
      let originalData;
      let error;

      switch (pageType) {
        case 'page_content':
          ({ data: originalData, error } = await supabase
            .from('page_content')
            .select('title, content, meta_description')
            .eq('id', recordId)
            .single());
          break;
        
        case 'blog_posts':
          ({ data: originalData, error } = await supabase
            .from('blog_posts')
            .select('title, content, excerpt, meta_description')
            .eq('id', recordId)
            .single());
          break;
        
        case 'system_motivators':
          ({ data: originalData, error } = await supabase
            .from('system_motivators')
            .select('title, content')
            .eq('id', recordId)
            .single());
          break;

        case 'faqs':
          ({ data: originalData, error } = await supabase
            .from('faqs')
            .select('question, answer')
            .eq('id', recordId)
            .single());
          break;

        default:
          return false;
      }

      if (error || !originalData) {
        console.error('Error fetching original content:', error);
        return false;
      }

      // Translate the content fields
      const translations: Record<string, string> = {};
      const fieldsToTranslate = Object.keys(originalData).filter(key => 
        originalData[key] && typeof originalData[key] === 'string'
      );

      for (const field of fieldsToTranslate) {
        const result = await TranslationService.translateText({
          text: originalData[field],
          targetLanguage,
          sourceLanguage,
          context: `Website ${pageType} ${field}`
        });
        translations[`${field}_${targetLanguage}`] = result.translatedText;

        // Track translation status
        await this.updateTranslationStatus({
          tableName: pageType,
          recordId,
          languageCode: targetLanguage,
          fieldName: field,
          status: 'completed'
        });
      }

      // Save translations to database
      const { error: updateError } = await supabase
        .from(pageType)
        .update(translations)
        .eq('id', recordId);

      if (updateError) {
        console.error('Error saving translations:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in translatePageContent:', error);
      return false;
    }
  }

  /**
   * Update translation status tracking
   */
  private static async updateTranslationStatus(params: {
    tableName: string;
    recordId: string;
    languageCode: string;
    fieldName: string;
    status: string;
  }) {
    const { tableName, recordId, languageCode, fieldName, status } = params;

    await supabase
      .from('translation_status')
      .upsert({
        table_name: tableName,
        record_id: recordId,
        language_code: languageCode,
        field_name: fieldName,
        translation_status: status,
        translated_at: status === 'completed' ? new Date().toISOString() : null
      }, {
        onConflict: 'table_name,record_id,language_code,field_name'
      });
  }

  /**
   * Get translation status for a page
   */
  static async getTranslationStatus(
    tableName: string, 
    recordId: string, 
    languageCode: string
  ): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('translation_status')
      .select('field_name, translation_status')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .eq('language_code', languageCode);

    if (error) {
      console.error('Error fetching translation status:', error);
      return {};
    }

    return data.reduce((acc, item) => {
      acc[item.field_name] = item.translation_status;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Batch translate multiple records
   */
  static async batchTranslateContent(
    pageType: string,
    recordIds: string[],
    targetLanguage: string,
    sourceLanguage = 'en'
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    for (const recordId of recordIds) {
      try {
        const success = await this.translatePageContent({
          pageKey: '', // Not used in this context
          pageType: pageType as any,
          recordId,
          targetLanguage,
          sourceLanguage
        });

        if (success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Failed to translate record ${recordId}:`, error);
        failed++;
      }
    }

    return { successful, failed };
  }
}