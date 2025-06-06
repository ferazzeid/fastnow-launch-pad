
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

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static savePost(post: BlogPost): void {
    const posts = this.getAllPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
  }

  static deletePost(id: string): void {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPosts));
  }

  static createSamplePosts(): void {
    const existingPosts = this.getAllPosts();
    if (existingPosts.length > 0) return; // Don't create if posts already exist

    const samplePosts: BlogPost[] = [
      {
        id: '1',
        title: 'The Complete Guide to Intermittent Fasting for Beginners',
        slug: 'complete-guide-intermittent-fasting-beginners',
        content: `# The Complete Guide to Intermittent Fasting for Beginners

Intermittent fasting (IF) has become one of the most popular health and fitness trends in recent years. But what exactly is it, and how can you get started safely?

## What is Intermittent Fasting?

Intermittent fasting is an eating pattern that cycles between periods of fasting and eating. It's not about what foods you eat, but rather when you eat them.

## Popular IF Methods

### 16:8 Method
Fast for 16 hours and eat during an 8-hour window. This is the most popular method for beginners.

### 5:2 Diet
Eat normally for 5 days and restrict calories to 500-600 for 2 non-consecutive days.

### Eat-Stop-Eat
24-hour fasts once or twice per week.

## Getting Started

1. Start slowly with a 12:12 schedule
2. Gradually increase your fasting window
3. Stay hydrated during fasting periods
4. Listen to your body

Remember to consult with a healthcare provider before starting any fasting regimen.`,
        excerpt: 'Learn everything you need to know about intermittent fasting, from the basics to getting started safely as a beginner.',
        featuredImage: '/placeholder.svg',
        author: 'FastNow Team',
        categories: ['Beginner Guide', 'Intermittent Fasting'],
        tags: ['fasting', 'beginner', 'health', 'weight-loss'],
        status: 'published',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        publishedAt: '2024-01-15T10:00:00Z',
        metaDescription: 'Complete beginner guide to intermittent fasting with tips, methods, and safety advice.',
        metaKeywords: 'intermittent fasting, beginner guide, weight loss, health'
      },
      {
        id: '2',
        title: 'Rediscovering Your Wardrobe: The Joy of Fitting Into Old Clothes Again',
        slug: 'rediscovering-wardrobe-fitting-old-clothes-fasting',
        content: `# Rediscovering Your Wardrobe: The Joy of Fitting Into Old Clothes Again

There's a moment during your fasting journey that goes beyond the numbers on the scale – it's when you reach into the back of your closet and pull out that piece of clothing you haven't worn in months or even years, and it fits again.

## The Motivating Feeling When It Starts to Work

As your fasting routine begins to show results, you experience something magical. It's not just about the weight loss; it's about the sudden realization that you have choices again. Those clothes hanging in your wardrobe, the ones that seemed like distant memories, suddenly become possibilities.

## A Closet Full of Possibilities

Imagine walking into your bedroom and opening your wardrobe to find that instead of having just a few items that fit comfortably, you now have an entire collection to choose from. That dress you wore to your friend's wedding two years ago? It fits. Those jeans you bought on sale but never got to wear? They're perfect now.

### The Psychology of Choice

Having more clothing options does something profound to your mindset:

- **Renewed confidence**: When you have more choices, you feel more in control
- **Rediscovered style**: You remember pieces you loved but couldn't wear
- **Investment validation**: Those clothes you kept "just in case" finally serve their purpose
- **Future motivation**: Each newly-fitting item becomes proof of your progress

## Finding Your Comfort Zone Again

Here's the beautiful truth: you don't need to reach your "ideal weight" to experience this joy. Even before you're anywhere close to your ultimate goal, you start returning to a comfort zone where you genuinely feel happy about your progress.

### The Ripple Effect

This wardrobe rediscovery creates a powerful psychological boost:

1. **Morning excitement**: Getting dressed becomes enjoyable again
2. **Increased activity**: You're more likely to go out when you feel good in your clothes
3. **Social confidence**: You engage more when you're comfortable with how you look
4. **Momentum building**: Each success motivates you to continue

## A Strong Motivator for Life

Once you've experienced this feeling – the joy of choice, the comfort of fit, the confidence of options – it becomes a powerful motivator that stays with you. It's tangible proof that your efforts are working, and it's something you can experience multiple times as you continue your journey.

### Making It Last

To maximize this motivational boost:

- **Don't rush to donate clothes**: Keep items in various sizes during your journey
- **Try on old favorites regularly**: Make it part of your routine to check your progress
- **Document the moments**: Take photos when you fit into something special again
- **Celebrate these victories**: Each newly-fitting item is worth acknowledging

## The Fun Factor

Perhaps most importantly, this process brings back the fun in getting dressed. Your closet transforms from a source of frustration to a treasure trove of possibilities. You start looking forward to trying different combinations, rediscovering forgotten favorites, and feeling genuinely excited about your appearance.

This isn't vanity – it's about feeling comfortable and confident in your own skin again. It's about the practical joy of having options and the emotional satisfaction of seeing your efforts pay off in a very real, everyday way.

Remember, every piece of clothing that fits again is a milestone worth celebrating. Your wardrobe becomes a visual timeline of your progress, and that's incredibly powerful motivation to keep going.`,
        excerpt: 'Discover the powerful motivation that comes from fitting into old clothes again during your fasting journey – and why this feeling can be a game-changer for your confidence.',
        featuredImage: '/placeholder.svg',
        author: 'FastNow Team',
        categories: ['Motivation', 'Personal Journey'],
        tags: ['motivation', 'confidence', 'wardrobe', 'progress', 'lifestyle'],
        status: 'published',
        createdAt: '2024-06-06T14:30:00Z',
        updatedAt: '2024-06-06T14:30:00Z',
        publishedAt: '2024-06-06T14:30:00Z',
        metaDescription: 'The joy and motivation of fitting into old clothes again during your fasting journey and how it builds lasting confidence.',
        metaKeywords: 'fasting motivation, wardrobe confidence, weight loss journey, fitting into old clothes'
      },
      {
        id: '3',
        title: '5 Common Intermittent Fasting Mistakes to Avoid',
        slug: 'common-intermittent-fasting-mistakes-avoid',
        content: `# 5 Common Intermittent Fasting Mistakes to Avoid

Starting your intermittent fasting journey? Here are the most common mistakes that can derail your progress and how to avoid them.

## 1. Going Too Hard Too Fast

Many beginners jump straight into a 20:4 or OMAD schedule. Start with 12:12 and gradually extend your fasting window.

## 2. Not Staying Hydrated

Water is crucial during fasting periods. Aim for at least 8 glasses of water throughout the day.

## 3. Overeating During Eating Windows

Just because you're fasting doesn't mean you can eat unlimited calories during your eating window.

## 4. Ignoring Sleep Quality

Poor sleep can sabotage your fasting efforts. Aim for 7-9 hours of quality sleep.

## 5. Not Being Patient

Results take time. Give your body at least 2-4 weeks to adapt to the new eating pattern.

Remember, intermittent fasting is a lifestyle change, not a quick fix. Be patient and consistent for the best results.`,
        excerpt: 'Avoid these 5 common intermittent fasting mistakes that could sabotage your progress and learn how to fast effectively.',
        featuredImage: '/placeholder.svg',
        author: 'FastNow Team',
        categories: ['Tips', 'Common Mistakes'],
        tags: ['mistakes', 'tips', 'beginner', 'advice'],
        status: 'published',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        publishedAt: '2024-01-20T14:30:00Z',
        metaDescription: 'Learn about common intermittent fasting mistakes and how to avoid them for better results.',
        metaKeywords: 'intermittent fasting mistakes, fasting tips, avoid mistakes, fasting advice'
      }
    ];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samplePosts));
  }
}
