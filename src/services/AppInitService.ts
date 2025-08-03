import { migrationService } from './MigrationService';

class AppInitService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Run migration if needed
      if (migrationService.isMigrationNeeded()) {
        console.log('Running localStorage to database migration...');
        await migrationService.runCompleteMigration();
      }
      
      this.initialized = true;
      console.log('App initialization completed');
    } catch (error) {
      console.error('Error during app initialization:', error);
    }
  }
}

export const appInitService = new AppInitService();