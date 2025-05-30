import { Motivator, FastingHour } from '@/types/app-content';

export class AppContentService {
  private static MOTIVATORS_KEY = 'fastingApp_motivators';
  private static FASTING_HOURS_KEY = 'fastingApp_fastingHours';

  // === FASTING HOURS MANAGEMENT ===
  
  static getAllFastingHours(): FastingHour[] {
    try {
      const data = localStorage.getItem(this.FASTING_HOURS_KEY);
      console.log('🔍 getAllFastingHours - raw data from localStorage:', data);
      
      if (!data) {
        console.log('📝 No data found, initializing...');
        return this.initializeFastingHours();
      }
      
      const parsed = JSON.parse(data);
      console.log('✅ getAllFastingHours - parsed data:', parsed.length, 'hours');
      return parsed;
    } catch (error) {
      console.error('❌ Error in getAllFastingHours:', error);
      return this.initializeFastingHours();
    }
  }

  static getFastingHourByHour(hour: number): FastingHour | null {
    console.log(`🔎 getFastingHourByHour called for hour: ${hour}`);
    const allHours = this.getAllFastingHours();
    console.log(`📊 Total hours in storage: ${allHours.length}`);
    
    const found = allHours.find(h => h.hour === hour);
    console.log(`${found ? '✅' : '❌'} Hour ${hour} ${found ? 'found' : 'not found'}`);
    
    if (found) {
      console.log(`📄 Hour ${hour} data:`, { title: found.title, bodyState: found.bodyState?.substring(0, 50) + '...' });
    }
    
    return found || null;
  }

  static saveFastingHour(hourData: FastingHour): void {
    console.log('💾 === SAVE OPERATION START ===');
    console.log('💾 Hour to save:', hourData.hour);
    console.log('💾 Title to save:', hourData.title);
    
    try {
      // Get all current hours
      const allHours = this.getAllFastingHours();
      console.log('💾 Current total hours before save:', allHours.length);
      
      // Find existing hour or add new one
      const existingIndex = allHours.findIndex(h => h.hour === hourData.hour);
      console.log('💾 Existing hour index:', existingIndex);
      
      const updatedHour = {
        ...hourData,
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        console.log('💾 Updating existing hour at index:', existingIndex);
        allHours[existingIndex] = updatedHour;
      } else {
        console.log('💾 Adding new hour');
        allHours.push(updatedHour);
        allHours.sort((a, b) => a.hour - b.hour);
      }
      
      // Save to localStorage
      const dataToSave = JSON.stringify(allHours);
      console.log('💾 Saving data length:', dataToSave.length);
      
      localStorage.setItem(this.FASTING_HOURS_KEY, dataToSave);
      console.log('💾 Data saved to localStorage');
      
      // Immediate verification
      const verification = localStorage.getItem(this.FASTING_HOURS_KEY);
      if (verification) {
        const verifyParsed = JSON.parse(verification);
        const verifyHour = verifyParsed.find((h: FastingHour) => h.hour === hourData.hour);
        console.log('✅ VERIFICATION SUCCESS - Hour saved with title:', verifyHour?.title);
      } else {
        console.log('❌ VERIFICATION FAILED - No data in localStorage');
      }
      
      console.log('💾 === SAVE OPERATION COMPLETE ===');
      
    } catch (error) {
      console.error('❌ Error in saveFastingHour:', error);
      throw error;
    }
  }

  private static initializeFastingHours(): FastingHour[] {
    console.log('🚀 Initializing fasting hours...');
    const fastingHours: FastingHour[] = [];

    // Create basic structure for all 96 hours
    for (let hour = 0; hour <= 96; hour++) {
      const day = Math.floor(hour / 24) + 1;
      
      const fastingHour: FastingHour = {
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
        imageUrl: "",
        symptoms: { positive: [], challenging: [] },
        milestones: { 
          autophagy: hour >= 16, 
          ketosis: hour >= 24, 
          fatBurning: hour >= 12 
        },
        updatedAt: new Date().toISOString()
      };
      
      fastingHours.push(fastingHour);
    }

    console.log('🚀 Saving initialized hours to localStorage...');
    localStorage.setItem(this.FASTING_HOURS_KEY, JSON.stringify(fastingHours));
    
    console.log('🚀 Initialization complete');
    return fastingHours;
  }

  // === MOTIVATORS MANAGEMENT ===
  
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

  // === UTILITY METHODS ===
  
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
      localStorage.setItem('fastingApp_fastingHoursApi', JSON.stringify({
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalHours: 96,
        hours: fastingHours
      }));
      localStorage.setItem('fastingApp_motivatorsApi', JSON.stringify({
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalMotivators: motivators.length,
        predefinedMotivators: motivators
      }));
      
    } catch (error) {
      console.error('Error exporting API data:', error);
    }
  }

  // === API DATA GETTERS ===
  
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
        fastingHours: this.getAllFastingHours(),
        lastUpdated: new Date().toISOString()
      };
    }
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
        hours: this.getAllFastingHours()
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

  // === LEGACY COMPATIBILITY ===
  
  static getAllFastingSlots(): FastingHour[] {
    return this.getAllFastingHours();
  }

  static getFastingSlotByHour(hour: number): FastingHour | null {
    return this.getFastingHourByHour(hour);
  }

  static saveFastingSlot(slot: FastingHour): void {
    this.saveFastingHour(slot);
  }

  static getFastingSlotsApiData(): any {
    return this.getFastingHoursApiData();
  }

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

  // === SAMPLE DATA CREATION ===
  
  static createSampleData(): void {
    const existingMotivators = this.getAllMotivators();

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
    const existingHours = this.getAllFastingHours();
    if (existingHours.length === 0) {
      this.initializeFastingHours();
    }

    this.exportToApi();
  }
}
