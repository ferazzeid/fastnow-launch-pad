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

    // Sample data for key hours
    const keyHoursData: { [key: number]: Partial<FastingHour> } = {
      0: {
        title: "Fast Initiated",
        bodyState: "You've just started your fast. Your body is still processing your last meal and beginning to transition into fasting mode.",
        commonFeelings: ["motivated", "excited", "normal"],
        encouragement: "Great job starting your fast! The first step is always the hardest.",
        motivatorTags: ["motivation", "beginning", "preparation"],
        difficulty: "easy",
        phase: "preparation",
        tips: ["Set up your environment for success", "Remove tempting foods", "Stay hydrated"],
        scientificInfo: "Your body is still digesting food and blood glucose levels are normal. Insulin is actively working to process nutrients.",
        symptoms: { positive: ["Clear mindset", "High energy"], challenging: [] },
        milestones: { autophagy: false, ketosis: false, fatBurning: false }
      },
      16: {
        title: "Autophagy Begins",
        bodyState: "Your body has switched to fat burning and autophagy is beginning to activate.",
        commonFeelings: ["focused", "slightly tired", "proud"],
        encouragement: "Amazing! You've reached the point where your body starts its deep cleaning process.",
        motivatorTags: ["autophagy", "breakthrough", "healing"],
        difficulty: "moderate",
        phase: "adaptation",
        tips: ["This is when the magic happens", "Stay strong through any hunger waves"],
        scientificInfo: "Autophagy processes are activating. Your body is beginning to recycle damaged cellular components.",
        symptoms: { positive: ["Mental clarity", "Sense of accomplishment"], challenging: ["Hunger waves", "Some fatigue"] },
        milestones: { autophagy: true, ketosis: false, fatBurning: true }
      },
      48: {
        title: "Deep Ketosis",
        bodyState: "You're in deep ketosis. Your body is efficiently burning fat and producing ketones for brain fuel.",
        commonFeelings: ["energetic", "clear-minded", "empowered"],
        encouragement: "Incredible! You've achieved a state that brings profound healing benefits.",
        motivatorTags: ["ketosis", "fat-burning", "peak-performance"],
        difficulty: "moderate",
        phase: "ketosis",
        tips: ["Enjoy the mental clarity", "Listen to your body"],
        scientificInfo: "Deep ketosis with significant ketone production. Brain is efficiently using ketones for fuel.",
        symptoms: { positive: ["Exceptional mental clarity", "Stable energy", "Reduced inflammation"], challenging: [] },
        milestones: { autophagy: true, ketosis: true, fatBurning: true }
      }
    };

    // Create all 96 hours
    for (let hour = 1; hour <= 96; hour++) {
      const day = Math.floor((hour - 1) / 24) + 1;
      const sampleData = keyHoursData[hour] || {};
      
      fastingHours.push({
        hour,
        day,
        title: sampleData.title || `Hour ${hour}`,
        bodyState: sampleData.bodyState || "",
        commonFeelings: sampleData.commonFeelings || [],
        encouragement: sampleData.encouragement || "",
        motivatorTags: sampleData.motivatorTags || [],
        difficulty: sampleData.difficulty || "moderate",
        phase: hour <= 4 ? "preparation" : hour <= 12 ? "initial" : hour <= 24 ? "adaptation" : hour <= 48 ? "ketosis" : hour <= 72 ? "deep_ketosis" : "extended",
        tips: sampleData.tips || [],
        scientificInfo: sampleData.scientificInfo || "",
        imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&hour=${hour}`,
        symptoms: sampleData.symptoms || { positive: [], challenging: [] },
        milestones: sampleData.milestones || { 
          autophagy: hour >= 16, 
          ketosis: hour >= 24, 
          fatBurning: hour >= 12 
        },
        updatedAt: new Date().toISOString()
      });
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

    // Initialize fasting hours if they don't exist
    if (existingFastingHours.length === 0) {
      this.initializeFastingHours();
    }

    this.exportToApi();
  }
}
