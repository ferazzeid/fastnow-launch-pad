import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { FeatureItem } from '@/components/FeatureItem';
import { AppMockup } from '@/components/AppMockup';
import { AppStoreButton } from '@/components/AppStoreButton';
import { GooglePlayButton } from '@/components/GooglePlayButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Activity, MapPin, MessageSquare, Users, Shield, Clock, Utensils, Bot, Target, TrendingUp } from 'lucide-react';

const AboutFastNowApp = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>About FastNow App | fastnow.app</title>
        <meta name="description" content="Learn about the FastNow app - your ultimate companion for intermittent fasting, health tracking, and wellness goals." />
      </Helmet>

      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-green to-mint-600 bg-clip-text text-transparent mb-6">
            About FastNow App
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your ultimate companion for intermittent fasting, health tracking, and achieving your wellness goals. 
            FastNow combines science-backed fasting protocols with modern technology to help you transform your health.
          </p>
        </div>

        {/* App Mockup Section */}
        <div className="mb-16">
          <AppMockup />
        </div>

        {/* Features Tabs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-accent-green to-mint-600 bg-clip-text text-transparent mb-12">
            Discover FastNow Features
          </h2>
          
          <Tabs defaultValue="fasting-timer" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="fasting-timer">Fasting Timer</TabsTrigger>
              <TabsTrigger value="walking-tracker">Walking Tracker</TabsTrigger>
              <TabsTrigger value="food-log">Food Log</TabsTrigger>
              <TabsTrigger value="motivators">Motivators</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fasting-timer" className="mt-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Smart Fasting Timer</CardTitle>
                  <CardDescription className="text-lg">
                    Track your fasting windows with precision and intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">✨ Key Features:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Multiple fasting protocols (16:8, 18:6, OMAD, and more)</li>
                        <li>• Visual countdown timer with progress rings</li>
                        <li>• Smart notifications for start/end times</li>
                        <li>• Historical fasting data and streaks</li>
                        <li>• Customizable fasting goals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Benefits:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Stay consistent with your fasting schedule</li>
                        <li>• Track progress and build healthy habits</li>
                        <li>• Flexible timing to fit your lifestyle</li>
                        <li>• Detailed insights and analytics</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="walking-tracker" className="mt-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Walking Tracker</CardTitle>
                  <CardDescription className="text-lg">
                    Monitor your daily activity and movement goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">🚶 Features:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Step counting and distance tracking</li>
                        <li>• Calorie burn estimation</li>
                        <li>• Daily, weekly, and monthly goals</li>
                        <li>• Walking route history</li>
                        <li>• Integration with health apps</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">💪 Benefits:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Complement fasting with gentle exercise</li>
                        <li>• Boost metabolism naturally</li>
                        <li>• Improve mental clarity and mood</li>
                        <li>• Build sustainable movement habits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food-log" className="mt-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Utensils className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Food Log</CardTitle>
                  <CardDescription className="text-lg">
                    Track your nutrition during eating windows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">🍽️ Features:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Easy meal logging with photos</li>
                        <li>• Macro and calorie tracking</li>
                        <li>• Extensive food database</li>
                        <li>• Custom recipe creation</li>
                        <li>• Eating window optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Benefits:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Maximize nutrition in eating windows</li>
                        <li>• Identify food patterns and triggers</li>
                        <li>• Make informed dietary choices</li>
                        <li>• Support weight management goals</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="motivators" className="mt-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Motivators</CardTitle>
                  <CardDescription className="text-lg">
                    Stay inspired with personalized motivation and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">🌟 Features:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Personalized motivational messages</li>
                        <li>• Achievement badges and rewards</li>
                        <li>• Progress celebrations</li>
                        <li>• Inspiring success stories</li>
                        <li>• Custom goal setting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">💫 Benefits:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Maintain long-term motivation</li>
                        <li>• Overcome challenging moments</li>
                        <li>• Celebrate milestones and progress</li>
                        <li>• Build confidence and self-efficacy</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-assistant" className="mt-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">AI Assistant</CardTitle>
                  <CardDescription className="text-lg">
                    Get personalized guidance from your intelligent fasting coach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">🤖 Features:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 24/7 personalized fasting guidance</li>
                        <li>• Science-based recommendations</li>
                        <li>• Real-time answers to your questions</li>
                        <li>• Adaptive protocol suggestions</li>
                        <li>• Health insights and tips</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🎓 Benefits:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Get expert advice instantly</li>
                        <li>• Learn about fasting science</li>
                        <li>• Optimize your fasting approach</li>
                        <li>• Troubleshoot challenges quickly</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Download Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-green to-mint-600 bg-clip-text text-transparent mb-8">Get FastNow App</h2>
          <p className="text-lg text-gray-600 mb-8">
            Available on all your favorite platforms
          </p>
          <div className="flex justify-center gap-4">
            <AppStoreButton />
            <GooglePlayButton />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutFastNowApp;