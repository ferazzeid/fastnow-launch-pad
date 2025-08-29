-- Restore detailed Privacy Policy content from AdminPageEditor default template
UPDATE page_content 
SET content = '# Privacy Policy

Last updated: ' || to_char(now(), 'MM/DD/YYYY') || '

This Privacy Policy describes how fastnow.app collects, uses, and discloses your information when you use our mobile application.

## Information We Collect

**Personal Information:** When you create an account, we collect your email address and name.

**Usage Data:** We collect information on how you interact with the app, such as the features you use and the time spent on different sections.

**Health Data:** With your consent, we collect data related to your fasting schedules and progress.

## How We Use Your Information

- To provide and maintain our service
- To notify you about changes to our service  
- To provide customer support
- To gather analysis to improve our service

## Data Security

We implement appropriate security measures to protect your personal information.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time.',
    updated_at = now()
WHERE page_key = 'privacy-policy';

-- Restore detailed Terms of Service content from AdminPageEditor default template  
UPDATE page_content
SET content = '# Terms of Service

Last updated: ' || to_char(now(), 'MM/DD/YYYY') || '

## Acceptance of Terms

By accessing or using the fastnow.app, you agree to be bound by these Terms of Service.

## Use of Services

You agree to use the Services only for purposes that are permitted by these Terms and any applicable law, regulation, or generally accepted practices in the relevant jurisdictions.

## Content

You are responsible for any content you create, transmit, or display while using our Services.

## Intellectual Property

The Services and their original content, features, and functionality are owned by fastnow.app and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

## Termination

We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## Limitation of Liability

In no event shall fastnow.app be liable for any indirect, incidental, special, consequential or punitive damages.',
    updated_at = now()
WHERE page_key = 'terms-of-service';