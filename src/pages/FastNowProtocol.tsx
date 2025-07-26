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
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent-green to-mint-600 bg-clip-text text-transparent">
              The FastNow Protocol
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              How I Lost Fat With a 3-Day Fast + Calorie Control
            </p>
          </div>

          {/* Visual Formula */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-8 bg-gradient-to-r from-cream-50 to-mint-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">🧊</div>
                <span className="text-sm font-medium text-center">3-Day<br/>Water Fast</span>
              </div>
              <div className="text-2xl font-bold text-accent-green">+</div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-mint-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">🥩</div>
                <span className="text-sm font-medium text-center">Calorie<br/>Control</span>
              </div>
              <div className="text-2xl font-bold text-accent-green">+</div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-mint-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">🚶</div>
                <span className="text-sm font-medium text-center">Daily<br/>Walking</span>
              </div>
              <div className="text-2xl font-bold text-accent-green">=</div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-16 bg-gradient-to-r from-accent-green to-mint-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">👕</div>
                <span className="text-sm font-medium text-center">Clothes<br/>That Fit</span>
              </div>
            </div>
          </div>

          {/* Phase 1: 3-Day Water Fast */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center text-white text-2xl">🧊</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Phase 1: 3-Day Initiation Water Fast</h2>
                  <p className="text-mint-600 font-medium">Duration: 72 hours (3 full days)</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Purpose:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Switch body into fat-burning mode (ketosis initiation)</li>
                    <li>• Break addiction to carbs and constant insulin spikes</li>
                    <li>• Drop water weight rapidly for psychological momentum</li>
                    <li>• Stabilize mood swings and reduce hunger signals</li>
                    <li>• Reset hormonal environment and metabolic pathways</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">What to Do:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Only consume water, black coffee, or tea (no calories)</li>
                    <li>• No food, no sweeteners, no juices or broths</li>
                    <li>• Light movement is allowed (walks, chores)</li>
                    <li>• Monitor how you feel — don't push through dizziness or illness</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Calorie Control */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center text-white text-2xl">🥩</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Phase 2: Simple Calorie Control (Post-Fast)</h2>
                  <p className="text-mint-600 font-medium">Ongoing Duration: 30–60 days (recommended minimum)</p>
                </div>
              </div>

              <div className="bg-mint-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Key Rules:</h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Stay under 20–30g net carbs per day</li>
                  <li>• Create a daily calorie deficit of ~1,000 kcal</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">✅ Allowed Foods:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li><strong>Proteins & Fats:</strong> Cheese, sausage, eggs, cold cuts, fish, meat</li>
                    <li><strong>Low-carb Extras:</strong> Cucumbers, pickles, plain yogurt</li>
                    <li><strong>Drinks:</strong> Water, Coke Zero, Pepsi Max, coffee (unsweetened)</li>
                    <li><strong>Avoid:</strong> Bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📉 How to Stay in Deficit:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Calculate your daily burn rate (e.g., ~2,200 kcal for most men)</li>
                    <li>• Subtract ~1,000 kcal → Target intake = ~1,200–1,500 kcal/day</li>
                    <li>• Build simple meals from allowed foods</li>
                    <li>• Track everything meticulously (pen & paper or app)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Daily Walking */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center text-white text-2xl">🚶</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Phase 3: Daily Walking</h2>
                  <p className="text-mint-600 font-medium">Goal: Walk every day, minimum 1 hour</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Purpose:</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Increase daily calorie burn (≈300–600 kcal/hour)</li>
                  <li>• Create margin for more food (e.g., add yogurt, cheese)</li>
                  <li>• Improve metabolic flexibility and energy stability</li>
                  <li>• Boost mental health and momentum</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 4: Mental Immersion */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">🧠</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Phase 4: Mental Immersion (The Hidden Pillar)</h2>
                  <p className="text-purple-600 font-medium">Why It Matters: This is the silent force behind all physical success</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">✅ What This Means:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Spend time thinking about your journey — even if you're not ready to begin</li>
                    <li>• Watch videos, explore fasting tools, follow creators or apps that align with the mission</li>
                    <li>• Visualize the process, the difficulties, and the outcome</li>
                    <li>• Let the idea take up mental space — this creates subconscious readiness</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🔁 Integration with the 3 Pillars:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Immersion builds conviction, making fasting easier</li>
                    <li>• It gives your food tracking purpose — not just numbers, but meaning</li>
                    <li>• It makes walking and effort feel connected to your larger goal</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Before you even fast, before the first gram of fat is lost</strong> — your mind needs to enter the process. 
                  When you finally do fast, or track meals, or decline that tempting snack — your success will come not just from discipline, 
                  but from the fact that you've already lived this path in your mind many times.
                </p>
              </div>
            </div>
          </div>

          {/* Ready to Start Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-accent-green to-mint-600 rounded-2xl shadow-soft p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Fasting Journey?</h2>
              <p className="text-lg mb-6 opacity-90">
                Access our FastNow tools and AI-powered fasting companion to guide you through each phase of the protocol.
              </p>
              <p className="text-sm mb-6 opacity-80">
                Use with your own OpenAI API key (free) or subscribe monthly to use our API key.
              </p>
              <a 
                href="https://lounge.fastnow.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white text-accent-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Access The Lounge →
              </a>
            </div>
          </div>

          {/* Example Weekly Routine */}
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">📆 Example Weekly Routine</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-mint-50 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left">Day</th>
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left">Fast?</th>
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left">Max Carbs</th>
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left">Target Calories</th>
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left">Walk?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">Mon–Wed</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">✅</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">0g</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">0 kcal (water only)</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">Light</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">Thu–Sun</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">❌</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">&lt;30g</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">1,200–1,500 kcal</td>
                      <td className="border border-gray-200 dark:border-gray-600 p-3">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Measurement Philosophy */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-mint-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-mint-600 rounded-xl flex items-center justify-center text-white text-2xl">👕</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🧵 Why I Don't Use Traditional Measurements</h2>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>I've never liked using weight scales or measuring tapes. They create a kind of theoretical pressure that feels disconnected from real progress. Numbers fluctuate. Water retention, food timing, inflammation — all these can mask the deeper changes actually happening. That disconnect makes the whole process feel discouraging, even when you're doing everything right.</p>
                
                <p>Instead, I use <strong className="text-accent-green">clothing fit as my primary feedback system</strong>. I either:</p>
                
                <ul className="space-y-2 ml-4">
                  <li>• Buy certain items deliberately slightly too small, to create a subtle sense of accountability — I want to wear them, but I can't yet.</li>
                  <li>• Or I go back to clothes I used to wear in the past, when I was leaner, and try them on again as a check-in.</li>
                </ul>
                
                <p>This method works because it's tactile and binary — either the jeans button comfortably, or they don't. No spreadsheets, no overthinking. You probably already have these clothes in your wardrobe. That makes it a more grounded, emotionally resonant form of measurement. It's not about numbers on a screen — it's about reclaiming how you used to feel in your own body.</p>
              </div>
            </div>
          </div>

          {/* Common Mistakes & Mental Notes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-soft p-8 border border-red-100 dark:border-red-800">
              <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">⚠️ Common Mistakes to Avoid:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Eating "keto" snacks that exceed carb limit</li>
                <li>• Overeating cheese or sausage due to poor tracking</li>
                <li>• Underestimating portion sizes</li>
                <li>• Skipping walks too often</li>
                <li>• Thinking "just one tomato" won't matter — it adds up</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl shadow-soft p-8 border border-green-100 dark:border-green-800">
              <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">🧠 Mental Notes:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• You'll likely feel amazing after Day 3</li>
                <li>• Hunger reduces drastically if you stay in ketosis</li>
                <li>• Progress compounds fast in the first 2–4 weeks</li>
                <li>• This system is sustainable because it's simple and effective</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default FastNowProtocol;