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
          <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8 text-center">
              How I Lost Fat With a 3-Day Fast + Calorie Control
            </h1>
            
            <div className="text-center mb-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                The complete FastNow Protocol - coming soon
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
              <ul className="space-y-2">
                <li>• The science behind 3-day fasting for fat loss</li>
                <li>• How to combine fasting with strategic calorie control</li>
                <li>• Step-by-step protocol implementation</li>
                <li>• Common mistakes and how to avoid them</li>
                <li>• Maintaining results long-term</li>
              </ul>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">
              This comprehensive protocol page is currently being developed. Check back soon for the complete guide to effective fat loss through strategic fasting and calorie management.
            </p>
          </article>
        </div>
      </main>
    </PageLayout>
  );
};

export default FastNowProtocol;