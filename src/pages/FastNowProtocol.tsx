import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Utensils, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { pageContentService } from '@/services/PageContentService';
import InlineFAQ from '@/components/home/InlineFAQ';
import { Button } from '@/components/ui/button';

const FastNowProtocol = () => {
  const [pageContent, setPageContent] = useState({
    title: 'The FastNow Protocol',
    subtitle: 'How I Lost Fat With a 3-Day Fast + Calorie Control',
    metaTitle: 'The FastNow Protocol | FastNow',
    metaDescription: 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol'
  });
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanonicalUrl(window.location.href);
    }
  }, []);

  const loadContent = async () => {
    try {
      // Load page content from database
      const content = await pageContentService.getPageContent('fastnow-protocol');
      
      if (content) {
        setPageContent({
          title: content.title || 'The FastNow Protocol',
          subtitle: content.subtitle || 'How I Lost Fat With a 3-Day Fast + Calorie Control',
          metaTitle: content.meta_title || 'The FastNow Protocol | FastNow',
          metaDescription: content.meta_description || 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol'
        });
      }
    } catch (error) {
      console.error('Error loading FastNow Protocol page content:', error);
    }
  };

  const faqItems = [
    {
      q: "Do I have to fast for exactly 72 hours?",
      a: "No. Many start with shorter fasts and build up. The goal is momentum and consistency, not a perfect number."
    },
    {
      q: "Can I drink anything during Phase 1?",
      a: "Water and black coffee are the defaults. Keep it simple to reduce decision fatigue."
    },
    {
      q: "What if I overeat in Phase 2?",
      a: "Use Phase 3 (walking) as a recovery lever and get back on plan the same day."
    }
  ];

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: pageContent.title,
    description: pageContent.metaDescription,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Phase 1: 3-Day Initiation Water Fast',
        text: 'Fast for 60–72 hours with water and black coffee only. Expect a difficult Night 2; getting past it triggers the shift.'
      },
      {
        '@type': 'HowToStep',
        name: 'Phase 2: Strict Simple Diet + Daily Calorie Limit',
        text: 'For 30–60 days, cap carbs at 20–30g and maintain ~1,000 kcal daily deficit. Track everything you eat.'
      },
      {
        '@type': 'HowToStep',
        name: 'Phase 3: Daily Walking',
        text: 'Walk 1.5 hours every day. Use walking as a recovery lever to stay on target.'
      }
    ]
  } as const;

  return (
    <PageLayout>
      <Helmet>
        <title>{pageContent.metaTitle}</title>
        <meta name="description" content={pageContent.metaDescription} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
      </Helmet>

      <main className="flex-1 py-12 pb-28">
        <div className="container max-w-4xl mx-auto">
          <div>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {pageContent.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {pageContent.subtitle}
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label="On this page" className="mb-10">
            <ul className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <li><a href="#at-a-glance" className="story-link">At a glance</a></li>
              <li><a href="#start-today" className="story-link">Start today</a></li>
              <li><a href="#phase-1" className="story-link">Phase 1</a></li>
              <li><a href="#phase-2" className="story-link">Phase 2</a></li>
              <li><a href="#phase-3" className="story-link">Phase 3</a></li>
              <li><a href="#pitfalls" className="story-link">Common pitfalls</a></li>
              <li><a href="#faq" className="story-link">FAQ</a></li>
            </ul>
          </nav>

          {/* At a glance */}
          <section id="at-a-glance" className="mb-12">
            <div className="bg-card rounded-lg border shadow-soft p-6">
              <h2 className="text-2xl font-semibold mb-4">At a glance</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Kickstart</p>
                  <p className="text-lg font-medium">60–72h water fast</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Engine</p>
                  <p className="text-lg font-medium">~1,000 kcal daily deficit</p>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Movement</p>
                  <p className="text-lg font-medium">1.5h walk every day</p>
                </div>
              </div>
            </div>
          </section>

          {/* Start today in 3 steps */}
          <section id="start-today" className="mb-12">
            <div className="bg-muted/40 rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Start today in 3 steps</h2>
              <ol className="list-decimal pl-5 space-y-3 text-muted-foreground">
                <li>Pick your fast start time. Clear your kitchen of high-carb snacks.</li>
                <li>Choose a simple food list for Phase 2 and set your daily calorie cap.</li>
                <li>Schedule your 1.5h walking slots for the next 7 days on your calendar.</li>
              </ol>
              <div className="mt-5">
                <Button asChild>
                  <a href="/">Get FastNow free</a>
                </Button>
              </div>
            </div>
          </section>

          {/* Phase 1: 3-Day Initiation Water Fast */}
          <section id="phase-1" className="mb-12">
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
          </section>

          {/* Phase 2: Strict Simple Diet + Daily Calorie Limit */}
          <section id="phase-2" className="mb-12">
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
          </section>

          {/* Phase 3: Daily Walking */}
          <section id="phase-3" className="mb-12">
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
          {/* Common pitfalls */}
          <section id="pitfalls" className="mb-12">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Common pitfalls</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-destructive"></span><span>"Eyeballing" calories — track everything, even "healthy" extras.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-destructive"></span><span>Skipping walks — the easiest lever that keeps momentum.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-destructive"></span><span>Going too flexible too soon — keep Phase 2 simple for 30–60 days.</span></li>
              </ul>
            </div>
          </section>
          </section>
          </div>
        </div>

        <InlineFAQ title="Protocol FAQ" items={faqItems} />
        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="container mx-auto py-3 px-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Ready to start?</p>
              <Button asChild>
                <a href="/">Get FastNow</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default FastNowProtocol;