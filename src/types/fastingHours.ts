export interface FastingHour {
  id: string;
  hour: number;
  day: number;
  title: string;
  body_state: string;
  encouragement?: string;
  positive_symptoms: string[];
  challenging_symptoms: string[];
  common_feelings: string[];
  tips: string[];
  difficulty: string; // Database stores as string, not enum
  phase: string;
  motivator_tags: string[];
  scientific_info?: string;
  image_url?: string;
  autophagy_milestone: boolean;
  ketosis_milestone: boolean;
  fat_burning_milestone: boolean;
  created_at: string;
  updated_at: string;
}

export interface FastingHourUpdate {
  title?: string;
  body_state?: string;
  encouragement?: string;
  positive_symptoms?: string[];
  challenging_symptoms?: string[];
  common_feelings?: string[];
  tips?: string[];
  difficulty?: string;
  phase?: string;
  motivator_tags?: string[];
  scientific_info?: string;
  image_url?: string;
  autophagy_milestone?: boolean;
  ketosis_milestone?: boolean;
  fat_burning_milestone?: boolean;
}