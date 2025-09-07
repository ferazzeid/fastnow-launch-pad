
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  videoUrl?: string;
  author: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  metaDescription?: string;
  metaKeywords?: string;
  showAuthorBox?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
