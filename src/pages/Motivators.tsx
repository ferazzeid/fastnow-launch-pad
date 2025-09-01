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
  const [userGender, setUserGender] = useState<string | undefined>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMotivators = async () => {
      try {
        const data = await MotivatorService.getUnifiedSystemGoals();
        setMotivators(data);
      } catch (error) {
        console.error('Error fetching motivators:', error);
        toast.error('Failed to load motivators');
      } finally {
        setLoading(false);
      }
    };

    fetchMotivators();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('sex')
            .eq('user_id', user.id)
            .single();
          
          setUserGender(profile?.sex);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Don't show toast for this, as it's optional
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const getImageForUser = (motivator: Motivator, userGender?: string) => {
    // If user gender is known, show appropriate image
    if (userGender === 'female' && motivator.female_image_url) {
      return motivator.female_image_url;
    }
    if (userGender === 'male' && motivator.male_image_url) {
      return motivator.male_image_url;
    }
    
    // For unknown gender, use hash-based selection for balanced distribution
    if (motivator.male_image_url && motivator.female_image_url) {
      // Use motivator ID to deterministically alternate between male/female images
      const usesFemaleImage = motivator.id.charCodeAt(0) % 2 === 0;
      return usesFemaleImage ? motivator.female_image_url : motivator.male_image_url;
    }
    
    // Fallback to any available image
    return motivator.male_image_url || motivator.female_image_url || motivator.image_url;
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

        {motivators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No motivators available at the moment.</p>
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