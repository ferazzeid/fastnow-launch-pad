import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { supabase } from '@/integrations/supabase/client';

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

interface RingBellItem {
  id: string;
  imageUrl: string;
  quote: string;
  order: number;
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ringBellItems, setRingBellItems] = useState<RingBellItem[]>([]);

  useEffect(() => {
    loadSettings();
    loadRingBellItems();
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

  const loadRingBellItems = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'ring_bell_items')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.setting_value) {
        const items = Array.isArray(data.setting_value) ? data.setting_value : [];
        setRingBellItems(items.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          imageUrl: item.imageUrl || '',
          quote: item.quote || '',
          order: item.order || index
        })).sort((a: RingBellItem, b: RingBellItem) => a.order - b.order));
      } else {
        // Set default items if none exist
        const defaultItems: RingBellItem[] = [
          {
            id: 'airplane',
            imageUrl: '/lovable-uploads/9fe0f065-3ab9-4c72-9162-5e84ecd29940.png',
            quote: 'Fit comfortably into an airplane seat without a second thought.',
            order: 0
          },
          {
            id: 'pool',
            imageUrl: '/lovable-uploads/770570cf-21c8-41b5-9fd0-ccefb220b9c0.png',
            quote: 'Walk into the pool without feeling the need to cover up.',
            order: 1
          },
          {
            id: 'shopping',
            imageUrl: '/lovable-uploads/bce2f2c2-1b1b-4b69-b3f3-20e8715f94d2.png',
            quote: 'Order clothes online without sending everything back.',
            order: 2
          },
          {
            id: 'suit',
            imageUrl: '/lovable-uploads/f984a3bc-024b-4ea3-ba1b-1264a8c298d3.png',
            quote: 'Wear that premium suit and actually look like it was made for you.',
            order: 3
          },
          {
            id: 'gym',
            imageUrl: '/lovable-uploads/d8b92a30-a0a2-4acd-8f8d-1208eddab2e6.png',
            quote: 'Train at the gym without feeling like the odd one out.',
            order: 4
          },
          {
            id: 'running',
            imageUrl: '/lovable-uploads/790fae5b-122d-4e10-b65f-996b6abc5667.png',
            quote: 'Run across the street without worrying if you still can.',
            order: 5
          },
          {
            id: 'wardrobe',
            imageUrl: '',
            quote: 'Slip into your favorite clothes from years ago—and feel incredible in them.',
            order: 6
          }
        ];
        setRingBellItems(defaultItems);
      }
    } catch (error) {
      console.error('Error loading ring bell items:', error);
    }
  };

  // Get sorted images
  const images = settings.images.sort((a, b) => a.order - b.order);

  const goToPrevious = useCallback(() => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length]);

  // Auto advance slideshow
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [images.length, isPaused, goToNext]);

  if (images.length === 0) {
    return null; // Don't render if no images
  }

  // Get the three images to display (previous, current, next)
  const getPreviousIndex = () => {
    return currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
  };

  const getNextIndex = () => {
    return currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
  };

  return (
    <section className={`relative z-10 py-16 bg-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {settings.title}
          </h2>
        </div>
        
        <div 
          className="relative flex justify-center items-center gap-4 max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Image (Previous) */}
          <div className={`relative overflow-hidden rounded-lg bg-white shadow-lg opacity-60 hover:opacity-80 transition-all duration-500 transform ${
            isTransitioning ? 'scale-95' : 'scale-100'
          }`}>
            <img
              src={images[getPreviousIndex()].src}
              alt={images[getPreviousIndex()].alt}
              className="w-[320px] h-[480px] object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
              onClick={goToPrevious}
            />
          </div>

          {/* Center Image (Current) */}
          <div className={`relative overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-500 transform ${
            isTransitioning ? 'scale-105 shadow-3xl' : 'scale-100'
          }`}>
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="w-[400px] h-[600px] object-cover transition-all duration-500"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 opacity-0 hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 opacity-0 hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Right Image (Next) */}
          <div className={`relative overflow-hidden rounded-lg bg-white shadow-lg opacity-60 hover:opacity-80 transition-all duration-500 transform ${
            isTransitioning ? 'scale-95' : 'scale-100'
          }`}>
            <img
              src={images[getNextIndex()].src}
              alt={images[getNextIndex()].alt}
              className="w-[320px] h-[480px] object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
              onClick={goToNext}
            />
          </div>
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
        
        {/* Does this ring a bell? Section */}
        <div className="mt-24">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 leading-tight text-gray-900 text-center">
            Does this ring a bell?
          </h3>
          
          <div className="space-y-12 max-w-6xl mx-auto">
            {ringBellItems.map((item) => (
              <div key={item.id} className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-xl">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={`Ring bell item: ${item.quote}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm text-gray-500 text-center">Image<br/>needed</span>
                    </div>
                  )}
                </div>
                <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed italic">
                  "{item.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlideshow;