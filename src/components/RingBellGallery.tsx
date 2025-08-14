import React, { useEffect, useState } from 'react';
import { ringBellGalleryService, RingBellGalleryItem } from '@/services/RingBellGalleryService';

const RingBellGallery = () => {
  const [items, setItems] = useState<RingBellGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await ringBellGalleryService.getAllItems();
        console.log('Ring Bell Gallery loaded items:', data);
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
  // Use the initial_state from the database item, fallback to alternating pattern for backwards compatibility
  const startsFlipped = item?.initial_state === 'text' || (!item?.initial_state && position % 2 === 0);
  const [isFlipped, setIsFlipped] = useState(startsFlipped);

  // Debug logging
  console.log(`Position ${position}:`, {
    item: item ? {
      initial_state: item.initial_state,
      has_front_image: !!item.front_image_url,
      has_front_text: !!item.front_text,
      has_back_image: !!item.back_image_url,
      has_back_text: !!item.back_text
    } : 'no item',
    startsFlipped,
    isFlipped
  });

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

  return (
    <div 
      className="relative aspect-square group cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(!startsFlipped)}
      onMouseLeave={() => setIsFlipped(startsFlipped)}
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