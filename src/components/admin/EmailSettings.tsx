import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Mail, Send, Key } from 'lucide-react';

const EmailSettings = () => {
  const [contactEmail, setContactEmail] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [testMessage, setTestMessage] = useState('This is a test email from FastNow contact form.');

  useEffect(() => {
    // Load saved settings
    const savedEmail = localStorage.getItem('fastingApp_contactEmail') || 'fastnowapp@pm.me';
    const savedApiKey = localStorage.getItem('fastingApp_resendApiKey') || '';
    
    setContactEmail(savedEmail);
    setResendApiKey(savedApiKey);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('fastingApp_contactEmail', contactEmail);
    localStorage.setItem('fastingApp_resendApiKey', resendApiKey);
    toast.success('Email settings saved successfully!');
  };

  const handleTestEmail = async () => {
    if (!resendApiKey.trim()) {
      toast.error('Please enter your Resend API key first');
      return;
    }

    try {
      // Test the email integration by calling our edge function
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: contactEmail,
          subject: 'Test Email from FastNow',
          message: testMessage,
          resendApiKey: resendApiKey
        }),
      });

      if (response.ok) {
        toast.success('Test email sent successfully!');
      } else {
        toast.error('Failed to send test email. Please check your API key.');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Please check your configuration.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Form Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email Address</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="fastnowapp@pm.me"
            />
            <p className="text-sm text-muted-foreground">
              This email address will receive messages from the contact form.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resend API Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Resend Email Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resendApiKey">Resend API Key</Label>
            <Input
              id="resendApiKey"
              type="password"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              placeholder="re_xxxxxxxxxxxxxxxxx"
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              <a 
                href="https://resend.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                resend.com/api-keys
              </a>
              . Make sure to verify your domain at{' '}
              <a 
                href="https://resend.com/domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                resend.com/domains
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testMessage">Test Message</Label>
            <Textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message to verify email functionality"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Save Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestEmail}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>1.</strong> Sign up for a free account at resend.com</p>
            <p><strong>2.</strong> Verify your email domain in the Resend dashboard</p>
            <p><strong>3.</strong> Create an API key and enter it above</p>
            <p><strong>4.</strong> Test the integration using the "Send Test Email" button</p>
            <p><strong>5.</strong> Your contact form will now send emails directly to your inbox!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;