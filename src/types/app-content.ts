
export interface Motivator {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  caption: string;
  createdDate: string;
  timesUsed: number;
  totalSessions: number;
  completedSessions: number;
  totalTimeSpent: number;
  isPredefined: boolean;
  category: string;
  subcategory: string;
  difficulty: string;
  timeframe: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  // Legacy field for backward compatibility
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FastingSlot {
  hour: number;
  day: number;
  title: string;
  bodyState: string;
  commonFeelings: string[];
  encouragement: string;
  motivatorTags: string[];
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  phase: 'preparation' | 'initial' | 'adaptation' | 'ketosis' | 'deep_ketosis' | 'extended';
  tips: string[];
  scientificInfo: string;
  imageUrl: string;
  symptoms: {
    positive: string[];
    challenging: string[];
  };
  milestones: {
    autophagy: boolean;
    ketosis: boolean;
    fatBurning: boolean;
  };
  updatedAt: string;
}

export interface HourlyContent {
  hour: number; // 1-96
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  updatedAt: string;
}

export interface AppContentApiData {
  motivators: Motivator[];
  hourlyContent: HourlyContent[];
  fastingSlots: FastingSlot[];
  lastUpdated: string;
}

export interface FastingSlotsApiResponse {
  version: string;
  lastUpdated: string;
  totalHours: number;
  slots: FastingSlot[];
}

export interface MotivatorsApiResponse {
  version: string;
  lastUpdated: string;
  totalMotivators: number;
  predefinedMotivators: Motivator[];
}
