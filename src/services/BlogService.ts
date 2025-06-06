
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
      },
      {
        id: '4',
        title: 'The Mental Negotiation: Why Starting Your Fast is the Hardest Part',
        slug: 'mental-negotiation-starting-fast-hardest-part',
        content: `# The Mental Negotiation: Why Starting Your Fast is the Hardest Part

You wake up after a good night's sleep, and you realize you're already 8, 9, maybe even 10 hours into what could become a fast. There's this moment of opportunity – you're already deep into it, so why not continue? But then the negotiation begins.

## The Head Start Advantage

Starting a fast after a good night's sleep is one of the most strategic moves you can make. You've already completed the hardest part without even thinking about it. Your body has naturally entered a fasted state, your glucose levels have stabilized, and you're primed to continue.

This head start feels like a gift. You're not starting from zero – you're already deep into the process. It makes the entire endeavor seem more achievable, more within reach.

## The Internal Debate Begins

But here's where it gets complicated. Despite having this natural advantage, your mind starts the negotiation:

- *Should I start today, or would tomorrow be better?*
- *Maybe I should just do intermittent fasting instead of a full fast?*
- *Is this really the right time?*
- *Should it be a water fast, or can I have some flexibility?*

### The Questions That Hold Us Back

The negotiation is different for everyone, but these internal questions are surprisingly universal:

**Timing Questions:**
- "Is today really the best day to start?"
- "Maybe I should wait until Monday/after the weekend/next week?"
- "What if something comes up?"

**Method Questions:**
- "Should I go for a full water fast or just extend my intermittent fasting window?"
- "Maybe I should start with something easier?"
- "What if I can't handle it?"

**Readiness Questions:**
- "Am I mentally prepared for this?"
- "Do I have everything I need?"
- "Have I planned this well enough?"

## The Getting Ready Phase

For many people, this negotiation isn't a barrier – it's actually part of the process. It's the "getting ready" phase, where you:

- Immerse yourself in fasting content
- Research different methods
- Plan your approach
- Build mental preparedness
- Connect with the fasting community

This phase serves a purpose. It's your mind's way of preparing for the challenge ahead. Some people need hours of this negotiation, others need days or even weeks.

## The Disappointment Factor

But there's also a darker side to this negotiation. When you find yourself stuck in this loop repeatedly, it can lead to disappointment. You know you want to fast, you know the benefits, you have the perfect setup with your morning head start, but you just... don't start.

This can create a cycle:
1. Perfect opportunity presents itself
2. Negotiation begins
3. Decision gets postponed
4. Opportunity passes
5. Disappointment sets in
6. Promise to "definitely start tomorrow"

## The Second-Round Challenge

Here's where it gets even trickier – when you've already been successful with fasting before. You've experienced the benefits, you've proven to yourself that you can do it, but now you're facing a second round.

### Used-Up Motivators

The challenge with subsequent fasting attempts is that you've already "used up" some of your biggest motivators:

- The curiosity about whether you can do it? Already answered.
- The excitement of trying something new? Not so new anymore.
- The dramatic initial results? You know they might be less dramatic this time.

### The Motivation Dilemma

This creates a unique psychological challenge. You know fasting works, but you're not sure if you can recreate the same level of motivation that got you through the first time. You wonder:

- Can I reuse my original motivators?
- Will I have the same willpower this time?
- Is it worth going through the process again?

## Different People, Different Negotiations

The negotiation process varies dramatically between individuals:

**The Immediate Starters:** Some people move quickly from thought to action. They've done the mental work beforehand, and when the moment comes, they're ready.

**The Planners:** Others need extensive preparation. They research, plan, and negotiate for days or weeks before starting.

**The Cyclers:** Some people go through this negotiation repeatedly, sometimes successfully starting, sometimes not.

**The Perfectionist Waiters:** These individuals are always waiting for the "perfect" moment that rarely comes.

## Breaking Through the Negotiation

Understanding that this mental negotiation is normal – and even healthy to some extent – can be liberating. Here are strategies that help:

### 1. Set a Negotiation Deadline
Give yourself a specific timeframe for the internal debate. "I'll think about this for 30 minutes, then I decide."

### 2. Embrace the Imperfect Start
You don't need perfect conditions. Sometimes the best fast is the one you start despite the circumstances.

### 3. Lower the Stakes
Instead of committing to a long fast, commit to just continuing your current fasted state for a few more hours.

### 4. Find New Motivators
If you're on a second or third round, identify fresh reasons for fasting that are relevant to your current situation.

### 5. Accept the Process
Sometimes the negotiation is part of your journey. Don't fight it – use it as preparation time.

## The Beauty of Starting Anyway

Here's what many people discover: the negotiation is often harder than the actual fast. Once you make the decision and commit, much of the mental struggle disappears. Your body often cooperates better than your mind anticipated.

The morning head start you woke up with? It's still there waiting for you, regardless of how long you negotiate. The question isn't whether you're ready – it's whether you're willing to find out what happens when you just begin.

Remember, every successful fast started with someone ending the negotiation and making a choice. The negotiation serves its purpose, but at some point, the most powerful thing you can do is simply start.`,
        excerpt: 'Explore the complex mental negotiation that happens when starting a fast, why the internal debate can be tougher than the fast itself, and strategies for moving from thinking to doing.',
        featuredImage: '/placeholder.svg',
        author: 'FastNow Team',
        categories: ['Psychology', 'Mental Challenges', 'Getting Started'],
        tags: ['mental-negotiation', 'starting-fast', 'psychology', 'motivation', 'decision-making', 'mindset'],
        status: 'published',
        createdAt: '2024-06-06T16:00:00Z',
        updatedAt: '2024-06-06T16:00:00Z',
        publishedAt: '2024-06-06T16:00:00Z',
        metaDescription: 'Understanding the mental negotiation process when starting a fast and why making the decision to begin is often harder than the fast itself.',
        metaKeywords: 'fasting psychology, mental negotiation, starting fast, fasting motivation, decision making'
      },
      {
        id: '5',
        title: 'The Mysterious Overnight Breakthrough: Understanding Non-Linear Weight Loss',
        slug: 'mysterious-overnight-breakthrough-nonlinear-weight-loss',
        content: `# The Mysterious Overnight Breakthrough: Understanding Non-Linear Weight Loss

Three weeks into your weight loss journey, you've been diligently maintaining a calorie deficit. You've renegotiated and reduced your calorie intake multiple times. Then, on one seemingly ordinary day, something extraordinary happens – you wake up feeling significantly lighter, fitting into clothes better, as if weight loss happened overnight.

*I want to be clear upfront: I don't claim to know exactly how all of this works. What I'm sharing is my personal experience and observations about the puzzling, non-linear nature of weight loss.*

## The Initial Drop and the Plateau

Most weight loss journeys start with a promising initial drop. You lose several pounds in the first week or two, and you think "this is working perfectly!" But then comes the stall. The scale seems frozen, your clothes fit the same, and you start questioning everything.

This pattern is incredibly common, and much of that initial loss is likely water weight. Your body releases stored water as glycogen stores deplete, creating that encouraging early progress. But then reality sets in – the slower, more complex process of actual fat loss.

## The Unexpected Breakthrough

Here's where it gets interesting. After weeks of apparent stagnation, sometimes after what you might even consider a "failure day," you experience a sudden breakthrough. For me, this happened around week three.

### My Breakthrough Day

The day before my breakthrough, I had what I initially thought was a setback. I ended up eating more than planned – not enough to break my daily calorie budget entirely, but significantly more than my usual 1500-1700 calories. I had chicken and feta cheese (both on my allowed foods list), plus lots of cucumbers, but together they pushed me up to about 1200 calories for that single meal. This was after I had already increased my intake from 1200 to 1500-1700 calories in the second week.

I also had some Panadol for headaches that appeared out of nowhere, spent more time in the sun, moved around more, and spent more time on my feet instead of sitting in a chair.

### The Morning After

The next morning, something felt different. I woke up with a significant feeling of having lost weight. I don't know if it was water weight, actual fat loss, or something else entirely, but it was unmistakable. Clothes that had been tight the day before suddenly fit better. It was literally like an overnight transformation.

## The Science (Or Lack Thereof) Behind the Mystery

I won't pretend to understand the exact mechanisms at play here. Weight loss, particularly fat loss, is far more complex than the simple "calories in, calories out" equation suggests. There are hormonal factors, water retention fluctuations, digestive timing, and metabolic adaptations that all play roles.

What I do know is that this experience isn't unique to me. Many people report similar "whoosh" effects – periods of stagnation followed by sudden, noticeable progress.

### Possible Contributing Factors

Looking back at my breakthrough day, several factors might have contributed:

- **Increased activity**: More time on my feet, moving around
- **Sun exposure**: Could have affected hormones or water retention
- **Different food timing**: A larger meal after smaller ones
- **Hydration changes**: The cucumbers provided extra water and fiber
- **Natural body cycles**: Sometimes our bodies just "catch up"

## The Motivation Boost

This breakthrough came at a crucial time – right when I was starting to doubt the process. After weeks of apparent stagnation, this sudden progress provided exactly the motivation boost I needed to continue.

### Why This Matters for Your Journey

If you're currently in a plateau phase, this experience offers several important reminders:

1. **Progress isn't always linear**: Your body doesn't lose weight on a predictable schedule
2. **Patience is crucial**: Sometimes you're making progress even when you can't see it
3. **"Failure" days might not be failures**: That day I ate more than planned preceded my biggest breakthrough
4. **Trust the process**: Even when the scale isn't moving, other changes might be happening

## The Stagnation Before the Movement

There's something profound about the timing of these breakthroughs. They often happen after periods where you feel like nothing is working, where you're questioning your approach, where you might even be considering giving up.

It's as if your body is reorganizing itself during those quiet periods, preparing for the next phase of progress. You're not actually stagnant – you're building up to a breakthrough.

### Mental Preparation for Plateaus

Understanding this pattern can help you mentally prepare for the inevitable plateaus:

- **Expect them**: Plateaus are normal, not a sign of failure
- **Stay consistent**: Keep following your plan even when you don't see immediate results
- **Look for other signs**: Energy levels, how clothes fit, overall well-being
- **Trust the timeline**: Your body has its own schedule for releasing weight

## The Overnight Feeling

There's something uniquely motivating about waking up and immediately feeling different. It's not just about the number on the scale – it's a whole-body sense that something has shifted. Your clothes fit differently, you move differently, you feel differently.

This feeling is incredibly powerful because it's tangible proof that your efforts are working, even when the progress seems invisible day-to-day.

## Moving Forward After a Breakthrough

Experiencing one of these overnight breakthroughs can be both exciting and confusing. You might wonder:

- Will this continue?
- What exactly caused it?
- How can I make it happen again?

The truth is, you probably can't force these moments. They seem to happen when your body is ready, often after periods of consistent effort that might not show immediate results.

## The Bigger Picture

Weight loss is rarely the smooth, predictable process we expect it to be. It's full of stalls, whooshes, fluctuations, and surprises. Understanding this can help you:

- Stay motivated during plateau periods
- Not get discouraged by temporary stalls
- Celebrate breakthroughs when they happen
- Trust that consistency will eventually pay off

## Final Thoughts

I share this experience not because I have all the answers about how weight loss works, but because I know how powerful it can be to hear that others have experienced similar mysterious breakthroughs.

If you're currently in a plateau phase, feeling frustrated by apparent lack of progress, remember that your breakthrough might be just around the corner. Sometimes you need to be stagnant before you can move forward – and when you do, it might happen all at once, overnight, in ways that surprise and motivate you.

The key is to keep going, even when you can't see the progress happening. Your body might be preparing for its own overnight breakthrough, and you don't want to give up just before it arrives.`,
        excerpt: 'Explore the mysterious nature of non-linear weight loss and why sometimes the biggest breakthroughs happen overnight, often after what feels like weeks of stagnation.',
        featuredImage: '/placeholder.svg',
        author: 'FastNow Team',
        categories: ['Weight Loss', 'Personal Experience', 'Motivation'],
        tags: ['weight-loss', 'plateau', 'breakthrough', 'motivation', 'non-linear', 'water-weight'],
        status: 'published',
        createdAt: '2024-06-06T18:00:00Z',
        updatedAt: '2024-06-06T18:00:00Z',
        publishedAt: '2024-06-06T18:00:00Z',
        metaDescription: 'Understanding the non-linear nature of weight loss and why breakthrough moments often come after periods of apparent stagnation.',
        metaKeywords: 'non-linear weight loss, weight loss plateau, overnight breakthrough, weight loss motivation'
      }
    ];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(samplePosts));
  }
}
