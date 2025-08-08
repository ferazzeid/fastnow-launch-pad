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
    <section id="fastnow-protocol" className="py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{pageContent.title}</h2>
          <p className="text-muted-foreground">{pageContent.subtitle}</p>
        </div>

        {/* Visual map of the protocol */}
        <div className="mb-10">
          {/* Desktop horizontal stepper */}
          <div className="hidden md:flex items-center gap-3">
            {[
              { id: 'at-a-glance', label: 'At a glance', Icon: CheckCircle },
              { id: 'start-today', label: 'Start today', Icon: CheckCircle },
              { id: 'phase-1', label: 'Fast 60 hours', Icon: Clock },
              { id: 'phase-2', label: 'Simple diet + deficit', Icon: Utensils },
              { id: 'phase-3', label: 'Walk 1.5h/day', Icon: Activity },
            ].map((step, i, arr) => (
              <React.Fragment key={step.id}>
                <a href={`#${step.id}`} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <step.Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-foreground">{step.label}</span>
                </a>
                {i < arr.length - 1 && <div className="flex-1 border-t border-dashed border-border" />}
              </React.Fragment>
            ))}
          </div>
          {/* Mobile vertical list */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {[
              { id: 'at-a-glance', label: 'At a glance', Icon: CheckCircle },
              { id: 'start-today', label: 'Start today', Icon: CheckCircle },
              { id: 'phase-1', label: 'Fast 60 hours', Icon: Clock },
              { id: 'phase-2', label: 'Simple diet + deficit', Icon: Utensils },
              { id: 'phase-3', label: 'Walk 1.5h/day', Icon: Activity },
            ].map((step) => (
              <a key={step.id} href={`#${step.id}`} className="flex items-center gap-3 rounded-lg border p-3 bg-card">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <step.Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-foreground">{step.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick nav */}
        <nav aria-label="On this page" className="mb-8">
          <ul className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <li><a href="#at-a-glance" className="story-link">At a glance</a></li>
            <li><a href="#start-today" className="story-link">Start today</a></li>
            <li><a href="#phase-1" className="story-link">Phase 1</a></li>
            <li><a href="#phase-2" className="story-link">Phase 2</a></li>
            <li><a href="#phase-3" className="story-link">Phase 3</a></li>
          </ul>
        </nav>

        {/* At a glance */}
        <section id="at-a-glance" className="mb-10">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-2xl font-semibold mb-2">At a glance</h3>
            <p className="text-lg md:text-xl font-medium text-foreground">60-hour water fast</p>
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
          <div className="bg-card rounded-lg p-8 border-l-4 border-primary">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">60-Hour Water Fast</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground"><strong>Duration:</strong> 60 hours.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Purpose</h4>
                <p>Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />What to do</h4>
                <p>Drink water and black coffee. No food.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-primary" />What really happens</h4>
                <ul className="space-y-2">
                  <li><strong className="text-foreground">Day 1 / Night 1:</strong> you burn stored sugar. Manageable.</li>
                  <li><strong className="text-foreground">Day 2 / Night 2:</strong> the test. Cravings scream. Get past Night 2—the shift happens here.</li>
                  <li><strong className="text-foreground">60 hours:</strong> ignite point. Past 60, everything else is easier.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2 */}
        <section id="phase-2" className="mb-10">
          <div className="bg-card rounded-lg p-8 border-l-4 border-primary">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">Strict Simple Diet + Daily Calorie Limit</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Duration:</strong> 30–60 days • <strong>Carb cap:</strong> ≤ 20–30g • <strong>Deficit:</strong> ~1,000 kcal/day</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-primary" />Why 1,000—not 250 or 500?</h4>
                <p>Small deficits hide progress. A bigger daily deficit gives results you can feel in weeks 1–3.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />What to eat (because of carbs, not macros)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>OK:</strong> cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.</li>
                  <li><strong>Drinks:</strong> water, coffee; I use cola zero types to stay on track.</li>
                  <li><strong>Avoid:</strong> bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and anything outside the list.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-primary" />Tracking (do not skip this)</h4>
                <p>Track every single thing—app or paper. If you keep it in your head, you drift and stall.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3 */}
        <section id="phase-3" className="mb-10">
          <div className="bg-card rounded-lg p-8 border-l-4 border-primary">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">Daily Walking</h3>
              </div>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>Walk 1.5 hours daily. If you overeat, use walking as a recovery lever to claw back the deficit the same day.</p>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
};

export default ProtocolContent;
