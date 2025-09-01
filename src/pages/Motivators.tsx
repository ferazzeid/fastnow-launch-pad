import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import LazyImage from '@/components/LazyImage';
import PageLayout from '@/components/layout/PageLayout';
import SEOHead from '@/components/SEOHead';
import { MotivatorService, Motivator } from '@/services/MotivatorService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Motivators: React.FC = () => {
  const [motivators, setMotivators] = useState<Motivator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userGender, setUserGender] = useState<string | undefined>();
  const { user } = useAuth();

  const fetchMotivators = async (attempt = 1) => {
    const maxRetries = 3;
    console.log(`[Motivators] Fetching motivators (attempt ${attempt}/${maxRetries})...`);
    
    try {
      setError(null);
      console.log('[Motivators] About to call MotivatorService.getUnifiedSystemGoals()...');
      const data = await MotivatorService.getUnifiedSystemGoals();
      console.log('[Motivators] Service response received:', {
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        titles: data?.map(m => m?.title) || 'no data'
      });
      
      if (!data || !Array.isArray(data)) {
        console.error('[Motivators] Invalid data structure received:', data);
        throw new Error('Invalid data structure received from service');
      }
      
      console.log(`[Motivators] Successfully fetched ${data.length} motivators:`, data.map(m => m.title));
      setMotivators(data);
      setRetryCount(0);
    } catch (error) {
      console.error(`[Motivators] Error fetching motivators (attempt ${attempt}):`, error);
      
      if (attempt < maxRetries) {
        console.log(`[Motivators] Retrying in 1 second...`);
        setRetryCount(attempt);
        setTimeout(() => fetchMotivators(attempt + 1), 1000);
      } else {
        const errorMessage = 'Failed to load motivators after multiple attempts';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      if (attempt === 1 || attempt >= maxRetries) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Add a small delay to ensure auth is initialized
    const timer = setTimeout(() => {
      fetchMotivators();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          console.log(`[Motivators] Fetching user profile for gender...`);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('sex')
            .eq('user_id', user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          console.log(`[Motivators] User gender: ${profile?.sex || 'unknown'}`);
          setUserGender(profile?.sex);
        } catch (error) {
          console.error('[Motivators] Error fetching user profile:', error);
          // Don't show toast for this, as it's optional
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const getImageForUser = (motivator: Motivator, userGender?: string) => {
    // Always use hash-based selection for balanced distribution regardless of user gender
    if (motivator.male_image_url && motivator.female_image_url) {
      // Use motivator ID to deterministically alternate between male/female images
      const usesFemaleImage = motivator.id.charCodeAt(0) % 2 === 0;
      console.log(`[Motivators] Image selection for "${motivator.title}": ${usesFemaleImage ? 'female' : 'male'} (ID hash: ${motivator.id.charCodeAt(0)})`);
      return usesFemaleImage ? motivator.female_image_url : motivator.male_image_url;
    }
    
    // Fallback to any available image if only one gender is available
    const fallbackImage = motivator.male_image_url || motivator.female_image_url || motivator.image_url;
    console.log(`[Motivators] Fallback image for "${motivator.title}": ${fallbackImage ? 'found' : 'none'}`);
    return fallbackImage;
  };

  const seoConfig = {
    title: 'Motivators - Find Your Fasting Inspiration',
    description: 'Discover powerful motivators and goals to keep you inspired on your fasting journey. Personal stories, tips, and motivation to help you succeed.',
    keywords: 'fasting motivation, intermittent fasting goals, fasting inspiration, weight loss motivation',
    canonical: '/motivators',
    type: 'website' as const,
  };

  if (loading) {
    return (
      <PageLayout>
        <SEOHead config={seoConfig} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
              {retryCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Retrying... (attempt {retryCount + 1}/3)
                </p>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEOHead config={seoConfig} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Motivation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover powerful goals and inspiration to keep you motivated on your fasting journey. 
            Each motivator tells a story that could be yours.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-destructive text-lg">{error}</p>
            <button 
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchMotivators();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : motivators.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-lg">No motivators available at the moment.</p>
            <button 
              onClick={() => {
                setLoading(true);
                fetchMotivators();
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {motivators.map((motivator) => (
              <Link 
                key={motivator.id} 
                to={`/motivators/${motivator.slug}`}
                className="group block transition-transform duration-200 hover:scale-105"
              >
                <Card className="h-full overflow-hidden border-border hover:shadow-lg transition-shadow duration-200">
                  {getImageForUser(motivator, userGender) && (
                    <div className="aspect-video overflow-hidden">
                      <LazyImage
                        src={getImageForUser(motivator, userGender)}
                        alt={motivator.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {motivator.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {motivator.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    {motivator.category && (
                      <div className="mt-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {motivator.category}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Motivators;