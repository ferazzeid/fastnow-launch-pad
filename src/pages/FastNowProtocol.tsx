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

          {/* Ready to Start Your Fasting Journey - Call to Action */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-accent-green to-mint-600 rounded-2xl shadow-soft p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Fasting Journey?</h2>
              <p className="text-lg mb-6 opacity-90">
                Access our FastNow app with the three core elements of this protocol: the initiation fast, the food protocol, 
                and the walking protocol. It will help you immerse yourself into the process and keep it structured.
              </p>
              <div className="space-y-3 text-sm opacity-80 mb-6">
                <p>
                  <strong>Free option:</strong> Use your own OpenAI API key if you're already an API subscriber.
                </p>
                <p>
                  <strong>Monthly subscription:</strong> Subscribe and use our API access to OpenAI for support.
                </p>
                <p>
                  The app is also usable without AI but its functionality is then severely limited. 
                  You can test it for free with a few limited AI requests, however we highly recommend 
                  either using your own API key or subscribing monthly.
                </p>
              </div>
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

          {/* Disclaimer */}
          <div className="mb-12">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-soft p-8 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-200">Important Disclaimer</h3>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                    <p>
                      <strong>What I'm sharing here is not medical advice.</strong> This is a personal protocol that I've developed and tested on myself. 
                      As I write this, it is actively working well for me — after many failed attempts, this version finally "clicked."
                    </p>
                    <p>
                      I believe it's more powerful to share one real example in full rather than a vague, watered-down summary that tries to apply to everyone. 
                      Real examples give context, texture, and make it easier to compare and adapt.
                    </p>
                    <p>
                      <strong>That said, we're all different:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Your weight, goals, or health conditions may differ</li>
                      <li>• You might live in a different climate or culture</li>
                      <li>• Your local food availability might not match mine</li>
                    </ul>
                    <p>
                      Please use your own judgment to adapt what doesn't fit. You can substitute ingredients, adjust timing, or consult an AI (or doctor) to help with adjustments. 
                      What matters is understanding the core principles — and shaping them to work for you.
                    </p>
                  </div>
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