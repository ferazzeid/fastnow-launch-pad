import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import SEOHead from '@/components/SEOHead';
import { MotivatorService, Motivator } from '@/services/MotivatorService';
import { toast } from 'sonner';

const MotivatorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [motivator, setMotivator] = useState<Motivator | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMotivator = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await MotivatorService.getMotivatorBySlug(slug);
        if (data) {
          setMotivator(data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching motivator:', error);
        toast.error('Failed to load motivator');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMotivator();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="aspect-video bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !motivator) {
    return (
      <PageLayout>
        <SEOHead config={{
          title: 'Motivator Not Found',
          description: 'The motivator you are looking for could not be found.',
          canonical: `/motivators/${slug}`,
          type: 'website' as const,
        }} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Motivator Not Found</h1>
          <p className="text-muted-foreground mb-8">The motivator you are looking for could not be found.</p>
          <Link to="/motivators">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Motivators
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const seoConfig = {
    title: motivator.meta_title || motivator.title,
    description: motivator.meta_description || motivator.content.replace(/<[^>]*>/g, '').substring(0, 160),
    keywords: `fasting motivation, ${motivator.category}, intermittent fasting, ${motivator.title}`,
    canonical: `/motivators/${motivator.slug}`,
    type: 'article' as const,
    image: motivator.image_url,
    author: 'FastNow Team',
    publishedTime: motivator.created_at,
    modifiedTime: motivator.updated_at,
  };

  return (
    <PageLayout>
      <SEOHead config={seoConfig} />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/motivators"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Motivators
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {motivator.title}
          </h1>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: motivator.content }}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to Start Your Journey?
          </h3>
          <p className="text-muted-foreground mb-4">
            Use this motivation to power your fasting goals and achieve the results you deserve.
          </p>
          <Link to="/fastnow-protocol">
            <Button size="lg" className="mr-4">
              Start Fasting Protocol
            </Button>
          </Link>
          <Link to="/motivators">
            <Button variant="outline" size="lg">
              Explore More Motivators
            </Button>
          </Link>
        </div>
      </article>
    </PageLayout>
  );
};

export default MotivatorDetail;