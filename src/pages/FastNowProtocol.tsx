import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Utensils, Activity, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import ProtocolPhasesIntro from '@/components/fasting/ProtocolPhasesIntro';
import { supabase } from '@/integrations/supabase/client';

const FastNowProtocol = () => {
  const [pageContent, setPageContent] = useState({
    title: 'The FastNow Protocol',
    subtitle: 'How I Lost Fat With a 3-Day Fast + Calorie Control',
    content: '',
    metaTitle: 'The FastNow Protocol | FastNow',
    metaDescription: 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol',
    featuredImage: ''
  });
  
  const [phaseContent, setPhaseContent] = useState({
    phase1: {
      title: '3-Day Initiation Water Fast',
      duration: '60 hours',
      purpose: 'Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.',
      instructions: 'Drink water and black coffee. No food.',
      details: 'Night Zero: The easiest to start a water fast is to start at night after eating and then go to sleep and that\'s the first 10 hours of fasting that you have under your belt and that creates momentum to continue next day.\n\nDay 1 / Night 1: most people can push through; you\'re mostly burning stored sugar.\n\nDay 2 / Night 2: this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you\'ve done the real work; this is where the shift happens.',
      image: ''
    },
    phase2: {
      title: 'Strict Simple Diet + Daily Calorie Limit',
      duration: '30–60 days minimum.',
      carbCap: '≤ 30g net carbs/day.',
      deficit: 'Calorie deficit ideally 1000 calories (120 grams of fat)',
      whyDeficit: 'Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don\'t change, and motivation dies right when you need proof it\'s working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.',
      howToSet: 'Baseline burn (BMR): from sex, age, height, weight.\nAdd activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).\nIntake: (BMR + activity) – 1,000 = your calories to eat.\nExample: total burn ≈ 2,500 → eat ≈ 1,500 kcal',
      whatToEat: 'OK: cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.\nDrinks: water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light.\nAvoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.',
      tracking: 'Track every single thing—in the app or on paper. If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it\'s healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit.',
      recovery: 'If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.',
      image: ''
    },
    phase3: {
      title: 'Daily Walking',
      rule: '90 minutes every day (non-negotiable).',
      why: '~500 kcal/day for many people, better mood, stable energy, and it\'s the simplest thing most people will actually do consistently.',
      howToFit: 'While walking: Listen to podcasts, audiobooks, or music. Make it your think time.',
      image: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Initialize default content in database if it doesn't exist
      await initializeDefaultContent();
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'protocol_title', 'protocol_subtitle', 'protocol_content', 'protocol_featured_image',
          'protocol_meta_title', 'protocol_meta_description',
          'protocol_phase1_title', 'protocol_phase1_duration', 'protocol_phase1_purpose', 
          'protocol_phase1_instructions', 'protocol_phase1_details', 'protocol_phase1_image',
          'protocol_phase1_intro_image', 'protocol_phase2_intro_image', 'protocol_phase3_intro_image',
          'protocol_phase2_title', 'protocol_phase2_duration', 'protocol_phase2_carb_cap',
          'protocol_phase2_deficit', 'protocol_phase2_why_deficit', 'protocol_phase2_how_to_set',
          'protocol_phase2_what_to_eat', 'protocol_phase2_tracking', 'protocol_phase2_recovery', 'protocol_phase2_image',
          'protocol_phase3_title', 'protocol_phase3_rule', 'protocol_phase3_why', 'protocol_phase3_how_to_fit', 'protocol_phase3_image'
        ]);

      if (error) {
        console.error('Error fetching protocol settings:', error);
        setIsLoading(false);
        return;
      }

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      // Update page content - use database values if they exist, otherwise keep defaults
      setPageContent({
        title: settings.protocol_title || pageContent.title,
        subtitle: settings.protocol_subtitle || pageContent.subtitle,
        content: settings.protocol_content || '',
        metaTitle: settings.protocol_meta_title || `${settings.protocol_title || pageContent.title} | FastNow`,
        metaDescription: settings.protocol_meta_description || settings.protocol_subtitle || pageContent.metaDescription,
        featuredImage: settings.protocol_featured_image || ''
      });
      
      // Update phase content with database values
      setPhaseContent({
        phase1: {
          title: settings.protocol_phase1_title || phaseContent.phase1.title,
          duration: settings.protocol_phase1_duration || phaseContent.phase1.duration,
          purpose: settings.protocol_phase1_purpose || phaseContent.phase1.purpose,
          instructions: settings.protocol_phase1_instructions || phaseContent.phase1.instructions,
          details: settings.protocol_phase1_details || phaseContent.phase1.details,
          image: settings.protocol_phase1_image || ''
        },
        phase2: {
          title: settings.protocol_phase2_title || phaseContent.phase2.title,
          duration: settings.protocol_phase2_duration || phaseContent.phase2.duration,
          carbCap: settings.protocol_phase2_carb_cap || phaseContent.phase2.carbCap,
          deficit: settings.protocol_phase2_deficit || phaseContent.phase2.deficit,
          whyDeficit: settings.protocol_phase2_why_deficit || phaseContent.phase2.whyDeficit,
          howToSet: settings.protocol_phase2_how_to_set || phaseContent.phase2.howToSet,
          whatToEat: settings.protocol_phase2_what_to_eat || phaseContent.phase2.whatToEat,
          tracking: settings.protocol_phase2_tracking || phaseContent.phase2.tracking,
          recovery: settings.protocol_phase2_recovery || phaseContent.phase2.recovery,
          image: settings.protocol_phase2_image || ''
        },
        phase3: {
          title: settings.protocol_phase3_title || phaseContent.phase3.title,
          rule: settings.protocol_phase3_rule || phaseContent.phase3.rule,
          why: settings.protocol_phase3_why || phaseContent.phase3.why,
          howToFit: settings.protocol_phase3_how_to_fit || phaseContent.phase3.howToFit,
          image: settings.protocol_phase3_image || ''
        }
      });
    } catch (error) {
      console.error('Error loading FastNow Protocol page content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultContent = async () => {
    try {
      // Check if any protocol content exists
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('setting_key')
        .eq('setting_key', 'protocol_title')
        .maybeSingle();

      // If no content exists, initialize with defaults
      if (!existingData) {
        const defaultSettings = [
          { setting_key: 'protocol_title', setting_value: JSON.stringify(pageContent.title) },
          { setting_key: 'protocol_subtitle', setting_value: JSON.stringify(pageContent.subtitle) },
          { setting_key: 'protocol_meta_title', setting_value: JSON.stringify(pageContent.metaTitle) },
          { setting_key: 'protocol_meta_description', setting_value: JSON.stringify(pageContent.metaDescription) },
          { setting_key: 'protocol_content', setting_value: JSON.stringify('') },
          { setting_key: 'protocol_featured_image', setting_value: JSON.stringify('') },
          // Phase 1 defaults
          { setting_key: 'protocol_phase1_title', setting_value: JSON.stringify(phaseContent.phase1.title) },
          { setting_key: 'protocol_phase1_duration', setting_value: JSON.stringify(phaseContent.phase1.duration) },
          { setting_key: 'protocol_phase1_purpose', setting_value: JSON.stringify(phaseContent.phase1.purpose) },
          { setting_key: 'protocol_phase1_instructions', setting_value: JSON.stringify(phaseContent.phase1.instructions) },
          { setting_key: 'protocol_phase1_details', setting_value: JSON.stringify(phaseContent.phase1.details) },
          // Phase 2 defaults
          { setting_key: 'protocol_phase2_title', setting_value: JSON.stringify(phaseContent.phase2.title) },
          { setting_key: 'protocol_phase2_duration', setting_value: JSON.stringify(phaseContent.phase2.duration) },
          { setting_key: 'protocol_phase2_carb_cap', setting_value: JSON.stringify(phaseContent.phase2.carbCap) },
          { setting_key: 'protocol_phase2_deficit', setting_value: JSON.stringify(phaseContent.phase2.deficit) },
          { setting_key: 'protocol_phase2_why_deficit', setting_value: JSON.stringify(phaseContent.phase2.whyDeficit) },
          { setting_key: 'protocol_phase2_how_to_set', setting_value: JSON.stringify(phaseContent.phase2.howToSet) },
          { setting_key: 'protocol_phase2_what_to_eat', setting_value: JSON.stringify(phaseContent.phase2.whatToEat) },
          { setting_key: 'protocol_phase2_tracking', setting_value: JSON.stringify(phaseContent.phase2.tracking) },
          { setting_key: 'protocol_phase2_recovery', setting_value: JSON.stringify(phaseContent.phase2.recovery) },
          // Phase 3 defaults
          { setting_key: 'protocol_phase3_title', setting_value: JSON.stringify(phaseContent.phase3.title) },
          { setting_key: 'protocol_phase3_rule', setting_value: JSON.stringify(phaseContent.phase3.rule) },
          { setting_key: 'protocol_phase3_why', setting_value: JSON.stringify(phaseContent.phase3.why) },
          { setting_key: 'protocol_phase3_how_to_fit', setting_value: JSON.stringify(phaseContent.phase3.howToFit) }
        ];

        for (const setting of defaultSettings) {
          await supabase
            .from('site_settings')
            .upsert(setting, { 
              onConflict: 'setting_key',
              ignoreDuplicates: false 
            });
        }
        
        console.log('Initialized default FastNow Protocol content in database');
      }
    } catch (error) {
      console.error('Error initializing default content:', error);
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
        <PageFeaturedImage pageKey="fast-now-protocol" className="w-full h-full object-cover" showDarkBackground={true} />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-start pt-16 md:pt-24 justify-start">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-left max-w-3xl">
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                {pageContent.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 drop-shadow-md">
                {pageContent.subtitle}
              </p>
              <div className="mt-6 text-white/90 space-y-4 drop-shadow-md">
                <p>
                  Most programs tell you to do a little bit every day, wait a year or two, and call it "healthy and steady." The logic is fine — but if I don't see results quickly, I lose interest.
                </p>
                <p>
                  I'd rather put in serious energy at the start, get solid results in the first 2–12 weeks, and build momentum I can ride. Once that momentum is there, I can ease into something sustainable. But without an early push, everyday life takes over — and the goal slips away.
                </p>
              </div>
              
              {/* Launch App Button */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <button className="bg-accent-green hover:bg-accent-green-dark text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2">
                  Launch App
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Phases Introduction */}
      <ProtocolPhasesIntro />

      {/* Content Section */}
      <div className="relative z-10 bg-background">
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-8">
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
                    <div className="bg-card rounded-lg shadow-soft overflow-hidden border-l-4 border-blue-500">
                      {phaseContent.phase1.image && (
                        <div className="mb-8 -m-8 mt-0 mx-0">
                          <img 
                            src={phaseContent.phase1.image} 
                            alt="Phase 1 - 3-Day Water Fast" 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="px-8 pb-8">
                        <div className="bg-black text-white p-6 -m-8 mb-6 flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-full">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                            <h2 className="text-3xl font-bold mt-2 text-white">{phaseContent.phase1.title}</h2>
                          </div>
                        </div>
                      
                        {/* Fasting Timeline */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg mb-6">
                          <h3 className="text-lg font-semibold mb-4 text-center text-foreground">60-Hour Fast Timeline</h3>
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute top-8 left-0 right-0 h-0.5 bg-blue-300"></div>
                            
                            {/* Timeline points */}
                            <div className="flex justify-between relative z-10">
                              <div className="text-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                                <div className="text-sm font-medium text-foreground">Start</div>
                                <div className="text-xs text-muted-foreground">Hour 0</div>
                              </div>
                              <div className="text-center">
                                <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-2"></div>
                                <div className="text-sm font-medium text-foreground">Day 1</div>
                                <div className="text-xs text-muted-foreground">Hour 24</div>
                              </div>
                              <div className="text-center">
                                <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                                <div className="text-sm font-medium text-foreground">Night 2</div>
                                <div className="text-xs text-muted-foreground">Hour 48</div>
                              </div>
                              <div className="text-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                                <div className="text-sm font-medium text-foreground">Complete</div>
                                <div className="text-xs text-muted-foreground">Hour 60</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Duration</h3>
                            <p className="text-muted-foreground">{phaseContent.phase1.duration}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Purpose</h3>
                            <p className="text-muted-foreground">{phaseContent.phase1.purpose}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Instructions</h3>
                            <p className="text-muted-foreground">{phaseContent.phase1.instructions}</p>
                          </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-foreground mb-2">What to Expect</h4>
                          <div className="text-muted-foreground text-sm space-y-2">
                            {phaseContent.phase1.details.split('\n\n').map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: Strict Simple Diet + Daily Calorie Limit */}
                  <div className="mb-12">
                    <div className="bg-card rounded-lg shadow-soft overflow-hidden border-l-4 border-orange-500">
                      {phaseContent.phase2.image && (
                        <div className="mb-8 -m-8 mt-0 mx-0">
                          <img 
                            src={phaseContent.phase2.image} 
                            alt="Phase 2 - Diet and Calorie Control" 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="px-8 pb-8">
                        <div className="bg-black text-white p-6 -m-8 mb-6 flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-full">
                            <Utensils className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                            <h2 className="text-3xl font-bold mt-2 text-white">{phaseContent.phase2.title}</h2>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Duration</h3>
                            <p className="text-muted-foreground">{phaseContent.phase2.duration}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Carb Cap</h3>
                            <p className="text-muted-foreground">{phaseContent.phase2.carbCap}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Calorie Deficit</h3>
                            <p className="text-muted-foreground">{phaseContent.phase2.deficit}</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Why This Deficit?</h3>
                            <p className="text-muted-foreground">{phaseContent.phase2.whyDeficit}</p>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">How to Set Your Calories</h3>
                            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                              {phaseContent.phase2.howToSet}
                            </pre>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">What to Eat</h3>
                            <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {phaseContent.phase2.whatToEat}
                            </pre>
                          </div>

                          <div className="bg-muted rounded-lg p-4">
                            <h4 className="font-semibold text-foreground mb-2">Critical: Track Everything</h4>
                            <p className="text-muted-foreground text-sm">{phaseContent.phase2.tracking}</p>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Recovery Plan</h3>
                            <p className="text-muted-foreground">{phaseContent.phase2.recovery}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3: Daily Walking */}
                  <div className="mb-12">
                    <div className="bg-card rounded-lg shadow-soft overflow-hidden border-l-4 border-green-500">
                      {phaseContent.phase3.image && (
                        <div className="mb-8 -m-8 mt-0 mx-0">
                          <img 
                            src={phaseContent.phase3.image} 
                            alt="Phase 3 - Daily Walking" 
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="px-8 pb-8">
                        <div className="bg-black text-white p-6 -m-8 mb-6 flex items-center gap-4">
                          <div className="bg-white/10 p-3 rounded-full">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                            <h2 className="text-3xl font-bold mt-2 text-white">{phaseContent.phase3.title}</h2>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="bg-muted p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">The Rule</h3>
                            <p className="text-xl font-medium text-foreground">{phaseContent.phase3.rule}</p>
                          </div>

                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Why Walking?</h3>
                            <p className="text-muted-foreground">{phaseContent.phase3.why}</p>
                          </div>

                          <div className="bg-muted rounded-lg p-4">
                            <p className="text-muted-foreground">{phaseContent.phase3.howToFit}</p>
                          </div>
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
