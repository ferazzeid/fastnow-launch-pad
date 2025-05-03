
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const AdminPageEditor = () => {
  const { pageType } = useParams<{ pageType: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load existing content
    const savedContent = localStorage.getItem(`fastingApp_${pageType}Content`);
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Set default content
      setContent(getDefaultContent(pageType));
    }
  }, [navigate, pageType]);

  const getDefaultContent = (type: string | undefined) => {
    switch(type) {
      case 'privacy':
        return `# Privacy Policy\n\nLast updated: ${new Date().toLocaleDateString()}\n\nThis Privacy Policy describes how fastnow.app collects, uses, and discloses your information when you use our mobile application.\n\n## Information We Collect\n\n**Personal Information:** When you create an account, we collect your email address and name.\n\n**Usage Data:** We collect information on how you interact with the app, such as the features you use and the time spent on different sections.\n\n**Health Data:** With your consent, we collect data related to your fasting schedules and progress.\n\n## How We Use Your Information\n\n- To provide and maintain our service\n- To notify you about changes to our service\n- To provide customer support\n- To gather analysis to improve our service\n\n## Data Security\n\nWe implement appropriate security measures to protect your personal information.\n\n## Changes to This Privacy Policy\n\nWe may update our Privacy Policy from time to time.`;
      case 'terms':
        return `# Terms of Service\n\nLast updated: ${new Date().toLocaleDateString()}\n\n## Acceptance of Terms\n\nBy accessing or using the fastnow.app, you agree to be bound by these Terms of Service.\n\n## Use of Services\n\nYou agree to use the Services only for purposes that are permitted by these Terms and any applicable law, regulation, or generally accepted practices in the relevant jurisdictions.\n\n## Content\n\nYou are responsible for any content you create, transmit, or display while using our Services.\n\n## Intellectual Property\n\nThe Services and their original content, features, and functionality are owned by fastnow.app and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.\n\n## Termination\n\nWe may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.\n\n## Limitation of Liability\n\nIn no event shall fastnow.app be liable for any indirect, incidental, special, consequential or punitive damages.`;
      case 'contact':
        return `# Contact Us\n\n## We'd Love to Hear From You\n\nThank you for using fastnow.app. If you have any questions, concerns, or feedback, please don't hesitate to reach out to us.\n\n## Email\n\nGeneral inquiries: info@fastnow.app\nSupport: support@fastnow.app\n\n## Social Media\n\nFollow us on social media for the latest updates and news:\n\n- Twitter: @fastnowapp\n- Instagram: @fastnowapp\n- Facebook: facebook.com/fastnowapp\n\n## Office Address\n\nfastnow.app\n123 Fasting Street\nHealth City, CA 90210\nUnited States\n\n## Support Hours\n\nOur support team is available Monday through Friday, 9:00 AM to 5:00 PM PST.`;
      default:
        return 'Edit this page content...';
    }
  };

  const getPageTitle = () => {
    switch(pageType) {
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms of Service';
      case 'contact':
        return 'Contact Information';
      default:
        return 'Page Editor';
    }
  };

  const handleSave = () => {
    localStorage.setItem(`fastingApp_${pageType}Content`, content);
    toast.success("Content saved successfully");
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Edit {getPageTitle()}</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>{getPageTitle()} Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use Markdown syntax for formatting. You can use # for headings, ** for bold text, * for italic, etc.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[500px] p-4 border rounded-md font-mono text-sm resize-y"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPageEditor;
