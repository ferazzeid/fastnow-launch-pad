
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import ContactForm from '@/components/ContactForm';
import { pageContentService } from '@/services/PageContentService';

const ContentPage = () => {
  const { pageType: urlPageType } = useParams<{ pageType: string }>();
  const location = useLocation();
  
  // Extract page type from URL path if not available in params
  const getPageTypeFromPath = () => {
    if (urlPageType) return urlPageType;
    
    const path = location.pathname;
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/contact') return 'contact';
    
    return null;
  };
  
  const pageType = getPageTypeFromPath();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Set the page title based on the page type
        switch(pageType) {
          case 'privacy':
            setTitle('Privacy Policy');
            break;
          case 'terms':
            setTitle('Terms of Service');
            break;
          case 'contact':
            setTitle('Contact Us');
            setIsLoading(false);
            return; // Don't load content for contact page
          default:
            setTitle('fastnow.app');
        }

        // Try to load content from database first
        let loadedContent = '';
        try {
          const pageContent = await pageContentService.getPageContent(pageType || '');
          if (pageContent?.content) {
            loadedContent = pageContent.content;
          }
        } catch (error) {
          console.error('Failed to load content from database:', error);
        }

        // Fallback to localStorage if database fails
        if (!loadedContent) {
          const savedContent = localStorage.getItem(`fastingApp_${pageType}Content`);
          if (savedContent) {
            loadedContent = savedContent;
          }
        }

        // Final fallback to default content
        if (!loadedContent) {
          if (pageType === 'privacy') {
            loadedContent = getDefaultPrivacyPolicy();
          } else if (pageType === 'terms') {
            loadedContent = getDefaultTermsOfService();
          } else {
            loadedContent = 'Content for this page has not been created yet.';
          }
        }

        setContent(loadedContent);
      } catch (error) {
        console.error('Error loading content:', error);
        // Set fallback content even on error
        if (pageType === 'privacy') {
          setContent(getDefaultPrivacyPolicy());
        } else if (pageType === 'terms') {
          setContent(getDefaultTermsOfService());
        } else {
          setContent('Content for this page has not been created yet.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageType]);

  const getDefaultPrivacyPolicy = () => {
    return `**Last updated:** August 3, 2025

## 1. Introduction
This Privacy Policy explains how Fast Now collects, uses, and protects your information.

## 2. What We Collect
- Account Information (e.g., email, login details)
- Health and activity data (if manually entered)
- AI interaction logs (if applicable)
- Technical information (device type, browser, etc.)

## 3. How We Use Your Data
- To operate and improve the Service
- To personalize user experience
- To provide AI-powered suggestions (if enabled)
- To comply with legal obligations

## 4. Data Storage and Security
- Health data is stored locally on your device when possible.
- Data stored on servers is encrypted.
- We implement safeguards to prevent unauthorized access.

## 5. Sharing of Information
We do not sell your personal data. We may share limited information with trusted service providers (e.g., AI or analytics providers) strictly to operate the Service.

## 6. Your Rights
- You can request access to or deletion of your personal data.
- You may withdraw consent for AI-based features at any time.
- You may delete your account at any time.

## 7. Children's Privacy
Fast Now is not intended for children under 13. We do not knowingly collect personal data from children.

## 8. International Users
If you are accessing the Service from outside the U.S., be aware that your information may be processed in the U.S. or other countries.

## 9. Changes to this Policy
We may update this Privacy Policy. Continued use after changes constitutes acceptance.

## 10. Contact Us
For privacy-related questions: **fastnowapp@pm.me**`;
  };

  const getDefaultTermsOfService = () => {
    return `**Last updated:** August 3, 2025

## 1. Acceptance of Terms
By accessing or using the Fast Now web application ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.

## 2. Definitions
- **"Service"**: the Fast Now app and all related services and features.
- **"User"**: any individual who accesses or uses the Service.
- **"We", "Us", or "Our"**: Fast Now and its operators.

## 3. Description of Service
Fast Now is a web-based tool designed to help users manage intermittent fasting protocols, track health metrics, and optionally receive AI-powered guidance.

## 4. Eligibility & Account Responsibility
You must be at least 18 years old to use the Service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.

## 5. User Responsibilities
- Use the Service only for lawful, personal, non-commercial purposes.
- Do not share your account credentials with others.
- Provide accurate, up-to-date information.
- Do not attempt to reverse-engineer, hack, or disrupt the Service.

## 6. Health Disclaimer
Fast Now is not a medical service. All information is provided for educational purposes only and is not a substitute for professional medical advice. Consult your healthcare provider before beginning any fasting or health regimen. We disclaim responsibility for any health consequences of using the Service. Individual results may vary.

## 7. User Content
If you submit custom goals, motivators, or personal data, you retain ownership of that content. You grant us a non-exclusive license to use that content solely to provide the Service.

## 8. Intellectual Property
The Service and its contents are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-transferable license to use the Service for personal use only.

## 9. Privacy & Data Handling
Your privacy is important to us. Please review our Privacy Policy for details. Where possible, personal health data is stored locally. When stored on our servers, we employ encryption and security protocols.

## 10. Third-Party Services
Fast Now may integrate third-party APIs (e.g., OpenAI). We are not responsible for any data use or service disruptions caused by these external services.

## 11. Payments & Subscriptions
If applicable, subscription fees are charged monthly in advance. Refunds are provided at our discretion. We reserve the right to change pricing with reasonable notice.

## 12. Service Availability
We strive to provide continuous Service but do not guarantee 100% uptime. We may modify or discontinue parts of the Service at any time.

## 13. Limitation of Liability
To the fullest extent permitted by law, we are not liable for indirect or consequential damages. Our total liability is limited to the amount paid by you for the Service in the previous 12 months.

## 14. Indemnification
You agree to indemnify and hold Fast Now harmless from any claims, liabilities, or expenses arising from your use of the Service or violation of these Terms.

## 15. Termination
We may suspend or terminate your access to the Service at any time for violations of these Terms. You may terminate your use at any time. Termination does not waive rights accrued before termination.

## 16. Dispute Resolution
These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts located in the applicable jurisdiction.

## 17. Changes to Terms
We may revise these Terms at any time. Continued use of the Service after changes indicates your acceptance.

## 18. Contact
Questions? Email us at: **fastnowapp@pm.me**

---

*By using Fast Now, you acknowledge that you have read, understood, and agreed to these Terms.*`;
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{title} | fastnow.app</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading content...</div>
            </div>
          ) : pageType === 'contact' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-6">{title}</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Have questions about Fast Now or need support? We'd love to hear from you.
                </p>
              </div>
              <ContactForm />
            </div>
          ) : (
            <article className="legal-document max-w-none">
              <div className="mb-8 pb-4 border-b border-border">
                <h1 className="text-2xl font-medium text-foreground mb-2">{title}</h1>
                <p className="text-sm text-muted-foreground">Please read these terms carefully</p>
              </div>
              <div className="legal-content">
                <ReactMarkdown 
                  components={{
                    h1: ({children}) => <h1 className="text-xl font-medium text-foreground mt-8 mb-4 first:mt-0">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-medium text-foreground mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-medium text-foreground mt-4 mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="text-sm text-muted-foreground mb-4 pl-4 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="text-sm text-muted-foreground mb-4 pl-4 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="text-sm text-muted-foreground leading-relaxed">{children}</li>,
                    strong: ({children}) => <strong className="font-medium text-foreground">{children}</strong>,
                    em: ({children}) => <em className="text-foreground">{children}</em>,
                    hr: () => <hr className="my-6 border-border" />,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-border pl-4 my-4 text-muted-foreground italic">{children}</blockquote>
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default ContentPage;
