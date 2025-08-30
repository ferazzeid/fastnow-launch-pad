
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

import { pageContentService } from '@/services/PageContentService';

const ContentPage = () => {
  const { pageType: urlPageType } = useParams<{ pageType: string }>();
  const location = useLocation();
  
  // Extract page type from URL path if not available in params
  const getPageTypeFromPath = () => {
    if (urlPageType) return urlPageType;
    
    const path = location.pathname;
    if (path === '/privacy') return 'privacy-policy'; // Match database key
    if (path === '/terms') return 'terms-of-service'; // Match database key
    if (path === '/contact') return 'contact';
    
    return null;
  };
  
  const pageType = getPageTypeFromPath();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true); // Default to indexable
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Set the page title based on the page type
        switch(pageType) {
          case 'privacy-policy':
            setTitle('Privacy Policy');
            break;
          case 'terms-of-service':
            setTitle('Terms of Service');
            break;
          case 'contact':
            setTitle('Contact Us');
            // Don't return early - load content for contact page too
            break;
          default:
            setTitle('fastnow.app');
        }

        // Try to load content from database first
        let loadedContent = '';
        try {
          const pageContent = await pageContentService.getPageContent(pageType || '');
          if (pageContent) {
            // Load content and SEO data
            if (pageContent.content) {
              loadedContent = pageContent.content;
            }
            if (pageContent.title) {
              setTitle(pageContent.title);
            }
            if (pageContent.meta_title) {
              setMetaTitle(pageContent.meta_title);
            }
            if (pageContent.meta_description) {
              setMetaDescription(pageContent.meta_description);
            }
            // Check if there's indexing preference saved (placeholder for future feature)
            // setIsIndexed(pageContent.is_indexed ?? true);
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

        // Final fallback to default content and SEO
        if (!loadedContent) {
          if (pageType === 'privacy-policy') {
            loadedContent = getDefaultPrivacyPolicy();
            if (!metaTitle) setMetaTitle('Privacy Policy - FastNow');
            if (!metaDescription) setMetaDescription('Read our privacy policy to understand how we protect and handle your personal data.');
          } else if (pageType === 'terms-of-service') {
            loadedContent = getDefaultTermsOfService();
            if (!metaTitle) setMetaTitle('Terms of Service - FastNow');
            if (!metaDescription) setMetaDescription('Read our terms of service and usage policies for the FastNow application.');
          } else if (pageType === 'contact') {
            if (!metaTitle) setMetaTitle('Contact Us - FastNow');
            if (!metaDescription) setMetaDescription('Get in touch with us for support, questions, or feedback about FastNow.');
          } else {
            loadedContent = 'Content for this page has not been created yet.';
          }
        }

        setContent(loadedContent);
      } catch (error) {
        console.error('Error loading content:', error);
        // Set fallback content and SEO even on error
        if (pageType === 'privacy-policy') {
          setContent(getDefaultPrivacyPolicy());
          if (!metaTitle) setMetaTitle('Privacy Policy - FastNow');
          if (!metaDescription) setMetaDescription('Read our privacy policy to understand how we protect and handle your personal data.');
        } else if (pageType === 'terms-of-service') {
          setContent(getDefaultTermsOfService());
          if (!metaTitle) setMetaTitle('Terms of Service - FastNow');
          if (!metaDescription) setMetaDescription('Read our terms of service and usage policies for the FastNow application.');
        } else if (pageType === 'contact') {
          if (!metaTitle) setMetaTitle('Contact Us - FastNow');
          if (!metaDescription) setMetaDescription('Get in touch with us for support, questions, or feedback about FastNow.');
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
    return `**Last updated:** August 9, 2025

## 1. Introduction
This Privacy Policy explains how Socially Famous Applications ("we", "us", or "our") collects, uses, and protects your information when you use the Fast Now application ("the Service").

**Data Controller:**  
Socially Famous Applications (independent developer)  
**Contact:** sociallyfamous@gmail.com

By using the Service, you agree to this Policy.

## 2. What We Collect
We may collect:
- **Account Information:** email address, login credentials.
- **Profile Data:** weight, height, age, health goals.
- **Usage & Analytics Data:** app activity, features used, session duration.
- **Device Information:** device type, operating system, app version, IP address.
- **Purchase Information:** subscription status, billing history (handled by Google Play Billing or Apple App Store).
- **AI Interaction Data:** voice or text logs, generated images (if you use AI features).
- **Support Communications:** messages sent to our support team.

## 3. How We Collect Data
- **Directly from you:** when you create an account, update your profile, make purchases, or contact us.
- **Automatically:** via your device, cookies, or similar technologies.
- **From third-party services:** including Supabase (data hosting), Google Play Billing (Android), Apple (iOS), Stripe (web), analytics providers, and OpenAI (if AI features are used).

## 4. Why We Collect Data
- To provide and operate the Service.
- To personalize your experience.
- To manage subscriptions and payments.
- To provide customer support.
- To comply with legal obligations.
- For analytics to improve the Service.

## 5. Legal Bases for Processing (GDPR)
We process your personal data under the following bases:
- **Consent:** for optional features like AI.
- **Contract:** to provide the Service you requested.
- **Legitimate Interests:** to improve and secure the Service.

## 6. Data Sharing and Processors
We do not sell personal data. We share limited data with trusted processors solely to operate the Service:
- **Supabase** – data hosting (https://supabase.com/privacy)
- **Google Play Billing** – Android purchases (https://play.google.com/about/play-terms)
- **Apple App Store** – iOS purchases (https://www.apple.com/legal/privacy/)
- **Stripe** – web payments (https://stripe.com/privacy)
- **OpenAI** – AI features (https://openai.com/policies/privacy-policy)
- **Analytics provider** (if used)

## 7. Retention Policy
We keep your data for as long as your account is active. Upon account deletion, we delete or anonymize data within 30 days, except backups which may take up to 90 days to be purged.

## 8. Security Measures
- Encryption in transit (HTTPS)
- Access controls
- Restricted access to personal data by authorized personnel only

## 9. Your Rights (GDPR/CCPA)
You have the right to:
- Access your personal data.
- Request correction or deletion.
- Withdraw consent at any time.
- Request data portability.
- Object to certain processing.

To exercise your rights, contact us at sociallyfamous@gmail.com.

## 10. Account Deletion
You can delete your account at any time via the in-app "Delete Account" button. Deletion removes personal data from active systems and schedules it for removal from backups.

## 11. Children's Privacy
The Service is not intended for children under 13 (or 16 in the EU). We do not knowingly collect data from children.

## 12. International Transfers
Your data may be transferred outside your country. Where required, we use safeguards such as Standard Contractual Clauses.

## 13. Cookies and Tracking
If our website uses cookies, you will see a cookie notice. Cookies may be used for essential functionality, analytics, and preference storage.

## 14. Changes to This Policy
We may update this Privacy Policy. The "Last updated" date will reflect the changes. Continued use of the Service constitutes acceptance.

## 15. Contact Us
For privacy-related questions:  
**Socially Famous Applications**  
**Email:** sociallyfamous@gmail.com`;
  };

  const getDefaultTermsOfService = () => {
    return `**Last updated:** August 9, 2025

## 1. Acceptance of Terms
By accessing or using the Fast Now application ("the Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service.

## 2. Definitions
- **"Service"** – the Fast Now app and related services.
- **"User"** – any person using the Service.
- **"We" / "Us"** – Socially Famous Applications (independent developer).

## 3. Eligibility
You must be at least 18 years old to use the Service. By using the Service, you confirm that you meet this requirement.

## 4. Description of Service
Fast Now is a tool for tracking fasting and walking activity, managing goals, and optionally using AI features. It is not a medical device.

## 5. User Responsibilities
- Provide accurate and updated information.
- Use the Service only for lawful purposes.
- Keep your login credentials secure.
- Do not reverse-engineer, hack, or disrupt the Service.

## 6. Subscription & Billing
- **Pricing:** as shown in Google Play or App Store listings.
- **Billing:** on Android, billing is handled by Google Play; on iOS, by Apple.
- **Auto-renewal:** subscriptions automatically renew unless canceled in your platform account settings.
- **Cancellation:** you must cancel via Google Play or Apple to stop auto-renewal.
- **Refunds:** subject to the policies of Google Play or Apple; we do not handle platform refunds directly.

## 7. Health Disclaimer
The Service is for informational purposes only and does not provide medical advice. Consult a qualified healthcare provider before making health decisions. We are not liable for any health consequences from using the Service.

## 8. User Content
You retain ownership of any content you submit (e.g., goals, motivators). You grant us a non-exclusive license to use it solely to provide the Service.

## 9. Intellectual Property
The Service, including its content, design, and code, is owned by us and protected by intellectual property laws. You may use it only as permitted in these Terms.

## 10. Privacy
Your use of the Service is subject to our Privacy Policy.

## 11. Third-Party Services
The Service integrates with third-party APIs (e.g., Google Play Billing, Supabase, OpenAI). We are not responsible for their availability or data handling beyond what is described in our Privacy Policy.

## 12. Service Availability
We strive for continuous availability but make no guarantees. Features may be modified or discontinued without notice.

## 13. Limitation of Liability
To the extent permitted by law, we are not liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid for the Service in the last 12 months.

## 14. Indemnification
You agree to indemnify and hold us harmless from any claims arising from your use of the Service or violation of these Terms.

## 15. Termination
We may suspend or terminate your account for violations of these Terms. You may terminate your use at any time via account deletion.

## 16. Governing Law & Dispute Resolution
These Terms are governed by the laws of your country of residence unless otherwise required by law. Disputes will be handled in the competent courts of that jurisdiction.

## 17. Changes to Terms
We may update these Terms at any time. Continued use after changes means you accept the revised Terms.

## 18. Contact
**Socially Famous Applications**  
**Email:** sociallyfamous@gmail.com`;
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{metaTitle || `${title} | fastnow.app`}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        <meta name="robots" content={isIndexed ? "index, follow" : "noindex, nofollow"} />
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
                {/* Display custom content if available */}
                {content ? (
                  <div className="prose prose-sm mx-auto mb-8">
                    <ReactMarkdown 
                      components={{
                        p: ({children}) => <p className="text-lg text-gray-600 mb-4">{children}</p>,
                        h1: ({children}) => <h1 className="text-xl font-semibold mb-3">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                        ul: ({children}) => <ul className="text-left list-disc ml-6 mb-4">{children}</ul>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-lg text-gray-600 mb-8">
                    Have questions about Fast Now or need support? We'd love to hear from you.
                  </p>
                )}
              </div>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  For questions, support, or feedback, please reach out to us:
                </p>
                <p className="text-lg font-medium">
                  sociallyfamous@gmail.com
                </p>
              </div>
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
