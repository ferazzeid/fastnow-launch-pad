import { ImageUploadService } from "@/services/ImageUploadService";

// Helper function to migrate blog featured images to Supabase
export async function migrateBlogImagesToSupabase() {
  // This function would be used to migrate existing blog images
  // For now, it provides the mapping for the featured images
  
  const featuredImageMappings = {
    'blog-featured-1.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-1.jpg',
    'blog-featured-2.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-2.jpg', 
    'blog-featured-3.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-3.jpg',
    'blog-featured-4.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-4.jpg',
    'blog-featured-5.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-5.jpg'
  };

  console.log('Featured image mappings for Supabase:', featuredImageMappings);
  return featuredImageMappings;
}

// Helper to migrate localStorage images to Supabase
export async function migrateLocalStorageImagesToSupabase() {
  const imagesToMigrate = [
    { key: 'fastingApp_logoUrl', folder: 'logos', filename: 'logo' },
    { key: 'fastingApp_mockupUrl', folder: 'app-images', filename: 'app-image' },
    { key: 'fastingApp_faviconUrl', folder: 'favicons', filename: 'favicon' }
  ];

  for (const image of imagesToMigrate) {
    const base64Data = localStorage.getItem(image.key);
    if (base64Data && base64Data.startsWith('data:')) {
      try {
        // Convert base64 to blob
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const file = new File([blob], `${image.filename}.jpg`, { type: 'image/jpeg' });

        // Upload to Supabase
        const result = await ImageUploadService.uploadImage(file, image.folder, image.filename);
        
        // Update localStorage with new URL
        localStorage.setItem(image.key, result.url);
        localStorage.setItem(`${image.key.replace('Url', 'Path')}`, result.path);
        
        console.log(`Migrated ${image.key} to Supabase:`, result.url);
      } catch (error) {
        console.error(`Failed to migrate ${image.key}:`, error);
      }
    }
  }
}