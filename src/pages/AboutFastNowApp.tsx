import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const AboutFastNowApp = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>About Fast Now App - Your Complete Fasting Protocol Companion</title>
        <meta name="description" content="Learn about the Fast Now app - access the complete fasting protocol with AI support, tracking tools, and structured guidance for your health journey." />
      </Helmet>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Fast Now App
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your comprehensive companion for the Fast Now Protocol - combining structured fasting, 
              smart nutrition, and daily movement with AI-powered guidance and tracking.
            </p>
          </div>

          {/* What the App Does */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What the App Does</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Initiation Fast Support</h3>
                <p className="text-gray-600">
                  Guides you through the 3-day water fast with timer tracking, AI coaching, 
                  and safety reminders to kickstart your protocol.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Food Protocol Tracking</h3>
                <p className="text-gray-600">
                  Helps you maintain simple calorie control with meal logging, 
                  food suggestions, and deficit calculations.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Walking Protocol</h3>
                <p className="text-gray-600">
                  Tracks your daily walks, provides route suggestions, 
                  and helps you build the movement habit that supports your goals.
                </p>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">AI-Powered Guidance</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">With AI Support</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Personalized coaching and motivation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Real-time answers to your fasting questions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Meal planning and food suggestions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Progress analysis and adjustments
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Without AI</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Basic timer and tracking functions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Static protocol information
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Limited functionality
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Access Options */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Access</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <p className="text-lg text-gray-600 mb-6">
                Fast Now is a web application - no download required. Simply access it through your browser 
                and start your protocol journey immediately.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Bring Your Own API Key</h3>
                  <p className="text-gray-600 mb-4">
                    If you already have an OpenAI API subscription, use your own key for unlimited AI features.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full AI functionality</li>
                    <li>• Use your existing OpenAI credits</li>
                    <li>• Complete control over usage</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Subscription</h3>
                  <p className="text-gray-600 mb-4">
                    Don't have an API key? Subscribe monthly and we'll handle the AI access for you.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• No technical setup required</li>
                    <li>• Pay-as-you-go simplicity</li>
                    <li>• Cancel anytime</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Free Trial:</strong> Test the app with limited AI requests to see if it's right for you 
                  before committing to any payment option.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Health?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Access the Fast Now app and start your structured protocol journey today.
            </p>
            <Button 
              size="lg" 
              className="bg-accent-green hover:bg-accent-green-dark text-white"
              asChild
            >
              <a href="https://go.fastnow.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Access Fast Now App
                <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutFastNowApp;