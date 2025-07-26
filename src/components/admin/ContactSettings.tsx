import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Mail, Webhook, Info } from 'lucide-react';

const ContactSettings = () => {
  const [contactEmail, setContactEmail] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const savedEmail = localStorage.getItem('fastingApp_contactEmail');
    const savedWebhook = localStorage.getItem('fastingApp_contactWebhook');
    
    if (savedEmail) setContactEmail(savedEmail);
    else setContactEmail('FastNowApp@Pm.me'); // Set default email
    if (savedWebhook) setWebhookUrl(savedWebhook);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('fastingApp_contactEmail', contactEmail);
    localStorage.setItem('fastingApp_contactWebhook', webhookUrl);
    toast.success('Contact settings saved successfully');
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Message',
          message: testMessage || 'This is a test message from Fast Now App contact form.',
          timestamp: new Date().toISOString(),
          to: contactEmail,
          isTest: true
        }),
      });

      toast.success('Test webhook sent! Check your webhook destination to confirm it was received.');
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to send test webhook');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Form Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email Address</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@yourdomain.com"
            />
            <p className="text-sm text-muted-foreground">
              Email address where contact form submissions will be sent
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Webhook Integration (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Webhook Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a Zapier account and set up a new Zap</li>
                  <li>Use "Webhooks by Zapier" as the trigger</li>
                  <li>Choose "Catch Hook" and copy the webhook URL</li>
                  <li>Connect it to Gmail, Outlook, or your preferred email service</li>
                  <li>Paste the webhook URL below</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
            <p className="text-sm text-muted-foreground">
              If provided, contact form submissions will be sent to this webhook. If empty, it will use mailto links.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-message">Test Message (Optional)</Label>
            <Textarea
              id="test-message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message to verify your webhook is working..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleTestWebhook} 
            variant="outline"
            disabled={!webhookUrl}
          >
            Send Test Webhook
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Contact Settings
        </Button>
      </div>
    </div>
  );
};

export default ContactSettings;