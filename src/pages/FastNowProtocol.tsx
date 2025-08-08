import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Utensils, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { supabase } from '@/integrations/supabase/client';

const FastNowProtocol = () => {
  const [pageContent, setPageContent] = useState({
    title: 'The FastNow Protocol',
    subtitle: 'How I Lost Fat With a 3-Day Fast + Calorie Control',
    content: '',
    metaTitle: 'The FastNow Protocol | FastNow',
    metaDescription: 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['protocol_title', 'protocol_subtitle', 'protocol_content']);

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      if (settings.protocol_title || settings.protocol_subtitle || settings.protocol_content) {
        setPageContent({
          title: settings.protocol_title || 'The FastNow Protocol',
          subtitle: settings.protocol_subtitle || 'How I Lost Fat With a 3-Day Fast + Calorie Control',
          content: settings.protocol_content || '',
          metaTitle: `${settings.protocol_title || 'The FastNow Protocol'} | FastNow`,
          metaDescription: settings.protocol_subtitle || 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol'
        });
      }
    } catch (error) {
      console.error('Error loading FastNow Protocol page content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{pageContent.metaTitle}</title>
        <meta name="description" content={pageContent.metaDescription} />
      </Helmet>
      
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <PageFeaturedImage pageKey="fast-now-protocol" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-start">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-left max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              {pageContent.title}
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
              {pageContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-10 bg-background">
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto">
            <div>
              {/* Dynamic Content */}
              {pageContent.content && (
                <div className="prose prose-lg max-w-none mb-12">
                  {formatContent(pageContent.content)}
                </div>
              )}

            {/* Default content if no custom content is provided */}
            {!pageContent.content && (
              <>
                {/* Phase 1: 3-Day Initiation Water Fast */}
                <div className="mb-12">
                  <div className="bg-card rounded-lg shadow-soft p-8 border-l-4 border-blue-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-blue-500/10 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                        <h2 className="text-3xl font-bold mt-2 text-foreground">3-Day Initiation Water Fast</h2>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-4">
                        <p className="text-lg text-foreground">
                          <strong>Duration:</strong> <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">72 hours</span> (3 full days). My personal sweet spot is <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm font-bold">60 hours</span>.
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                          Purpose:
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.
                        </p>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                          What to do:
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Drink water and black coffee. No food.
                        </p>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-blue-500" />
                          What really happens (and why it matters):
                        </h3>
                        <div className="space-y-4 text-muted-foreground">
                          <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 p-4 rounded-lg border-l-2 border-blue-300">
                            <p>
                              <strong className="text-blue-600">Day 1 / Night 1:</strong> most people can push through; you're mostly burning stored sugar.
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 p-4 rounded-lg border-l-2 border-orange-300">
                            <p>
                              <strong className="text-orange-600">Day 2 / Night 2:</strong> this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you've done the real work; this is where the shift happens.
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 p-4 rounded-lg border-l-2 border-green-300">
                            <p>
                              <strong className="text-green-600">60 hours</strong> is my ignite point. Some go to 72. Past 60, everything else becomes child's play compared to Night 2.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 2: Strict Simple Diet + Daily Calorie Limit */}
                <div className="mb-12">
                  <div className="bg-card rounded-lg shadow-soft p-8 border-l-4 border-green-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-green-500/10 p-3 rounded-full">
                        <Utensils className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                        <h2 className="text-3xl font-bold mt-2 text-foreground">Strict Simple Diet + Daily Calorie Limit</h2>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg mb-4">
                        <div className="grid md:grid-cols-3 gap-4 text-lg text-foreground">
                          <div>
                            <strong>Duration:</strong> <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">30–60 days</span> minimum.
                          </div>
                          <div>
                            <strong>Carb cap:</strong> <span className="bg-green-400 text-white px-2 py-1 rounded text-sm font-bold">≤ 20–30g</span> net carbs/day.
                          </div>
                          <div>
                            <strong>Daily deficit:</strong> <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">~1,000 kcal</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-green-500" />
                          Why 1,000—not 250 or 500?
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don't change, and motivation dies right when you need proof it's working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.
                        </p>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          How to set your limit:
                        </h3>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted-foreground">Baseline burn (BMR): from sex, age, height, weight.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted-foreground">Add activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted-foreground">Intake: (BMR + activity) – 1,000 = your calories to eat.</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                            <p className="text-foreground"><strong>Example:</strong> total burn ≈ <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">2,500</span> → eat ≈ <span className="bg-green-400 text-white px-2 py-1 rounded text-sm">1,500 kcal</span></p>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-green-500" />
                          What to eat (because of carbs, not macros):
                        </h3>
                        <div className="mb-6 space-y-4">
                          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                            <p className="text-foreground mb-2"><strong className="text-green-600">OK:</strong></p>
                            <p className="text-muted-foreground">cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.</p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <p className="text-foreground mb-2"><strong className="text-blue-600">Drinks:</strong></p>
                            <p className="text-muted-foreground">water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light. I know some people hate sweeteners or say they're unhealthy. For me, they don't spike insulin and they keep me on track, so I use them. If you can do the same with just water/coffee/tea and stay motivated without overeating—great, do that.</p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                            <p className="text-foreground mb-2"><strong className="text-red-600">Avoid:</strong></p>
                            <p className="text-muted-foreground">bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.</p>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          Tracking (do not skip this):
                        </h3>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg mb-4">
                          <p className="text-foreground mb-3 font-medium">Track every single thing—in the app or on paper.</p>
                          <p className="text-muted-foreground">
                            If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it's healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit. Do that a few nights and you stall, get frustrated, and quit.
                          </p>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Recovery lever:
                        </h3>
                        <p className="text-muted-foreground">
                          If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3: Daily Walking */}
                <div className="mb-12">
                  <div className="bg-card rounded-lg shadow-soft p-8 border-l-4 border-orange-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-orange-500/10 p-3 rounded-full">
                        <Activity className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                        <h2 className="text-3xl font-bold mt-2 text-foreground">Daily Walking</h2>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg mb-4">
                        <p className="text-lg text-foreground">
                          <strong>Rule:</strong> <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">1.5 hours</span> every day (non-negotiable).
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                          Why:
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm font-bold">~500 kcal/day</span> for many people, better mood, stable energy, and it's the simplest thing most people will actually do consistently.
                        </p>
                        
                        <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Activity className="w-5 h-5 text-orange-500" />
                          How to fit it in:
                        </h3>
                        <p className="text-muted-foreground">
                          End-of-day nature walks, lunch-break city loops, phone-call walks, errands on foot. Split it (<span className="bg-orange-400 text-white px-1 py-0.5 rounded text-xs">45 + 45</span>). Weekend hikes or 5-hour city days if you want extra. Walk—don't jog. Just hit 1.5 hours daily and let the math work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default FastNowProtocol;