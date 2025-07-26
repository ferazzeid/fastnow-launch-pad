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
              A supportive tool designed to help you implement and follow my personal Fast Now Protocol - 
              combining structured fasting, smart nutrition, and daily movement with optional AI assistance.
            </p>
          </div>

          {/* Philosophy Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why You Need a Dedicated Tool</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                My key philosophy is that you need a certain level of immersion into something like this for it to work. 
                It needs to have a certain level of priority in your subconscious, and there are many ways of doing this.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                One way is to have a dedicated app that you can access to deal with this and spend a certain amount of 
                energy and time per day on it, so it stays important in your head. It's competing against all of the 
                other things that are happening during the day.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                It's important to have some kind of tool that you can regularly go back to and interact with, 
                staying in touch with this whole topic that will get you the results you want. All you need is 
                just a bit of clarity, a bit of structure, and an example that works - and that's what we are 
                providing here, and that's what the app does.
              </p>
            </div>
          </div>

          {/* What the App Does */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How the App Supports the Protocol</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Initiation Fast Support</h3>
                <p className="text-gray-600">
                  Supports you through the 3-day water fast with timer tracking, safety reminders, 
                  and guidance to help you successfully complete this crucial first phase.
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

          {/* AI Support */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Optional AI Implementation Support</h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">With AI Support</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Voice chat for easy setup and progress tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Help navigating the protocol implementation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Quick answers to protocol-related questions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      Facilitates easier app usage and interaction
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Without AI (Manual Mode)</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      All core tracking and timer functions work
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Manual data entry and progress tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Static protocol information and guidance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                      Perfect if you prefer complete control
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
                and start implementing the protocol immediately.
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
                  <strong>Free Trial:</strong> Test the app with limited AI requests to see if it works for you 
                  before committing to any payment option.
                </p>
              </div>
              
              <div className="mt-8 text-center">
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