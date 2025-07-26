import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

const MyFoodSelection = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>My Food Selection - Current Protocol Implementation</title>
        <meta name="description" content="Specific examples of my current food choices and daily routine while following the Fast Now Protocol." />
      </Helmet>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              My Food Selection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real examples of what I'm eating right now while following my own protocol - 
              practical, simple, and effective choices that work for me.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <div className="bg-accent-green/5 border border-accent-green/20 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Approach</h2>
              <p>
                This is what I'm doing right now, as I write this. It's not a prescription for everyone - 
                it's simply what's working for me at this moment in my journey. Use it as an example, 
                adapt what makes sense for your situation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Routine</h3>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <strong className="text-gray-900">Morning:</strong>
                    <p>Water, black coffee (no additions)</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Afternoon (First Meal):</strong>
                    <p>Usually around 2-3 PM when hunger actually appears</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Evening (Second Meal):</strong>
                    <p>Around 7-8 PM, keeping portions controlled</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Daily Walk:</strong>
                    <p>45-60 minutes, usually after the first meal</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Food Philosophy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Simple ingredients:</strong> Less processing, more clarity</li>
                  <li>• <strong>Portion awareness:</strong> Quality over quantity</li>
                  <li>• <strong>Limited variety:</strong> Reduces decision fatigue</li>
                  <li>• <strong>Consistent timing:</strong> Eating when actually hungry</li>
                  <li>• <strong>No snacking:</strong> Clear meal boundaries</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Food Choices</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Typical First Meal (Afternoon)</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="border-l-4 border-accent-green pl-4">
                    <p className="font-medium">Protein Base:</p>
                    <p>• Grilled chicken breast (100-150g)</p>
                    <p>• Or: Fish fillet (salmon, cod)</p>
                    <p>• Or: 2-3 eggs, scrambled or boiled</p>
                  </div>
                  <div className="border-l-4 border-accent-green pl-4">
                    <p className="font-medium">Vegetables:</p>
                    <p>• Large mixed salad (cucumber, tomato, lettuce)</p>
                    <p>• Or: Steamed broccoli/cauliflower</p>
                    <p>• Small amount of olive oil for dressing</p>
                  </div>
                  <div className="border-l-4 border-accent-green pl-4">
                    <p className="font-medium">Occasional Addition:</p>
                    <p>• Small portion of rice (50g dry weight)</p>
                    <p>• Or: Sweet potato (1 medium)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Typical Second Meal (Evening)</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="border-l-4 border-accent-green pl-4">
                    <p className="font-medium">Light Protein:</p>
                    <p>• Greek yogurt (plain, unsweetened)</p>
                    <p>• Or: Small piece of cheese</p>
                    <p>• Or: Handful of nuts (almonds, walnuts)</p>
                  </div>
                  <div className="border-l-4 border-accent-green pl-4">
                    <p className="font-medium">Vegetables/Fruit:</p>
                    <p>• Apple or pear</p>
                    <p>• Or: Small salad</p>
                    <p>• Or: Vegetable soup (homemade)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Principles I Follow</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Portion Control</h4>
                  <p className="text-gray-700 text-sm">
                    I use my hand as a guide: palm-sized protein, fist-sized vegetables, 
                    thumb-sized fats. Simple, no weighing required.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Meal Timing</h4>
                  <p className="text-gray-700 text-sm">
                    I eat when genuinely hungry, not by the clock. Usually this means 
                    8-10 hours between meals.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Food Quality</h4>
                  <p className="text-gray-700 text-sm">
                    I choose foods I can pronounce the ingredients of. Less packaging, 
                    more real food.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hydration</h4>
                  <p className="text-gray-700 text-sm">
                    Water throughout the day, black coffee in the morning. No liquid calories 
                    except occasional herbal tea.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">What I Avoid</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Processed Foods</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Packaged snacks</li>
                  <li>• Ready meals</li>
                  <li>• Processed meats</li>
                  <li>• Sugary drinks</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">High-Calorie Traps</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Nuts (except small portions)</li>
                  <li>• Dried fruits</li>
                  <li>• Too much olive oil</li>
                  <li>• Large bread portions</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Habit Triggers</h3>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Alcohol (mostly)</li>
                  <li>• Late-night eating</li>
                  <li>• Emotional eating</li>
                  <li>• Mindless snacking</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">The Reality Check</h2>
              <p className="mb-4">
                This isn't perfect. Some days I eat more than planned. Some days I skip the walk. 
                Some days I have a piece of chocolate or a glass of wine.
              </p>
              <p className="mb-4">
                The difference now is that these are exceptions, not the rule. And when they happen, 
                I don't let them derail everything. I just get back to the plan the next day.
              </p>
              <p className="text-accent-green font-medium">
                Consistency over perfection. Progress over perfection. That's what actually works.
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-600 italic">
                Remember: This is what works for me right now. Your food selection might be different, 
                and that's completely fine. The principle is finding simple, sustainable choices that 
                you can stick with long-term.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyFoodSelection;