import React, { useEffect, useState } from 'react';
import { Clock, Utensils, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { pageContentService } from '@/services/PageContentService';
import { Button } from '@/components/ui/button';

const ProtocolContent: React.FC = () => {
  const [pageContent, setPageContent] = useState({
    title: 'The FastNow Protocol',
    subtitle: 'How I Lost Fat With a 3-Day Fast + Calorie Control'
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await pageContentService.getPageContent('fastnow-protocol');
        if (content) {
          setPageContent({
            title: content.title || 'The FastNow Protocol',
            subtitle: content.subtitle || 'How I Lost Fat With a 3-Day Fast + Calorie Control'
          });
        }
      } catch (e) {
        console.error('Protocol content load error:', e);
      }
    };
    loadContent();
  }, []);

  return (
    <section id="fastnow-protocol" className="py-12 border-t">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{pageContent.title}</h2>
          <p className="text-muted-foreground">{pageContent.subtitle}</p>
        </div>

        {/* Quick nav */}
        <nav aria-label="On this page" className="mb-8">
          <ul className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <li><a href="#at-a-glance" className="story-link">At a glance</a></li>
            <li><a href="#start-today" className="story-link">Start today</a></li>
            <li><a href="#phase-1" className="story-link">Phase 1</a></li>
            <li><a href="#phase-2" className="story-link">Phase 2</a></li>
            <li><a href="#phase-3" className="story-link">Phase 3</a></li>
            <li><a href="#pitfalls" className="story-link">Common pitfalls</a></li>
          </ul>
        </nav>

        {/* At a glance */}
        <section id="at-a-glance" className="mb-10">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-2xl font-semibold mb-4">At a glance</h3>
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

        {/* Start today */}
        <section id="start-today" className="mb-10">
          <div className="bg-muted/40 rounded-lg p-6 border">
            <h3 className="text-2xl font-semibold mb-4">Start today in 3 steps</h3>
            <ol className="list-decimal pl-5 space-y-3 text-muted-foreground">
              <li>Pick your fast start time. Clear your kitchen of high-carb snacks.</li>
              <li>Choose a simple food list for Phase 2 and set your daily calorie cap.</li>
              <li>Schedule your 1.5h walking slots for the next 7 days on your calendar.</li>
            </ol>
          </div>
        </section>

        {/* Phase 1 */}
        <section id="phase-1" className="mb-10">
          <div className="bg-card rounded-lg p-8 border-l-4 border-blue-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">3-Day Initiation Water Fast</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <p className="text-foreground"><strong>Duration:</strong> 60–72 hours (3 days). My sweet spot: 60 hours.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-500" />Purpose</h4>
                <p>Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-500" />What to do</h4>
                <p>Drink water and black coffee. No food.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-blue-500" />What really happens</h4>
                <ul className="space-y-2">
                  <li><strong className="text-blue-600">Day 1 / Night 1:</strong> you burn stored sugar. Manageable.</li>
                  <li><strong className="text-orange-600">Day 2 / Night 2:</strong> the test. Cravings scream. Get past Night 2—the shift happens here.</li>
                  <li><strong className="text-green-600">60 hours:</strong> ignite point. Past 60, everything else is easier.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2 */}
        <section id="phase-2" className="mb-10">
          <div className="bg-card rounded-lg p-8 border-l-4 border-green-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">Strict Simple Diet + Daily Calorie Limit</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <p><strong>Duration:</strong> 30–60 days • <strong>Carb cap:</strong> ≤ 20–30g • <strong>Deficit:</strong> ~1,000 kcal/day</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-green-500" />Why 1,000—not 250 or 500?</h4>
                <p>Small deficits hide progress. A bigger daily deficit gives results you can feel in weeks 1–3.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" />What to eat (because of carbs, not macros)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>OK:</strong> cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.</li>
                  <li><strong>Drinks:</strong> water, coffee; I use cola zero types to stay on track.</li>
                  <li><strong>Avoid:</strong> bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and anything outside the list.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" />Tracking (do not skip this)</h4>
                <p>Track every single thing—app or paper. If you keep it in your head, you drift and stall.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3 */}
        <section id="phase-3" className="mb-10">
          <div className="bg-card rounded-lg p-8 border-l-4 border-orange-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">Daily Walking</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>Walk 1.5 hours daily. If you overeat, use walking as a recovery lever to claw back the deficit the same day.</p>
            </div>
          </div>
        </section>

        {/* Pitfalls */}
        <section id="pitfalls" className="mb-6">
          <div className="bg-muted/30 rounded-lg p-6 border">
            <h3 className="text-2xl font-semibold mb-4">Common pitfalls</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
              <li>Not tracking intake—“healthy” extras erase the deficit.</li>
              <li>Stopping at Night 2—push through to the shift.</li>
              <li>Trying to do everything at once—keep it simple.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProtocolContent;
