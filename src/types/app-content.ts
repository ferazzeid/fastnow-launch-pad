
export interface Motivator {
  id: string;
  title: string;
  description?: string;
  image: string;
  createdAt: string;
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
  lastUpdated: string;
}
