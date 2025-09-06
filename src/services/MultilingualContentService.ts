import { supabase } from '@/integrations/supabase/client';

export interface MultilingualContent {
  title?: string;
  content?: string;
  excerpt?: string;
  meta_description?: string;
  question?: string;
  answer?: string;
}

export class MultilingualContentService {
  /**
   * Get content in the specified language, falling back to English
   */
  static getLocalizedContent(
    originalContent: any,
    languageCode: string
  ): MultilingualContent {
    if (languageCode === 'en' || !originalContent) {
      return originalContent;
    }

    const localizedContent: MultilingualContent = {};

    // Map fields to their localized versions
    const fieldMappings = {
      title: `title_${languageCode}`,
      content: `content_${languageCode}`,
      excerpt: `excerpt_${languageCode}`,
      meta_description: `meta_description_${languageCode}`,
      question: `question_${languageCode}`,
      answer: `answer_${languageCode}`
    };

    // Use localized version if available, otherwise fall back to original
    Object.entries(fieldMappings).forEach(([originalField, localizedField]) => {
      localizedContent[originalField as keyof MultilingualContent] = 
        originalContent[localizedField] || originalContent[originalField];
    });

    return localizedContent;
  }

  /**
   * Get page content with localization
   */
  static async getLocalizedPageContent(
    pageKey: string,
    languageCode: string
  ): Promise<MultilingualContent | null> {
    const { data, error } = await supabase
      .from('page_content')
      .select(`
        title, content, meta_description,
        title_ar, content_ar, meta_description_ar,
        title_ru, content_ru, meta_description_ru,
        title_de, content_de, meta_description_de
      `)
      .eq('page_key', pageKey)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return null;
    }

    return this.getLocalizedContent(data, languageCode);
  }

  /**
   * Get blog post with localization
   */
  static async getLocalizedBlogPost(
    slug: string,
    languageCode: string
  ): Promise<MultilingualContent | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        title, content, excerpt, meta_description,
        title_ar, content_ar, excerpt_ar, meta_description_ar,
        title_ru, content_ru, excerpt_ru, meta_description_ru,
        title_de, content_de, excerpt_de, meta_description_de
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return null;
    }

    return this.getLocalizedContent(data, languageCode);
  }

  /**
   * Get system motivator with localization
   */
  static async getLocalizedMotivator(
    slug: string,
    languageCode: string
  ): Promise<MultilingualContent | null> {
    const { data, error } = await supabase
      .from('system_motivators')
      .select(`
        title, content,
        title_ar, content_ar,
        title_ru, content_ru,
        title_de, content_de
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return this.getLocalizedContent(data, languageCode);
  }

  /**
   * Get FAQs with localization
   */
  static async getLocalizedFAQs(
    languageCode: string,
    pageCategory?: string
  ): Promise<MultilingualContent[]> {
    let query = supabase
      .from('faqs')
      .select(`
        id, question, answer, display_order, image_url, image_alignment,
        question_ar, answer_ar,
        question_ru, answer_ru,
        question_de, answer_de
      `)
      .eq('is_active', true);

    if (pageCategory) {
      query = query.eq('page_category', pageCategory);
    }

    const { data, error } = await query.order('display_order');

    if (error || !data) {
      return [];
    }

    return data.map(faq => ({
      ...faq,
      ...this.getLocalizedContent(faq, languageCode)
    }));
  }

  /**
   * Get fasting timeline posts with localization
   */
  static async getLocalizedTimelinePosts(
    languageCode: string
  ): Promise<MultilingualContent[]> {
    const { data, error } = await supabase
      .from('fasting_timeline_posts')
      .select(`
        id, hour, title, content, excerpt,
        title_ar, content_ar, excerpt_ar,
        title_ru, content_ru, excerpt_ru,
        title_de, content_de, excerpt_de
      `)
      .eq('status', 'published')
      .order('hour');

    if (error || !data) {
      return [];
    }

    return data.map(post => ({
      ...post,
      ...this.getLocalizedContent(post, languageCode)
    }));
  }

  /**
   * Check if content has translations for a specific language
   */
  static hasTranslation(content: any, languageCode: string, field: string): boolean {
    if (languageCode === 'en') return true;
    const translatedField = `${field}_${languageCode}`;
    return !!(content[translatedField] && content[translatedField].trim());
  }

  /**
   * Get translation completeness for a record
   */
  static getTranslationCompleteness(
    content: any,
    languageCode: string,
    fields: string[]
  ): { completed: number; total: number; percentage: number } {
    if (languageCode === 'en') {
      return { completed: fields.length, total: fields.length, percentage: 100 };
    }

    const completed = fields.filter(field => 
      this.hasTranslation(content, languageCode, field)
    ).length;

    return {
      completed,
      total: fields.length,
      percentage: Math.round((completed / fields.length) * 100)
    };
  }
}