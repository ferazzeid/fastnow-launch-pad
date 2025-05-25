
import { Motivator, HourlyContent } from '@/types/app-content';

export class AppContentService {
  private static MOTIVATORS_KEY = 'fastingApp_motivators';
  private static HOURLY_CONTENT_KEY = 'fastingApp_hourlyContent';

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

  // Hourly Content Management
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

  // Utility functions
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private static async exportToApi(): Promise<void> {
    try {
      const motivators = this.getAllMotivators();
      const hourlyContent = this.getAllHourlyContent();
      
      const apiData = {
        motivators,
        hourlyContent,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('fastingApp_appContentApi', JSON.stringify(apiData));
      console.log('App content exported to API successfully');
    } catch (error) {
      console.error('Error exporting app content to API:', error);
    }
  }

  static getAppContentApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_appContentApi');
      return apiData ? JSON.parse(apiData) : { 
        motivators: [], 
        hourlyContent: this.getAllHourlyContent(),
        lastUpdated: null 
      };
    } catch (error) {
      console.error('Error loading app content API data:', error);
      return { 
        motivators: [], 
        hourlyContent: this.initializeHourlyContent(),
        lastUpdated: null 
      };
    }
  }

  // Initialize sample data
  static createSampleData(): void {
    const existingMotivators = this.getAllMotivators();
    const existingHourlyContent = this.getAllHourlyContent();

    if (existingMotivators.length === 0) {
      const sampleMotivators: Motivator[] = [
        {
          id: this.generateId(),
          title: 'Stay Strong',
          description: 'Remember why you started your fasting journey',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          title: 'Mind Over Matter',
          description: 'Your mental strength is your greatest asset',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.MOTIVATORS_KEY, JSON.stringify(sampleMotivators));
    }

    // Hourly content is automatically initialized when first accessed
    this.exportToApi();
  }
}
