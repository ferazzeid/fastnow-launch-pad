
export interface FastingTimelinePost {
  id: string;
  hour: number; // 0-96
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  metaDescription?: string;
  metaKeywords?: string;
  whatsHappening?: string; // What's happening in the body
  howYoureFeeling?: string; // How you might be feeling
}

export interface FastingTimelineCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
