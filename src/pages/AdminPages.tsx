
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface PageContent {
  home: string;
  fastNowProtocol: string;
  privacy: string;
  terms: string;
  updatedAt?: string;
}

const AdminPages = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<PageContent>({
    home: '',
    fastNowProtocol: '',
    privacy: '',
    terms: ''
  });

  const defaultContent = {
    home: `# Welcome to FastingApp

## Transform Your Health with Intermittent Fasting

Discover the power of intermittent fasting with our comprehensive app designed to guide you through every step of your fasting journey.

### Key Features

- **Smart Timer**: Track your fasting periods with precision
- **Progress Analytics**: Visualize your fasting streaks and achievements
- **Educational Content**: Learn about the science behind fasting
- **Community Support**: Connect with fellow fasters
- **Personalized Plans**: Customized fasting schedules for your lifestyle

### Why Choose FastingApp?

🎯 **Easy to Use**: Simple interface designed for all experience levels
🔬 **Science-Based**: Built on proven research and medical insights
📱 **Mobile First**: Access your fasting tracker anywhere, anytime
🏆 **Results Driven**: Thousands of success stories from our community

### Ready to Start Your Journey?

Download FastingApp today and join millions of users who have transformed their health through intermittent fasting.

*Available on iOS and Android*`,

    fastNowProtocol: `# The FastNow Protocol

Edit the content for the FastNow Protocol page here. This should include:

- Overview of the protocol
- Key principles
- Implementation steps
- Guidelines and recommendations`,

    privacy: `# Privacy Policy

**Last updated**: ${new Date().toLocaleDateString()}

## Introduction

FastingApp ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.

## Information We Collect

### Personal Information
- Email address and name when you create an account
- Profile information you choose to provide
- Communication preferences

### Health Data
With your explicit consent, we may collect:
- Fasting schedule and timing data
- Weight and measurement tracking (if you choose to enter this)
- Progress photos (stored locally on your device)
- Health goals and preferences

### Usage Data
- App feature usage and interaction patterns
- Device information and operating system
- Crash reports and performance data (anonymized)

## How We Use Your Information

- **Provide Services**: To deliver and maintain our app functionality
- **Personalization**: To customize your fasting experience
- **Communication**: To send important updates and support messages
- **Improvement**: To analyze usage patterns and improve our services
- **Support**: To provide customer service and technical support

## Data Sharing

We do not sell your personal information. We may share information only in these limited circumstances:
- With your explicit consent
- To comply with legal obligations
- To protect our rights and safety
- With service providers who assist in app operations (under strict confidentiality)

## Data Security

We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate information
- Delete your account and data
- Export your data
- Opt out of communications

## Children's Privacy

Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of any material changes through the app or email.

## Contact Us

For privacy-related questions: privacy@fastingapp.com`,

    terms: `# Terms of Service

**Last updated**: ${new Date().toLocaleDateString()}

## Acceptance of Terms

By downloading, installing, or using FastingApp, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our service.

## Description of Service

FastingApp provides tools and resources for intermittent fasting tracking, education, and community support. Our service includes:
- Fasting timers and tracking
- Educational content about intermittent fasting
- Progress analytics and insights
- Community features

## User Responsibilities

### Account Security
- Maintain the confidentiality of your account credentials
- Notify us immediately of any unauthorized use
- Provide accurate and current information

### Appropriate Use
You agree to:
- Use the app only for its intended purpose
- Not share harmful, illegal, or inappropriate content
- Respect other users and community guidelines
- Not attempt to reverse engineer or hack the app

### Health Disclaimer
FastingApp is for informational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider before beginning any fasting regimen.

## Intellectual Property

### Our Rights
FastingApp and its original content, features, and functionality are owned by FastingApp Inc. and are protected by copyright, trademark, and other intellectual property laws.

### Your Content
You retain ownership of any content you create in the app. By using our service, you grant us a license to use your content to provide and improve our services.

## Prohibited Uses

You may not use FastingApp to:
- Violate any applicable laws or regulations
- Transmit harmful or malicious code
- Spam or harass other users
- Impersonate others or provide false information
- Use the app for commercial purposes without permission

## Service Availability

We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the right to:
- Modify or discontinue features
- Perform maintenance and updates
- Suspend service for technical reasons

## Limitation of Liability

FastingApp is provided "as is" without warranties. We are not liable for:
- Any health outcomes related to fasting
- Technical issues or data loss
- Indirect or consequential damages
- Third-party content or services

## Termination

We may terminate or suspend your account if you violate these Terms. You may terminate your account at any time through the app settings.

## Governing Law

These Terms are governed by the laws of California, United States, without regard to conflict of law principles.

## Changes to Terms

We may modify these Terms periodically. Continued use of the app after changes constitutes acceptance of the new Terms.

## Contact Information

For questions about these Terms: legal@fastingapp.com

**FastingApp Inc.**
123 Fasting Street
Health City, CA 90210
United States`
  };

  useEffect(() => {
    console.log('AdminPages component mounted');
    
    const authStatus = localStorage.getItem('fastingApp_auth');
    console.log('Auth status:', authStatus);
    
    if (authStatus !== 'true') {
      console.log('Not authenticated, redirecting to admin');
      navigate('/admin');
      return;
    }
    
    console.log('User is authenticated');
    setIsAuthenticated(true);

    // Load existing page content
    const savedContent = localStorage.getItem('fastingApp_page_content');
    console.log('Saved content:', savedContent);
    
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setContent({
          home: parsed.home || defaultContent.home,
          fastNowProtocol: parsed.fastNowProtocol || defaultContent.fastNowProtocol,
          privacy: parsed.privacy || defaultContent.privacy,
          terms: parsed.terms || defaultContent.terms
        });
        console.log('Loaded saved content');
      } catch (error) {
        console.error('Error loading page content:', error);
        setContent(defaultContent);
      }
    } else {
      console.log('No saved content, using defaults');
      setContent(defaultContent);
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleContentChange = (page: keyof PageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [page]: value
    }));
  };

  const handleSave = async (page?: keyof PageContent) => {
    setIsLoading(true);
    try {
      const updatedContent = {
        ...content,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('fastingApp_page_content', JSON.stringify(updatedContent));
      
      // Also save individual page content for ContentPage component compatibility
      Object.entries(updatedContent).forEach(([key, value]) => {
        if (key !== 'updatedAt') {
          localStorage.setItem(`fastingApp_${key}Content`, value);
        }
      });
      
      if (page) {
        toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} page content saved successfully!`);
      } else {
        toast.success("All page content saved successfully!");
      }
    } catch (error) {
      console.error('Error saving page content:', error);
      toast.error("Failed to save content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = () => {
    handleSave();
  };

  const getPageTitle = (page: string) => {
    switch(page) {
      case 'home':
        return 'Home Page';
      case 'fastNowProtocol':
        return 'FastNow Protocol';
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms of Service';
      default:
        return 'Page';
    }
  };

  console.log('Rendering AdminPages, isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Redirecting to admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex justify-between items-center w-full">
            <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
              FastNow
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Page Content Management</h1>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Page Content</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use Markdown syntax for formatting. Changes are saved to localStorage and will be reflected on your live pages.
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="fastNowProtocol">Protocol</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                </TabsList>
                
                {(Object.keys(content) as Array<keyof PageContent>).map((page) => {
                  if (page === 'updatedAt') return null;
                  
                  return (
                    <TabsContent key={page} value={page} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`${page}Content`} className="text-lg font-semibold">
                          {getPageTitle(page)} Content
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/${page}`, '_blank')}
                          >
                            <Eye size={16} className="mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(page)}
                            disabled={isLoading}
                          >
                            <Save size={16} className="mr-2" />
                            Save {getPageTitle(page)}
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        id={`${page}Content`}
                        value={content[page]}
                        onChange={(e) => handleContentChange(page, e.target.value)}
                        placeholder={`Enter ${page} page content using Markdown...`}
                        className="min-h-[500px] font-mono text-sm"
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminPages;
