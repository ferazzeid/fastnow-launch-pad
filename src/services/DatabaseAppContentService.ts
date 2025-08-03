import { supabase } from "@/integrations/supabase/client";
import { Motivator, FastingHour } from "@/types/app-content";

class DatabaseAppContentService {
  async getAllMotivators(): Promise<Motivator[]> {
    try {
      const { data, error } = await supabase
        .from('app_motivators')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching motivators:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToMotivator) || [];
    } catch (error) {
      console.error('Error in getAllMotivators:', error);
      return [];
    }
  }

  async getAllFastingHours(): Promise<FastingHour[]> {
    try {
      const { data, error } = await supabase
        .from('fasting_hours')
        .select('*')
        .order('hour');

      if (error) {
        console.error('Error fetching fasting hours:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToFastingHour) || [];
    } catch (error) {
      console.error('Error in getAllFastingHours:', error);
      return [];
    }
  }

  async saveMotivator(motivator: Motivator): Promise<boolean> {
    try {
      const dbMotivator = this.mapMotivatorToDatabase(motivator);
      
      const { error } = await supabase
        .from('app_motivators')
        .upsert(dbMotivator);

      if (error) {
        console.error('Error saving motivator:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveMotivator:', error);
      return false;
    }
  }

  async saveFastingHour(fastingHour: FastingHour): Promise<boolean> {
    try {
      const dbFastingHour = this.mapFastingHourToDatabase(fastingHour);
      
      const { error } = await supabase
        .from('fasting_hours')
        .upsert(dbFastingHour);

      if (error) {
        console.error('Error saving fasting hour:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveFastingHour:', error);
      return false;
    }
  }

  private mapDatabaseToMotivator(data: any): Motivator {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url || '',
      caption: data.caption || '',
      createdDate: data.created_at,
      timesUsed: data.times_used || 0,
      totalSessions: data.total_sessions || 0,
      completedSessions: data.completed_sessions || 0,
      totalTimeSpent: data.total_time_spent || 0,
      isPredefined: data.is_predefined || false,
      category: data.category || 'personal',
      subcategory: data.subcategory || '',
      difficulty: data.difficulty || 'easy',
      timeframe: data.timeframe || '',
      tags: data.tags || [],
      isActive: data.is_active || true,
      isFeatured: data.is_featured || false,
      sortOrder: data.sort_order || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapDatabaseToFastingHour(data: any): FastingHour {
    return {
      hour: data.hour,
      day: data.day,
      title: data.title,
      bodyState: data.body_state,
      commonFeelings: data.common_feelings || [],
      encouragement: data.encouragement || '',
      motivatorTags: data.motivator_tags || [],
      difficulty: data.difficulty as any,
      phase: data.phase as any,
      tips: data.tips || [],
      scientificInfo: data.scientific_info || '',
      imageUrl: data.image_url || '',
      symptoms: {
        positive: data.positive_symptoms || [],
        challenging: data.challenging_symptoms || []
      },
      milestones: {
        autophagy: data.autophagy_milestone || false,
        ketosis: data.ketosis_milestone || false,
        fatBurning: data.fat_burning_milestone || false
      },
      updatedAt: data.updated_at
    };
  }

  private mapMotivatorToDatabase(motivator: Motivator): any {
    return {
      id: motivator.id,
      title: motivator.title,
      description: motivator.description,
      image_url: motivator.imageUrl,
      caption: motivator.caption,
      category: motivator.category,
      subcategory: motivator.subcategory,
      difficulty: motivator.difficulty,
      timeframe: motivator.timeframe,
      tags: motivator.tags,
      is_active: motivator.isActive,
      is_featured: motivator.isFeatured,
      is_predefined: motivator.isPredefined,
      sort_order: motivator.sortOrder,
      times_used: motivator.timesUsed,
      total_sessions: motivator.totalSessions,
      completed_sessions: motivator.completedSessions,
      total_time_spent: motivator.totalTimeSpent
    };
  }

  private mapFastingHourToDatabase(fastingHour: FastingHour): any {
    return {
      hour: fastingHour.hour,
      day: fastingHour.day,
      title: fastingHour.title,
      body_state: fastingHour.bodyState,
      common_feelings: fastingHour.commonFeelings,
      encouragement: fastingHour.encouragement,
      motivator_tags: fastingHour.motivatorTags,
      difficulty: fastingHour.difficulty,
      phase: fastingHour.phase,
      tips: fastingHour.tips,
      scientific_info: fastingHour.scientificInfo,
      image_url: fastingHour.imageUrl,
      positive_symptoms: fastingHour.symptoms.positive,
      challenging_symptoms: fastingHour.symptoms.challenging,
      autophagy_milestone: fastingHour.milestones.autophagy,
      ketosis_milestone: fastingHour.milestones.ketosis,
      fat_burning_milestone: fastingHour.milestones.fatBurning
    };
  }

  // Migration utility to move localStorage data to database
  async migrateFromLocalStorage(): Promise<void> {
    try {
      console.log('Migrating app content from localStorage to database...');
      
      // Migrate motivators
      const storedMotivators = localStorage.getItem('motivators');
      if (storedMotivators) {
        const motivators: Motivator[] = JSON.parse(storedMotivators);
        console.log(`Found ${motivators.length} motivators to migrate`);
        
        for (const motivator of motivators) {
          await this.saveMotivator(motivator);
        }
      }

      // Migrate fasting hours
      const storedFastingHours = localStorage.getItem('fasting_hours');
      if (storedFastingHours) {
        const fastingHours: FastingHour[] = JSON.parse(storedFastingHours);
        console.log(`Found ${fastingHours.length} fasting hours to migrate`);
        
        for (const fastingHour of fastingHours) {
          await this.saveFastingHour(fastingHour);
        }
      }

      console.log('App content migration completed successfully!');
    } catch (error) {
      console.error('Error during app content migration:', error);
    }
  }

  // Clean up localStorage after migration
  cleanupLocalStorage(): void {
    localStorage.removeItem('motivators');
    localStorage.removeItem('fasting_hours');
    localStorage.removeItem('app_content_data');
    console.log('App content localStorage cleanup completed');
  }
}

export const databaseAppContentService = new DatabaseAppContentService();