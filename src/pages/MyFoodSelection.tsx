import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';

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
              My Food Overview – What I Actually Eat (And Why)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page shows the exact foods I'm eating right now. You may not find the exact same items in your country or store — and that's totally fine. This isn't about perfection. It's about clarity, immersion, and giving you one real example to study or copy.
            </p>
          </div>

          <PageFeaturedImage pageKey="myFoodSelection" />

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <div className="bg-accent-green/5 border border-accent-green/20 rounded-lg p-8">
              <p className="text-gray-700 mb-4">
                You can use AI or common sense to substitute. I'll explain why I'm eating (or avoiding) each item, and what compromises I've chosen to make. This is here to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Help you immerse yourself in the topic</li>
                <li>Give you a ready-to-use daily food map</li>
                <li>Let you copy it one-to-one if you want</li>
                <li>Give the app and its AI functionality a clear reference point</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-red-600 mb-6">❌ Foods I Never Eat Right Now (Clear No-Gos)</h2>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">🍞 Breads, Rice, Potatoes, Noodles</h3>
                <div className="text-red-800 space-y-2">
                  <p>No bread. No exceptions. No special rye versions. No smart keto breads.</p>
                  <p>This also includes: cakes, cookies, doughs, wraps, pastries.</p>
                  <p>No rice.</p>
                  <p>No potatoes. Not in any form.</p>
                  <p>No pasta or noodles.</p>
                  <p className="italic font-medium">If I were someone who could handle complex exceptions and always follow through on nuanced rules, I wouldn't be in this situation. Simplicity is the only rule that works.</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">🍬 Sugar, Sweets, Junk Food</h3>
                <div className="text-red-800 space-y-2">
                  <p>Obvious no.</p>
                  <p>Not even worth explaining.</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">🍎 Fruits</h3>
                <div className="text-red-800 space-y-2">
                  <p>None.</p>
                  <p>Even "healthy" fruit like apples or bananas caused massive weight gain for me.</p>
                  <p>Fruit juices? Dangerous.</p>
                  <p>Fruit may return in an advanced phase later — but for now, it's off the table.</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-900 mb-4">🥕 High-Sugar Vegetables</h3>
                <div className="text-red-800 space-y-2">
                  <p>No carrots.</p>
                  <p>No beets.</p>
                  <p>These act more like sugar sources than vegetables.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-amber-600 mb-6">⚠️ Foods I Sometimes Allow (Compromise Zone)</h2>

            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">🥒 Cucumbers</h3>
                <div className="text-amber-800 space-y-2">
                  <p>High in carbs, actually. Surprising.</p>
                  <p>But I love them. Salty, hydrating, crunchy.</p>
                  <p>I eat them on days where I walk more or allow higher intake.</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">🥒 Pickles (Fermented)</h3>
                <div className="text-amber-800 space-y-2">
                  <p>Much lower carb than fresh cucumbers (but not always — check the label).</p>
                  <p>I use them often. Crunchy, salty, satisfying.</p>
                  <p>Helpful for electrolyte balance, especially early in the diet.</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">🍅 Tomatoes</h3>
                <div className="text-amber-800 space-y-2">
                  <p>High in sugar and carbs, but can be integrated in moderation.</p>
                  <p>I use them very selectively.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-green-600 mb-6">✅ Core Food Staples (What I Actually Eat)</h2>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🧀 Cheese (Hard and Soft)</h3>
                <div className="text-green-800 space-y-2">
                  <p>Main go-to food.</p>
                  <p>Easy to portion. Readily available. Tasty.</p>
                  <p>Especially soft cheeses. Brie, Camembert, etc.</p>
                  <p>Can be eaten 1–2x a day as a major calorie source.</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🥚 Eggs</h3>
                <div className="text-green-800 space-y-2">
                  <p>Boiled eggs with salt. Avoid frying.</p>
                  <p>No butter. No olive oil.</p>
                  <p>Eggs are stable, satisfying, and easy to manage.</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🍗 Meats (With Compromises)</h3>
                <div className="text-green-800 space-y-2">
                  <p>I do include processed meats.</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Sliced sausage products</li>
                    <li>Ham (lower calorie)</li>
                    <li>Occasionally: salami (very salty, high calorie — use with care)</li>
                  </ul>
                  <p className="italic">Why? Convenience and variety. Clean meats are ideal, but harder to source and prepare.</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🐟 Fish (Smoked Salmon, Fresh Salmon)</h3>
                <div className="text-green-800 space-y-2">
                  <p>Smoked or cooked.</p>
                  <p>Easy to portion. High in protein and fat.</p>
                  <p>I include this often. It's satisfying and nutrient-rich.</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">🍗 Chicken</h3>
                <div className="text-green-800 space-y-2">
                  <p>Often store-bought (half rotisserie chicken)</p>
                  <p>Watch calories, but a great fallback meal</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-blue-600 mb-6">🥤 Drinks</h2>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">💧 Water & Sparkling Water</h3>
                <div className="text-blue-800">
                  <p>Ideally, I'd drink this only. But I struggle to do so.</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">🥤 Coke Zero / Pepsi Max / Light Sodas</h3>
                <div className="text-blue-800 space-y-2">
                  <p>Yes, I drink them daily.</p>
                  <p>They help suppress hunger and add comfort</p>
                  <p>I'm aware of the controversy — but they've been essential for my success</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">☕ Coffee</h3>
                <div className="text-blue-800 space-y-2">
                  <p>Black coffee helps a lot — especially during fasting days</p>
                  <p>Used sparingly, but strategically</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-purple-600 mb-6">🧂 Optional Extras</h2>

            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">🫒 Olives</h3>
                <div className="text-purple-800">
                  <p>Sometimes. Good if you're under budget.</p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">🐟 Tuna (Canned in Water)</h3>
                <div className="text-purple-800 space-y-2">
                  <p>In theory, yes — but I hate it. Can't swallow it.</p>
                  <p>Not part of my diet for that reason.</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-red-600 mb-6">❌ Other No-Gos</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-800 space-y-2">
                <p><strong>Olive oil:</strong> too calorie dense.</p>
                <p><strong>Butter:</strong> same.</p>
                <p><strong>Nuts:</strong> too many calories per gram. Impossible to integrate into a tight calorie plan.</p>
                <p><strong>Mayonnaise, ketchup:</strong> sugar bombs. No use.</p>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">🧾 Final Words</h2>
              <p className="mb-4">My real list is surprisingly short:</p>
              <ul className="list-disc list-inside space-y-1 mb-4 text-accent-green">
                <li>Eggs</li>
                <li>Cheese</li>
                <li>Chicken</li>
                <li>Salmon</li>
                <li>Sliced meats / sausage</li>
                <li>Cucumbers</li>
                <li>Pickles</li>
                <li>Occasionally tomatoes or olives</li>
                <li>Coke Zero / Light sodas</li>
                <li>Water, coffee</li>
              </ul>
              <p className="mb-4">
                This list may feel strict — but it works. It gives me momentum, energy, and flexibility once I combine it with walking and fasting.
              </p>
              <p className="text-accent-green font-medium">
                Don't try to perfect this. Just use it.
              </p>
              <p className="text-gray-300">
                If you need to adapt, substitute, or replace items — either use your judgment or ask the app. But this is the real list I'm using today, and it's getting me results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyFoodSelection;