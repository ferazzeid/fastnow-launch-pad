import { BlogPost } from '@/types/blog';

export class BlogService {
  private static STORAGE_KEY = 'fastingApp_blogPosts';

  static getAllPosts(): BlogPost[] {
    try {
      const posts = localStorage.getItem(this.STORAGE_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  static getPostById(id: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  static getPostBySlug(slug: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  }

  static savePost(post: BlogPost): void {
    const posts = this.getAllPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      posts.unshift(post);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    
    // Auto-export to JSON after saving
    this.exportToApi();
  }

  static deletePost(id: string): void {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPosts));
    
    // Auto-export to JSON after deleting
    this.exportToApi();
  }

  private static async exportToApi(): Promise<void> {
    // Dynamic import to avoid circular dependency
    const { BlogApiService } = await import('./BlogApiService');
    BlogApiService.exportToJson();
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static createSamplePosts(): void {
    const samplePosts: BlogPost[] = [
      {
        id: this.generateId(),
        title: 'Getting Started with Intermittent Fasting',
        slug: 'getting-started-with-intermittent-fasting',
        content: `# Getting Started with Intermittent Fasting

Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It's not about what foods to eat, but rather when you should eat them.

## Popular Intermittent Fasting Methods

### 16:8 Method
The 16:8 method involves fasting for 16 hours and eating during an 8-hour window. This is one of the most popular and sustainable forms of intermittent fasting.

### 5:2 Diet
The 5:2 diet involves eating normally for 5 days and restricting calories to 500-600 for 2 non-consecutive days.

## Benefits of Intermittent Fasting

- **Weight Loss**: IF can help reduce calorie intake and boost metabolism
- **Improved Insulin Sensitivity**: May help reduce insulin resistance
- **Brain Health**: Some studies suggest IF may improve brain function
- **Longevity**: Animal studies show IF may extend lifespan

## Getting Started

1. **Choose Your Method**: Start with the 16:8 method as it's easiest for beginners
2. **Stay Hydrated**: Drink plenty of water during fasting periods
3. **Listen to Your Body**: If you feel unwell, consider breaking your fast
4. **Be Patient**: It may take time for your body to adapt

Remember to consult with a healthcare provider before starting any new diet regimen.`,
        excerpt: 'Learn the basics of intermittent fasting and how to get started with this popular eating pattern for better health and weight management.',
        featuredImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
        author: 'FastNow Team',
        categories: ['Beginner Guide', 'Health'],
        tags: ['intermittent-fasting', 'weight-loss', 'health', 'beginner'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        metaDescription: 'Complete beginner guide to intermittent fasting - learn methods, benefits, and how to get started safely.',
      },
      {
        id: this.generateId(),
        title: 'Common Intermittent Fasting Mistakes to Avoid',
        slug: 'common-intermittent-fasting-mistakes-to-avoid',
        content: `# Common Intermittent Fasting Mistakes to Avoid

While intermittent fasting can be incredibly beneficial, there are several common mistakes that can hinder your progress or even be harmful to your health.

## Mistake #1: Jumping in Too Fast

Many beginners try to fast for 16-20 hours right away. This can lead to:
- Extreme hunger
- Low energy
- Difficulty sticking to the plan

**Solution**: Start gradually with 12-hour fasts and slowly increase.

## Mistake #2: Not Drinking Enough Water

Dehydration during fasting can cause:
- Headaches
- Fatigue
- Difficulty concentrating

**Solution**: Aim for at least 8 glasses of water during your fasting window.

## Mistake #3: Overeating During Eating Windows

Some people compensate for fasting by overeating, which can:
- Negate weight loss benefits
- Cause digestive issues
- Lead to energy crashes

**Solution**: Focus on nutrient-dense, balanced meals.

## Mistake #4: Ignoring Your Body's Signals

Signs you should break your fast:
- Severe dizziness
- Extreme fatigue
- Nausea
- Chest pain

**Remember**: Intermittent fasting should enhance your life, not make you miserable.`,
        excerpt: 'Avoid these common intermittent fasting mistakes that could derail your progress and learn how to fast safely and effectively.',
        featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        author: 'Dr. Sarah Johnson',
        categories: ['Tips', 'Health'],
        tags: ['mistakes', 'tips', 'safety', 'beginner'],
        status: 'published',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        metaDescription: 'Learn about common intermittent fasting mistakes and how to avoid them for better results.',
      }
    ];

    // Only create sample posts if none exist
    const existingPosts = this.getAllPosts();
    if (existingPosts.length === 0) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samplePosts));
      // Export initial data to API
      this.exportToApi();
    }
  }
}
