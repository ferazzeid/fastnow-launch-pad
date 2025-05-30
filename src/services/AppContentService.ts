import { Motivator, FastingHour } from '@/types/app-content';

export class AppContentService {
  private static MOTIVATORS_KEY = 'fastingApp_motivators';
  private static FASTING_HOURS_KEY = 'fastingApp_fastingHours';

  // Motivators Management
  static getAllMotivators(): Motivator[] {
    try {
      const motivators = localStorage.getItem(this.MOTIVATORS_KEY);
      return motivators ? JSON.parse(motivators) : [];
    } catch (error) {
      console.error('Error loading motivators:', error);
      return [];
    }
  }

  static getMotivarorById(id: string): Motivator | null {
    const motivators = this.getAllMotivators();
    return motivators.find(motivator => motivator.id === id) || null;
  }

  static saveMotivator(motivator: Motivator): void {
    const motivators = this.getAllMotivators();
    const existingIndex = motivators.findIndex(m => m.id === motivator.id);
    
    if (existingIndex >= 0) {
      motivators[existingIndex] = { ...motivator, updatedAt: new Date().toISOString() };
    } else {
      motivators.unshift(motivator);
    }
    
    localStorage.setItem(this.MOTIVATORS_KEY, JSON.stringify(motivators));
    this.exportToApi();
  }

  static deleteMotivator(id: string): void {
    const motivators = this.getAllMotivators();
    const filteredMotivators = motivators.filter(motivator => motivator.id !== id);
    localStorage.setItem(this.MOTIVATORS_KEY, JSON.stringify(filteredMotivators));
    this.exportToApi();
  }

  // Fasting Hours Management (New consolidated system)
  static getAllFastingHours(): FastingHour[] {
    try {
      const fastingHours = localStorage.getItem(this.FASTING_HOURS_KEY);
      return fastingHours ? JSON.parse(fastingHours) : this.initializeFastingHours();
    } catch (error) {
      console.error('Error loading fasting hours:', error);
      return this.initializeFastingHours();
    }
  }

  static getFastingHourByHour(hour: number): FastingHour | null {
    const fastingHours = this.getAllFastingHours();
    return fastingHours.find(fh => fh.hour === hour) || null;
  }

  static saveFastingHour(hour: FastingHour): void {
    const allHours = this.getAllFastingHours();
    const existingIndex = allHours.findIndex(h => h.hour === hour.hour);
    
    const updatedHour = { ...hour, updatedAt: new Date().toISOString() };
    
    if (existingIndex >= 0) {
      allHours[existingIndex] = updatedHour;
    } else {
      allHours.push(updatedHour);
      allHours.sort((a, b) => a.hour - b.hour);
    }
    
    localStorage.setItem(this.FASTING_HOURS_KEY, JSON.stringify(allHours));
    this.exportToApi();
  }

  private static initializeFastingHours(): FastingHour[] {
    const fastingHours: FastingHour[] = [];

    // Comprehensive data for specific key hours - matching your provided JSON
    const detailedHoursData: { [key: number]: Partial<FastingHour> } = {
      0: {
        title: "Fast Initiated",
        bodyState: "You've just started your fast. Your body is still processing your last meal and beginning to transition into fasting mode.",
        commonFeelings: ["motivated", "excited", "normal"],
        encouragement: "Great job starting your fast! The first step is always the hardest. Your body is preparing for the amazing journey ahead.",
        motivatorTags: ["motivation", "beginning", "preparation"],
        difficulty: "easy",
        phase: "preparation"
      },
      1: {
        title: "The Beginning",
        bodyState: "Your body is starting to use up stored glucose. Insulin levels begin to drop.",
        commonFeelings: ["normal", "motivated"],
        encouragement: "You're off to a great start! Your body is beginning its natural fasting process.",
        motivatorTags: ["motivation", "beginning"],
        difficulty: "easy",
        phase: "initial"
      },
      4: {
        title: "Glucose Depletion",
        bodyState: "Blood glucose levels are dropping. Your body starts accessing glycogen stores.",
        commonFeelings: ["slight hunger", "normal energy"],
        encouragement: "Your body is efficiently using its stored energy. This is exactly what should happen!",
        motivatorTags: ["science", "progress"],
        difficulty: "easy",
        phase: "initial"
      },
      8: {
        title: "First Hunger Wave",
        bodyState: "Ghrelin (hunger hormone) starts to rise. Your body expects food at usual meal times.",
        commonFeelings: ["hunger", "thinking about food"],
        encouragement: "This hunger is just a signal, not an emergency. It will pass in 30-60 minutes.",
        motivatorTags: ["hunger", "willpower"],
        difficulty: "moderate",
        phase: "initial"
      },
      12: {
        title: "Metabolic Shift",
        bodyState: "Your body is transitioning from glucose to fat burning. Growth hormone starts to increase.",
        commonFeelings: ["mild hunger", "clear thinking"],
        encouragement: "Congratulations! You're entering the fat-burning zone. Your metabolism is shifting beautifully.",
        motivatorTags: ["fat-burning", "progress"],
        difficulty: "moderate",
        phase: "adaptation"
      },
      16: {
        title: "The Hunger Peak",
        bodyState: "Ghrelin levels peak, but your body is becoming more efficient at fat oxidation.",
        commonFeelings: ["strong hunger", "irritability", "food thoughts"],
        encouragement: "This is often the hardest part! You're so close to breaking through. The hunger will subside soon.",
        motivatorTags: ["hunger", "breakthrough", "willpower"],
        difficulty: "hard",
        phase: "adaptation"
      },
      18: {
        title: "Hunger Subsides",
        bodyState: "Ketone production increases. Your brain starts using ketones for fuel more efficiently.",
        commonFeelings: ["reduced hunger", "mental clarity"],
        encouragement: "Amazing! You've pushed through the hardest part. Notice how the hunger is fading?",
        motivatorTags: ["breakthrough", "mental-clarity"],
        difficulty: "moderate",
        phase: "adaptation"
      },
      20: {
        title: "Evening Clarity",
        bodyState: "Autophagy processes are ramping up. Your body is cleaning out damaged cells.",
        commonFeelings: ["mental clarity", "slight energy boost"],
        encouragement: "Your body is now in full repair mode. You're experiencing the benefits of autophagy!",
        motivatorTags: ["autophagy", "repair", "benefits"],
        difficulty: "moderate",
        phase: "adaptation"
      },
      24: {
        title: "One Day Complete",
        bodyState: "Significant ketone production. Growth hormone levels are elevated. Autophagy is active.",
        commonFeelings: ["accomplished", "energized", "minimal hunger"],
        encouragement: "Incredible achievement! You've completed 24 hours and your body is thriving in ketosis.",
        motivatorTags: ["achievement", "ketosis", "milestone"],
        difficulty: "easy",
        phase: "ketosis"
      },
      30: {
        title: "Deep Ketosis",
        bodyState: "Your brain is efficiently using ketones. Mental clarity often peaks during this time.",
        commonFeelings: ["mental clarity", "stable energy", "minimal hunger"],
        encouragement: "You're in the sweet spot! Many people report their best mental performance during this phase.",
        motivatorTags: ["mental-clarity", "peak-performance"],
        difficulty: "easy",
        phase: "ketosis"
      },
      36: {
        title: "Autophagy Peak",
        bodyState: "Autophagy is at its peak. Your body is maximally cleaning and repairing itself.",
        commonFeelings: ["energized", "focused", "light feeling"],
        encouragement: "This is when the magic happens! Your body is performing deep cellular maintenance.",
        motivatorTags: ["autophagy", "repair", "peak-benefits"],
        difficulty: "easy",
        phase: "ketosis"
      },
      42: {
        title: "Sustained Ketosis",
        bodyState: "Stable ketone levels. Your body has fully adapted to using fat for fuel.",
        commonFeelings: ["stable energy", "calm", "minimal appetite"],
        encouragement: "You're a fat-burning machine now! Your body has beautifully adapted to this natural state.",
        motivatorTags: ["adaptation", "fat-burning", "stability"],
        difficulty: "easy",
        phase: "ketosis"
      },
      48: {
        title: "Two Days Strong",
        bodyState: "Maximum autophagy benefits. Stem cell regeneration may be beginning.",
        commonFeelings: ["accomplished", "clear-headed", "peaceful"],
        encouragement: "48 hours is a major milestone! You're accessing some of the deepest benefits of fasting.",
        motivatorTags: ["milestone", "regeneration", "achievement"],
        difficulty: "easy",
        phase: "deep_ketosis"
      },
      60: {
        title: "Extended Benefits",
        bodyState: "Stem cell regeneration is active. Immune system reset may be occurring.",
        commonFeelings: ["energized", "resilient", "mentally sharp"],
        encouragement: "You're in elite territory now! Your body is accessing profound healing mechanisms.",
        motivatorTags: ["elite", "healing", "regeneration"],
        difficulty: "moderate",
        phase: "deep_ketosis"
      },
      72: {
        title: "Three Day Master",
        bodyState: "Maximum stem cell regeneration. Immune system renewal is at its peak.",
        commonFeelings: ["accomplished", "transformed", "powerful"],
        encouragement: "You've achieved something extraordinary! 72 hours unlocks the deepest healing benefits.",
        motivatorTags: ["mastery", "transformation", "elite-achievement"],
        difficulty: "moderate",
        phase: "extended"
      }
    };

    // Create all 96 hours
    for (let hour = 0; hour <= 96; hour++) {
      const day = Math.floor(hour / 24) + 1;
      const detailedData = detailedHoursData[hour];
      
      // If we have detailed data for this hour, use it completely
      if (detailedData) {
        fastingHours.push({
          hour,
          day,
          title: detailedData.title || `Hour ${hour}`,
          bodyState: detailedData.bodyState || "",
          commonFeelings: detailedData.commonFeelings || [],
          encouragement: detailedData.encouragement || "",
          motivatorTags: detailedData.motivatorTags || [],
          difficulty: detailedData.difficulty || "moderate",
          phase: detailedData.phase || (hour <= 4 ? "preparation" : hour <= 12 ? "initial" : hour <= 24 ? "adaptation" : hour <= 48 ? "ketosis" : hour <= 72 ? "deep_ketosis" : "extended"),
          tips: [],
          scientificInfo: "",
          imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&hour=${hour}`,
          symptoms: { positive: [], challenging: [] },
          milestones: { 
            autophagy: hour >= 16, 
            ketosis: hour >= 24, 
            fatBurning: hour >= 12 
          },
          updatedAt: new Date().toISOString()
        });
      } else {
        // For hours without detailed data, create basic structure
        fastingHours.push({
          hour,
          day,
          title: `Hour ${hour}`,
          bodyState: "",
          commonFeelings: [],
          encouragement: "",
          motivatorTags: [],
          difficulty: "moderate",
          phase: hour <= 4 ? "preparation" : hour <= 12 ? "initial" : hour <= 24 ? "adaptation" : hour <= 48 ? "ketosis" : hour <= 72 ? "deep_ketosis" : "extended",
          tips: [],
          scientificInfo: "",
          imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&hour=${hour}`,
          symptoms: { positive: [], challenging: [] },
          milestones: { 
            autophagy: hour >= 16, 
            ketosis: hour >= 24, 
            fatBurning: hour >= 12 
          },
          updatedAt: new Date().toISOString()
        });
      }
    }

    localStorage.setItem(this.FASTING_HOURS_KEY, JSON.stringify(fastingHours));
    return fastingHours;
  }

  // Legacy support methods (for backward compatibility)
  static getAllFastingSlots(): FastingHour[] {
    return this.getAllFastingHours();
  }

  static getFastingSlotByHour(hour: number): FastingHour | null {
    return this.getFastingHourByHour(hour);
  }

  static saveFastingSlot(slot: FastingHour): void {
    this.saveFastingHour(slot);
  }

  // Legacy hourly content methods (now return empty for cleanup)
  static getAllHourlyContent(): any[] {
    return [];
  }

  static getHourlyContentByHour(hour: number): null {
    return null;
  }

  static saveHourlyContent(content: any): void {
    // No-op for legacy compatibility
  }

  // Utility functions
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private static async exportToApi(): Promise<void> {
    try {
      const motivators = this.getAllMotivators();
      const fastingHours = this.getAllFastingHours();
      
      const apiData = {
        motivators,
        fastingHours,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('fastingApp_appContentApi', JSON.stringify(apiData));
      
      // Create the fasting hours API data
      const fastingHoursApiData = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        hours: fastingHours
      };
      
      localStorage.setItem('fastingApp_fastingHoursApi', JSON.stringify(fastingHoursApiData));
      
      // Create the motivators API data
      const motivatorsApiData = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalMotivators: motivators.length,
        predefinedMotivators: motivators
      };
      
      localStorage.setItem('fastingApp_motivatorsApi', JSON.stringify(motivatorsApiData));
      
      console.log('All API data exported successfully');
    } catch (error) {
      console.error('Error exporting API data:', error);
    }
  }

  static getAppContentApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_appContentApi');
      return apiData ? JSON.parse(apiData) : { 
        motivators: this.getAllMotivators(), 
        fastingHours: this.getAllFastingHours(),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading app content API data:', error);
      return { 
        motivators: [], 
        fastingHours: this.initializeFastingHours(),
        lastUpdated: new Date().toISOString()
      };
    }
  }

  static getFastingSlotsApiData(): any {
    return this.getFastingHoursApiData();
  }

  static getFastingHoursApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_fastingHoursApi');
      return apiData ? JSON.parse(apiData) : {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        hours: this.getAllFastingHours()
      };
    } catch (error) {
      console.error('Error loading fasting hours API data:', error);
      return {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        hours: this.initializeFastingHours()
      };
    }
  }

  static getMotivatorsApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_motivatorsApi');
      return apiData ? JSON.parse(apiData) : {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalMotivators: 0,
        predefinedMotivators: this.getAllMotivators()
      };
    } catch (error) {
      console.error('Error loading motivators API data:', error);
      return {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalMotivators: 0,
        predefinedMotivators: this.getAllMotivators()
      };
    }
  }

  // New method to get fasting hours in the app's expected format
  static getFastingHoursForApp(): any {
    const fastingHours = this.getAllFastingHours();
    
    return {
      slots: fastingHours.map(hour => ({
        hour: hour.hour,
        day: hour.day,
        title: hour.title,
        bodyState: hour.bodyState,
        commonFeelings: hour.commonFeelings,
        encouragement: hour.encouragement,
        motivatorTags: hour.motivatorTags,
        difficulty: hour.difficulty,
        phase: hour.phase
      }))
    };
  }

  // Initialize sample data
  static createSampleData(): void {
    const existingMotivators = this.getAllMotivators();
    const existingFastingHours = this.getAllFastingHours();

    if (existingMotivators.length === 0) {
      const sampleMotivators: Motivator[] = [
        {
          id: 'template-fit-clothes',
          title: 'Fit Into Clothes',
          description: 'Get back into that favorite outfit that makes you feel amazing',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/fit-clothes.jpg',
          caption: 'That perfect dress is waiting for me',
          category: 'appearance',
          subcategory: 'clothing',
          difficulty: 'beginner',
          timeframe: '4-8 weeks',
          tags: ['clothing', 'confidence', 'transformation'],
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/fit-clothes.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-prepare-event',
          title: 'Prepare for Event',
          description: 'Look and feel your best for that special occasion',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/event-ready.jpg',
          caption: 'I will shine at this event',
          category: 'events',
          subcategory: 'special occasion',
          difficulty: 'intermediate',
          timeframe: '6-12 weeks',
          tags: ['wedding', 'reunion', 'celebration', 'confidence'],
          isActive: true,
          isFeatured: true,
          sortOrder: 2,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/event-ready.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-surprise-person',
          title: 'Surprise a Person',
          description: 'Transform yourself for someone special in your life',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/surprise-someone.jpg',
          caption: 'I will amaze them with my transformation',
          category: 'personal',
          subcategory: 'relationships',
          difficulty: 'intermediate',
          timeframe: '8-16 weeks',
          tags: ['love', 'surprise', 'transformation', 'confidence'],
          isActive: true,
          isFeatured: false,
          sortOrder: 3,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/surprise-someone.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-beach-body',
          title: 'Beach Body Ready',
          description: 'Feel confident and strong in your summer body',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/beach-ready.jpg',
          caption: 'I will feel amazing in my beach body',
          category: 'appearance',
          subcategory: 'fitness',
          difficulty: 'intermediate',
          timeframe: '12-20 weeks',
          tags: ['summer', 'beach', 'confidence', 'fitness'],
          isActive: true,
          isFeatured: true,
          sortOrder: 4,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/beach-ready.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-energy-boost',
          title: 'Boost Daily Energy',
          description: 'Increase your energy levels and mental clarity throughout the day',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/energy-boost.jpg',
          caption: 'I will feel energized and focused every day',
          category: 'health',
          subcategory: 'energy',
          difficulty: 'beginner',
          timeframe: '2-4 weeks',
          tags: ['energy', 'clarity', 'health', 'productivity'],
          isActive: true,
          isFeatured: false,
          sortOrder: 5,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/energy-boost.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-job-interview',
          title: 'Job Interview Confidence',
          description: 'Feel confident and sharp for important career opportunities',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/job-interview.jpg',
          caption: 'I will project confidence in my interview',
          category: 'events',
          subcategory: 'career',
          difficulty: 'beginner',
          timeframe: '2-6 weeks',
          tags: ['career', 'confidence', 'professional', 'success'],
          isActive: true,
          isFeatured: false,
          sortOrder: 6,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/job-interview.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-mental-clarity',
          title: 'Mental Clarity & Focus',
          description: 'Enhance your cognitive function and mental sharpness',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/mental-clarity.jpg',
          caption: 'I will achieve crystal clear focus',
          category: 'health',
          subcategory: 'mental health',
          difficulty: 'intermediate',
          timeframe: '4-8 weeks',
          tags: ['focus', 'clarity', 'cognitive', 'meditation'],
          isActive: true,
          isFeatured: false,
          sortOrder: 7,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/mental-clarity.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-athletic-performance',
          title: 'Athletic Performance',
          description: 'Improve your strength, endurance, and competition readiness',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/athletic-performance.jpg',
          caption: 'I will excel in my athletic performance',
          category: 'health',
          subcategory: 'fitness',
          difficulty: 'advanced',
          timeframe: '8-16 weeks',
          tags: ['athletics', 'performance', 'strength', 'endurance'],
          isActive: true,
          isFeatured: false,
          sortOrder: 8,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/athletic-performance.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-self-discipline',
          title: 'Build Self-Discipline',
          description: 'Develop stronger willpower and self-control in all areas of life',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/self-discipline.jpg',
          caption: 'I will master my self-discipline',
          category: 'personal',
          subcategory: 'growth',
          difficulty: 'advanced',
          timeframe: '12-24 weeks',
          tags: ['discipline', 'willpower', 'growth', 'mindset'],
          isActive: true,
          isFeatured: false,
          sortOrder: 9,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/self-discipline.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'template-longevity',
          title: 'Longevity & Health',
          description: 'Optimize your health for a longer, more vibrant life',
          imageUrl: 'https://your-aws-bucket.s3.amazonaws.com/motivators/longevity.jpg',
          caption: 'I will invest in my long-term health',
          category: 'health',
          subcategory: 'longevity',
          difficulty: 'intermediate',
          timeframe: 'ongoing',
          tags: ['longevity', 'health', 'aging', 'vitality'],
          isActive: true,
          isFeatured: false,
          sortOrder: 10,
          createdDate: new Date().toISOString(),
          timesUsed: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          isPredefined: true,
          image: 'https://your-aws-bucket.s3.amazonaws.com/motivators/longevity.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.MOTIVATORS_KEY, JSON.stringify(sampleMotivators));
    }

    // Force re-initialize fasting hours to ensure latest data structure
    console.log('Force re-initializing fasting hours with latest data...');
    this.initializeFastingHours();

    this.exportToApi();
  }
}
