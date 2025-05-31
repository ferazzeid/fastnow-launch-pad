
import { FastingTimelinePost } from '@/types/fastingTimeline';

export class FastingTimelineService {
  private static STORAGE_KEY = 'fastingApp_fastingTimelinePosts';

  static getAllPosts(): FastingTimelinePost[] {
    try {
      const posts = localStorage.getItem(this.STORAGE_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error loading fasting timeline posts:', error);
      return [];
    }
  }

  static getPostById(id: string): FastingTimelinePost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === id) || null;
  }

  static getPostByHour(hour: number): FastingTimelinePost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.hour === hour) || null;
  }

  static getPostBySlug(slug: string): FastingTimelinePost | null {
    const posts = this.getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  }

  static savePost(post: FastingTimelinePost): void {
    const posts = this.getAllPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      posts.push(post);
    }
    
    // Sort by hour
    posts.sort((a, b) => a.hour - b.hour);
    
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
    const { FastingTimelineApiService } = await import('./FastingTimelineApiService');
    FastingTimelineApiService.exportToJson();
  }

  static generateSlug(title: string, hour: number): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `hour-${hour}-${baseSlug}`;
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static createInitialPosts(): void {
    const existingPosts = this.getAllPosts();
    if (existingPosts.length > 0) return;

    const initialPosts: FastingTimelinePost[] = [];
    
    for (let hour = 0; hour <= 96; hour++) {
      const now = new Date().toISOString();
      const title = hour === 0 ? 'Starting Your Fast - Hour 0' : `Fasting Hour ${hour}`;
      
      const post: FastingTimelinePost = {
        id: this.generateId(),
        hour,
        title,
        slug: this.generateSlug(title, hour),
        content: `# ${title}\n\nThis is hour ${hour} of your fasting journey.\n\n## What's Happening\n\nContent about what's happening in your body during hour ${hour}.\n\n## How You Might Feel\n\nDescribe the typical feelings and experiences during hour ${hour}.`,
        excerpt: `Discover what happens during hour ${hour} of your fasting journey.`,
        featuredImage: '',
        author: 'FastNow Team',
        categories: hour <= 16 ? ['Beginner'] : hour <= 24 ? ['Intermediate'] : hour <= 48 ? ['Advanced'] : ['Extended'],
        tags: ['fasting', `hour-${hour}`, 'timeline'],
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        metaDescription: `Learn about hour ${hour} of fasting - what happens in your body and how you might feel.`,
        whatsHappening: '',
        howYoureFeeling: ''
      };
      
      initialPosts.push(post);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialPosts));
    this.exportToApi();
  }
}
