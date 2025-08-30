import { SiteSettingsService } from './SiteSettingsService';

export interface BlogTypographySettings {
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  h1FontSize: number;
  h2FontSize: number;
  h3FontSize: number;
  lineHeight: number;
  letterSpacing: number;
  paragraphSpacing: number;
}

export class BlogTypographyService {
  private static readonly defaultSettings: BlogTypographySettings = {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    baseFontSize: 16,
    h1FontSize: 32,
    h2FontSize: 24,
    h3FontSize: 20,
    lineHeight: 1.6,
    letterSpacing: 0,
    paragraphSpacing: 16
  };

  static async getSettings(): Promise<BlogTypographySettings> {
    try {
      const settings = await SiteSettingsService.getSetting('blog_typography');
      if (settings && typeof settings === 'object') {
        return { ...this.defaultSettings, ...settings };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('Error loading blog typography settings:', error);
      return this.defaultSettings;
    }
  }

  static async saveSettings(settings: BlogTypographySettings): Promise<boolean> {
    try {
      return await SiteSettingsService.setSetting('blog_typography', settings);
    } catch (error) {
      console.error('Error saving blog typography settings:', error);
      return false;
    }
  }

  static applyTypographyToBlogContent() {
    this.getSettings().then(settings => {
      const root = document.documentElement;
      
      // Apply CSS custom properties for blog content
      root.style.setProperty('--blog-font-family', settings.fontFamily);
      root.style.setProperty('--blog-heading-font-family', settings.headingFontFamily);
      root.style.setProperty('--blog-base-font-size', `${settings.baseFontSize}px`);
      root.style.setProperty('--blog-h1-font-size', `${settings.h1FontSize}px`);
      root.style.setProperty('--blog-h2-font-size', `${settings.h2FontSize}px`);
      root.style.setProperty('--blog-h3-font-size', `${settings.h3FontSize}px`);
      root.style.setProperty('--blog-line-height', settings.lineHeight.toString());
      root.style.setProperty('--blog-letter-spacing', `${settings.letterSpacing}px`);
      root.style.setProperty('--blog-paragraph-spacing', `${settings.paragraphSpacing}px`);

      // Inject CSS for blog content styling
      this.injectBlogStyles();
    });
  }

  private static injectBlogStyles() {
    const existingStyle = document.getElementById('blog-typography-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'blog-typography-styles';
    style.textContent = `
      /* Blog content typography */
      .blog-content {
        font-family: var(--blog-font-family);
        font-size: var(--blog-base-font-size);
        line-height: var(--blog-line-height);
        letter-spacing: var(--blog-letter-spacing);
      }

      .blog-content h1 {
        font-family: var(--blog-heading-font-family);
        font-size: var(--blog-h1-font-size);
        margin-bottom: var(--blog-paragraph-spacing);
        font-weight: bold;
      }

      .blog-content h2 {
        font-family: var(--blog-heading-font-family);
        font-size: var(--blog-h2-font-size);
        margin-bottom: var(--blog-paragraph-spacing);
        font-weight: 600;
      }

      .blog-content h3 {
        font-family: var(--blog-heading-font-family);
        font-size: var(--blog-h3-font-size);
        margin-bottom: var(--blog-paragraph-spacing);
        font-weight: 600;
      }

      .blog-content p {
        margin-bottom: var(--blog-paragraph-spacing);
      }

      .blog-content ul, .blog-content ol {
        margin-bottom: var(--blog-paragraph-spacing);
      }

      .blog-content blockquote {
        margin-bottom: var(--blog-paragraph-spacing);
        padding-left: 1rem;
        border-left: 3px solid hsl(var(--primary));
        font-style: italic;
      }

      /* Apply to react-markdown content */
      .prose h1 {
        font-family: var(--blog-heading-font-family) !important;
        font-size: var(--blog-h1-font-size) !important;
      }

      .prose h2 {
        font-family: var(--blog-heading-font-family) !important;
        font-size: var(--blog-h2-font-size) !important;
      }

      .prose h3 {
        font-family: var(--blog-heading-font-family) !important;
        font-size: var(--blog-h3-font-size) !important;
      }

      .prose p {
        font-family: var(--blog-font-family) !important;
        font-size: var(--blog-base-font-size) !important;
        line-height: var(--blog-line-height) !important;
        letter-spacing: var(--blog-letter-spacing) !important;
      }
    `;

    document.head.appendChild(style);
  }
}