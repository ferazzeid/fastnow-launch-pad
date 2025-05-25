import { Motivator, HourlyContent, FastingSlot } from '@/types/app-content';

export class AppContentService {
  private static MOTIVATORS_KEY = 'fastingApp_motivators';
  private static HOURLY_CONTENT_KEY = 'fastingApp_hourlyContent';
  private static FASTING_SLOTS_KEY = 'fastingApp_fastingSlots';

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

  // Hourly Content Management (legacy)
  static getAllHourlyContent(): HourlyContent[] {
    try {
      const hourlyContent = localStorage.getItem(this.HOURLY_CONTENT_KEY);
      return hourlyContent ? JSON.parse(hourlyContent) : this.initializeHourlyContent();
    } catch (error) {
      console.error('Error loading hourly content:', error);
      return this.initializeHourlyContent();
    }
  }

  static getHourlyContentByHour(hour: number): HourlyContent | null {
    const hourlyContent = this.getAllHourlyContent();
    return hourlyContent.find(content => content.hour === hour) || null;
  }

  static saveHourlyContent(content: HourlyContent): void {
    const allContent = this.getAllHourlyContent();
    const existingIndex = allContent.findIndex(c => c.hour === content.hour);
    
    const updatedContent = { ...content, updatedAt: new Date().toISOString() };
    
    if (existingIndex >= 0) {
      allContent[existingIndex] = updatedContent;
    } else {
      allContent.push(updatedContent);
      allContent.sort((a, b) => a.hour - b.hour);
    }
    
    localStorage.setItem(this.HOURLY_CONTENT_KEY, JSON.stringify(allContent));
    this.exportToApi();
  }

  private static initializeHourlyContent(): HourlyContent[] {
    const hourlyContent: HourlyContent[] = [];
    for (let hour = 1; hour <= 96; hour++) {
      hourlyContent.push({
        hour,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        updatedAt: new Date().toISOString()
      });
    }
    localStorage.setItem(this.HOURLY_CONTENT_KEY, JSON.stringify(hourlyContent));
    return hourlyContent;
  }

  // Fasting Slots Management
  static getAllFastingSlots(): FastingSlot[] {
    try {
      const fastingSlots = localStorage.getItem(this.FASTING_SLOTS_KEY);
      return fastingSlots ? JSON.parse(fastingSlots) : this.initializeFastingSlots();
    } catch (error) {
      console.error('Error loading fasting slots:', error);
      return this.initializeFastingSlots();
    }
  }

  static getFastingSlotByHour(hour: number): FastingSlot | null {
    const fastingSlots = this.getAllFastingSlots();
    return fastingSlots.find(slot => slot.hour === hour) || null;
  }

  static saveFastingSlot(slot: FastingSlot): void {
    const allSlots = this.getAllFastingSlots();
    const existingIndex = allSlots.findIndex(s => s.hour === slot.hour);
    
    const updatedSlot = { ...slot, updatedAt: new Date().toISOString() };
    
    if (existingIndex >= 0) {
      allSlots[existingIndex] = updatedSlot;
    } else {
      allSlots.push(updatedSlot);
      allSlots.sort((a, b) => a.hour - b.hour);
    }
    
    localStorage.setItem(this.FASTING_SLOTS_KEY, JSON.stringify(allSlots));
    this.exportToApi();
  }

  private static initializeFastingSlots(): FastingSlot[] {
    const keyHours = [0, 1, 4, 8, 12, 16, 18, 20, 24, 30, 36, 42, 48, 60, 72, 84, 96];
    const fastingSlots: FastingSlot[] = [];

    const sampleData = {
      0: {
        title: "Fast Initiated",
        bodyState: "You've just started your fast. Your body is still processing your last meal and beginning to transition into fasting mode.",
        commonFeelings: ["motivated", "excited", "normal"],
        encouragement: "Great job starting your fast! The first step is always the hardest.",
        motivatorTags: ["motivation", "beginning", "preparation"],
        difficulty: "easy" as const,
        phase: "preparation" as const,
        tips: ["Set up your environment for success", "Remove tempting foods", "Stay hydrated"],
        scientificInfo: "Your body is still digesting food and blood glucose levels are normal. Insulin is actively working to process nutrients.",
        symptoms: { positive: ["Clear mindset", "High energy"], challenging: [] },
        milestones: { autophagy: false, ketosis: false, fatBurning: false }
      },
      1: {
        title: "Early Fasting",
        bodyState: "Your last meal is being digested. Blood sugar levels are starting to stabilize.",
        commonFeelings: ["normal", "slightly hungry"],
        encouragement: "You're doing great! Your body is adapting to the fasting state.",
        motivatorTags: ["beginning", "adaptation"],
        difficulty: "easy" as const,
        phase: "initial" as const,
        tips: ["Keep yourself busy", "Drink water regularly"],
        scientificInfo: "Digestion is nearly complete. Blood glucose is beginning to decline as glycogen stores start being accessed.",
        symptoms: { positive: ["Stable energy"], challenging: ["Mild hunger"] },
        milestones: { autophagy: false, ketosis: false, fatBurning: false }
      },
      16: {
        title: "Autophagy Begins",
        bodyState: "Your body has switched to fat burning and autophagy is beginning to activate.",
        commonFeelings: ["focused", "slightly tired", "proud"],
        encouragement: "Amazing! You've reached the point where your body starts its deep cleaning process.",
        motivatorTags: ["autophagy", "breakthrough", "healing"],
        difficulty: "moderate" as const,
        phase: "adaptation" as const,
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
        difficulty: "moderate" as const,
        phase: "ketosis" as const,
        tips: ["Enjoy the mental clarity", "Listen to your body"],
        scientificInfo: "Deep ketosis with significant ketone production. Brain is efficiently using ketones for fuel.",
        symptoms: { positive: ["Exceptional mental clarity", "Stable energy", "Reduced inflammation"], challenging: [] },
        milestones: { autophagy: true, ketosis: true, fatBurning: true }
      }
    };

    keyHours.forEach(hour => {
      const day = Math.floor(hour / 24) + 1;
      const data = sampleData[hour as keyof typeof sampleData] || {
        title: `Hour ${hour}`,
        bodyState: "Your body continues its fasting journey.",
        commonFeelings: ["determined"],
        encouragement: "Keep going! Every hour brings new benefits.",
        motivatorTags: ["persistence"],
        difficulty: "moderate" as const,
        phase: hour < 12 ? "initial" as const : hour < 24 ? "adaptation" as const : hour < 48 ? "ketosis" as const : "deep_ketosis" as const,
        tips: ["Stay hydrated", "Rest when needed"],
        scientificInfo: "Continued metabolic adaptation and cellular repair processes.",
        symptoms: { positive: ["Progress"], challenging: [] },
        milestones: { autophagy: hour >= 16, ketosis: hour >= 24, fatBurning: hour >= 12 }
      };

      fastingSlots.push({
        hour,
        day,
        ...data,
        imageUrl: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&hour=${hour}`,
        updatedAt: new Date().toISOString()
      });
    });

    localStorage.setItem(this.FASTING_SLOTS_KEY, JSON.stringify(fastingSlots));
    return fastingSlots;
  }

  // Utility functions
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private static async exportToApi(): Promise<void> {
    try {
      const motivators = this.getAllMotivators();
      const hourlyContent = this.getAllHourlyContent();
      const fastingSlots = this.getAllFastingSlots();
      
      const apiData = {
        motivators,
        hourlyContent,
        fastingSlots,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('fastingApp_appContentApi', JSON.stringify(apiData));
      
      // Create the fasting slots API data
      const fastingSlotsApiData = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        slots: fastingSlots
      };
      
      localStorage.setItem('fastingApp_fastingSlotsApi', JSON.stringify(fastingSlotsApiData));
      
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
        motivators: [], 
        hourlyContent: this.getAllHourlyContent(),
        fastingSlots: this.getAllFastingSlots(),
        lastUpdated: null 
      };
    } catch (error) {
      console.error('Error loading app content API data:', error);
      return { 
        motivators: [], 
        hourlyContent: this.initializeHourlyContent(),
        fastingSlots: this.initializeFastingSlots(),
        lastUpdated: null 
      };
    }
  }

  static getFastingSlotsApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_fastingSlotsApi');
      return apiData ? JSON.parse(apiData) : {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        slots: this.getAllFastingSlots()
      };
    } catch (error) {
      console.error('Error loading fasting slots API data:', error);
      return {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        slots: this.initializeFastingSlots()
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

  // Initialize sample data
  static createSampleData(): void {
    const existingMotivators = this.getAllMotivators();
    const existingHourlyContent = this.getAllHourlyContent();
    const existingFastingSlots = this.getAllFastingSlots();

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

    // Initialize fasting slots if they don't exist
    if (existingFastingSlots.length === 0) {
      this.initializeFastingSlots();
    }

    this.exportToApi();
  }
}
