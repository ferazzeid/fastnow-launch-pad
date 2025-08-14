import React, { useEffect, useState } from 'react';
import { ringBellGalleryService, RingBellGalleryItem } from '@/services/RingBellGalleryService';

const RingBellGallery = () => {
  const [items, setItems] = useState<RingBellGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await ringBellGalleryService.getAllItems();
        setItems(data);
      } catch (error) {
        console.error('Error loading ring bell gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Create array of 9 positions with items or placeholders
  const galleryItems = Array.from({ length: 9 }, (_, index) => {
    const position = index + 1;
    const item = items.find(i => i.order_position === position);
    return { position, item };
  });

  if (loading) {
    return (
      <section className="relative z-10 py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-left max-w-4xl mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
            Does This Ring a Bell?
          </h2>
        </div>

        {/* 3x3 Seamless Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 w-full">
          {galleryItems.map(({ position, item }) => (
            <GalleryCard key={position} position={position} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface GalleryCardProps {
  position: number;
  item?: RingBellGalleryItem;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ position, item }) => {
  // Determine what content is on front and back
  const frontIsImage = !!item?.front_image_url;
  const backIsImage = !!item?.back_image_url;
  
  // Calculate initial state based on initial_state setting and content availability
  const getInitialFlipState = () => {
    if (!item?.initial_state) {
      // Default alternating pattern for backwards compatibility
      return position % 2 === 0;
    }
    
    // If user wants to show image first
    if (item.initial_state === 'image') {
      // If front has image, don't flip (show front). If back has image, flip (show back)
      return frontIsImage ? false : true;
    } else {
      // If user wants to show text first
      // If front has text, don't flip (show front). If back has text, flip (show back)
      return frontIsImage ? true : false;
    }
  };
  
  const [isFlipped, setIsFlipped] = useState(getInitialFlipState());

  if (!item) {
    return (
      <div className="relative aspect-square group">
        <div className="absolute inset-0 bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📍</div>
            <p className="text-sm font-medium">Position {position}</p>
            <p className="text-xs">Coming Soon</p>
          </div>
        </div>
      </div>
    );
  }

  const initialFlipState = getInitialFlipState();

  return (
    <div 
      className="relative aspect-square group cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(!initialFlipState)}
      onMouseLeave={() => setIsFlipped(initialFlipState)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden">
          {item.front_image_url ? (
            <img 
              src={item.front_image_url} 
              alt={`Gallery item ${position}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center p-4">
              <p className="text-white text-center text-sm md:text-base font-medium leading-relaxed">
                {item.front_text}
              </p>
            </div>
          )}
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 overflow-hidden">
          {item.back_image_url ? (
            <img 
              src={item.back_image_url} 
              alt={`Gallery item ${position} back`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center p-4">
              <p className="text-white text-center text-sm md:text-base font-medium leading-relaxed">
                {item.back_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RingBellGallery;