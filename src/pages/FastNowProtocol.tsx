import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

const FastNowProtocol = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>The FastNow Protocol | fastnow.app</title>
        <meta name="description" content="Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol" />
      </Helmet>
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              The FastNow Protocol
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              How I Lost Fat With a 3-Day Fast + Calorie Control
            </p>
          </div>

          {/* Phase 1: 3-Day Initiation Water Fast */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Phase 1: 3-Day Initiation Water Fast</h2>
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Duration:</strong> 72 hours (3 full days). My personal sweet spot is 60 hours.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Purpose:</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What to do:</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Drink water and black coffee. No food.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What really happens (and why it matters):</h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>Day 1 / Night 1:</strong> most people can push through; you're mostly burning stored sugar.
                    </p>
                    <p>
                      <strong>Day 2 / Night 2:</strong> this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you've done the real work; this is where the shift happens.
                    </p>
                    <p>
                      60 hours is my ignite point. Some go to 72. Past 60, everything else becomes child's play compared to Night 2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Strict Simple Diet + Daily Calorie Limit */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Phase 2: Strict Simple Diet + Daily Calorie Limit</h2>
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Duration:</strong> 30–60 days minimum.<br/>
                  <strong>Carb cap:</strong> ≤ 20–30 g net carbs/day.<br/>
                  <strong>Daily deficit (on purpose):</strong> ~1,000 kcal.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why 1,000—not 250 or 500?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don't change, and motivation dies right when you need proof it's working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How to set your limit:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                    <li>Baseline burn (BMR): from sex, age, height, weight.</li>
                    <li>Add activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).</li>
                    <li>Intake: (BMR + activity) – 1,000 = your calories to eat.</li>
                    <li><strong>Example:</strong> total burn ≈ 2,500 → eat ≈ 1,500 kcal.</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What to eat (because of carbs, not macros):</h3>
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      <strong>OK:</strong> cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      <strong>Drinks:</strong> water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light. I know some people hate sweeteners or say they're unhealthy. For me, they don't spike insulin and they keep me on track, so I use them. If you can do the same with just water/coffee/tea and stay motivated without overeating—great, do that.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      <strong>Avoid:</strong> bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tracking (do not skip this):</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Track every single thing—in the app or on paper.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it's healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit. Do that a few nights and you stall, get frustrated, and quit.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Recovery lever:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Daily Walking */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Phase 3: Daily Walking</h2>
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Rule:</strong> 1.5 hours every day (non-negotiable).
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why:</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    ~500 kcal/day for many people, better mood, stable energy, and it's the simplest thing most people will actually do consistently.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How to fit it in:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    End-of-day nature walks, lunch-break city loops, phone-call walks, errands on foot. Split it (45 + 45). Weekend hikes or 5-hour city days if you want extra. Walk—don't jog. Just hit 1.5 hours daily and let the math work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default FastNowProtocol;