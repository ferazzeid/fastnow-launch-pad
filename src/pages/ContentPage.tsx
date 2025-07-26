
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import ContactForm from '@/components/ContactForm';

const ContentPage = () => {
  const { pageType } = useParams<{ pageType: string }>();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
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
        return; // Don't load content for contact page
      default:
        setTitle('fastnow.app');
    }

    // Load the content from localStorage for non-contact pages
    const savedContent = localStorage.getItem(`fastingApp_${pageType}Content`);
    
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Set default content based on page type
      if (pageType === 'privacy') {
        setContent(getDefaultPrivacyPolicy());
      } else if (pageType === 'terms') {
        setContent(getDefaultTermsOfService());
      } else {
        setContent('Content for this page has not been created yet.');
      }
    }
  }, [pageType]);

  const getDefaultPrivacyPolicy = () => {
    return `# Privacy Policy

*Last updated: ${new Date().toLocaleDateString()}*

## Introduction

Fast Now ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our fasting application and website.

## Information We Collect

### Personal Information
- Name and email address (when you contact us)
- Usage data and app interactions
- Device information and technical data

### Health Data
- Fasting periods and timing
- Weight tracking data (if provided)
- Food intake logs (if provided)
- Walking and exercise data (if provided)

## How We Use Your Information

We use your information to:
- Provide and maintain our fasting app service
- Improve user experience and app functionality
- Respond to your inquiries and support requests
- Send important service updates (if you've provided email)

## Data Storage and Security

- Your health data is stored locally on your device
- We implement appropriate security measures to protect your data
- We do not sell or share your personal information with third parties
- Data transmission is encrypted using industry-standard protocols

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data
- Withdraw consent for data processing
- Data portability

## Third-Party Services

Our app may integrate with:
- OpenAI (for AI assistant features, if enabled)
- Analytics services (anonymized data only)

## Children's Privacy

Our service is not intended for children under 13. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy periodically. We will notify users of significant changes through the app or website.

## Contact Us

For privacy-related questions, contact us at: [Your Contact Email]

---

This privacy policy ensures compliance with GDPR, CCPA, and other major privacy regulations.`;
  };

  const getDefaultTermsOfService = () => {
    return `# Terms of Service

*Last updated: ${new Date().toLocaleDateString()}*

## Acceptance of Terms

By accessing and using Fast Now ("the Service"), you accept and agree to be bound by these Terms of Service.

## Description of Service

Fast Now is a web-based application designed to help users implement intermittent fasting protocols, track health metrics, and provide optional AI-powered guidance.

## User Responsibilities

### Acceptable Use
- Use the Service for personal, non-commercial purposes
- Provide accurate information when required
- Maintain the security of your account
- Comply with all applicable laws and regulations

### Prohibited Activities
- Reverse engineering or attempting to extract source code
- Using the Service for illegal purposes
- Sharing account credentials with others
- Attempting to disrupt the Service

## Health Disclaimer

**IMPORTANT MEDICAL DISCLAIMER:**

- Fast Now is for informational purposes only
- The Service is not a substitute for professional medical advice
- Consult with healthcare professionals before starting any fasting regimen
- We are not responsible for health outcomes resulting from app usage
- Individual results may vary

## Intellectual Property

- Fast Now and its content are protected by copyright and trademark laws
- Users retain rights to their personal data
- We grant you a limited, non-exclusive license to use the Service

## Privacy and Data

- Your use of the Service is governed by our Privacy Policy
- We respect your privacy and protect your personal data
- Health data is stored locally on your device when possible

## Service Availability

- We strive to maintain Service availability but cannot guarantee 100% uptime
- We may temporarily suspend the Service for maintenance
- We reserve the right to modify or discontinue features

## Payment Terms (If Applicable)

- Monthly subscription fees are billed in advance
- Refunds may be provided at our discretion
- Prices are subject to change with notice

## Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW:
- We are not liable for indirect, incidental, or consequential damages
- Our total liability is limited to the amount paid for the Service
- We disclaim all warranties except as required by law

## Indemnification

You agree to indemnify and hold us harmless from claims arising from your use of the Service or violation of these Terms.

## Termination

- Either party may terminate the agreement at any time
- We may suspend access for Terms violations
- Termination does not affect accrued rights or obligations

## Governing Law

These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.

## Changes to Terms

We may update these Terms periodically. Continued use constitutes acceptance of revised Terms.

## Contact Information

For questions about these Terms, contact us at: [Your Contact Email]

---

By using Fast Now, you acknowledge that you have read, understood, and agree to these Terms of Service.`;
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{title} | fastnow.app</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {pageType === 'contact' ? (
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
            <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-6">{title}</h1>
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default ContentPage;
