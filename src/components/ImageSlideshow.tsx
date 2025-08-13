import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface SlideshowImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

interface SlideshowSettings {
  title: string;
  images: SlideshowImage[];
}

interface ImageSlideshowProps {
  className?: string;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState<SlideshowSettings>({
    title: "Aren't you tired of this?",
    images: []
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await SiteSettingsService.getSetting('slideshow_gallery_settings');
      if (savedSettings && typeof savedSettings === 'object' && !Array.isArray(savedSettings)) {
        setSettings(savedSettings as unknown as SlideshowSettings);
      } else {
        // Initialize with default images if no settings exist
        setSettings({
          title: "Aren't you tired of this?",
          images: [
            {
              id: '1',
              src: '/lovable-uploads/a692b963-f764-48e1-bcce-3e8fcc088664.png',
              alt: 'Struggling with loose clothes',
              order: 1
            },
            {
              id: '2',
              src: '/lovable-uploads/62548454-bd7e-4abe-ad5b-8c0e94ffcfee.png',
              alt: 'Feeling self-conscious at restaurants',
              order: 2
            },
            {
              id: '3',
              src: '/lovable-uploads/fbd5bcda-a4f6-4c7d-a715-9296283c6e79.png',
              alt: 'Difficulty at the gym',
              order: 3
            },
            {
              id: '4',
              src: '/lovable-uploads/3c1b9262-ae67-4093-b76b-f09bc99170c2.png',
              alt: 'Returning clothes that don\'t fit',
              order: 4
            },
            {
              id: '5',
              src: '/lovable-uploads/7ab8d747-9c05-46b7-8cf1-ecf01dc91aa8.png',
              alt: 'Struggling with exercise',
              order: 5
            },
            {
              id: '6',
              src: '/lovable-uploads/55fd8231-9516-4cb3-a6f8-3534c7e08a9b.png',
              alt: 'Clothes shopping difficulties',
              order: 6
            },
            {
              id: '7',
              src: '/lovable-uploads/6d39dc89-c8e2-4796-889d-385a77164cd0.png',
              alt: 'Uncomfortable airline seats',
              order: 7
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error loading slideshow settings:', error);
    }
  };

  // Get sorted images
  const images = settings.images.sort((a, b) => a.order - b.order);

  if (images.length === 0) {
    return null; // Don't render if no images
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className={`relative z-10 py-16 bg-gray-100 ${className}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {settings.title}
          </h2>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Main Image Display */}
          <div className="relative overflow-hidden rounded-lg bg-white shadow-2xl">
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="w-full h-auto object-contain transition-opacity duration-300 max-h-[600px]"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Image Counter */}
          <div className="text-center mt-6">
            <div className="flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-gray-800 scale-125' 
                      : 'bg-gray-400 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {currentImageIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlideshow;