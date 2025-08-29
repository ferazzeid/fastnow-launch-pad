import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Mail, Send, Key, Server, Webhook, ExternalLink } from 'lucide-react';

const UnifiedEmailSettings = () => {
  const [contactEmail, setContactEmail] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [testMessage, setTestMessage] = useState('This is a test email from FastNow contact form.');
  
  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);
  
  // Webhook Settings
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const [activeTab, setActiveTab] = useState('resend');

  useEffect(() => {
    // Load saved settings
    const savedEmail = localStorage.getItem('fastingApp_contactEmail') || 'fastnowapp@pm.me';
    const savedApiKey = localStorage.getItem('fastingApp_resendApiKey') || '';
    const savedSmtpHost = localStorage.getItem('fastingApp_smtpHost') || '';
    const savedSmtpUsername = localStorage.getItem('fastingApp_smtpUsername') || '';
    const savedWebhookUrl = localStorage.getItem('fastingApp_webhookUrl') || '';
    
    setContactEmail(savedEmail);
    setResendApiKey(savedApiKey);
    setSmtpHost(savedSmtpHost);
    setSmtpUsername(savedSmtpUsername);
    setWebhookUrl(savedWebhookUrl);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('fastingApp_contactEmail', contactEmail);
    localStorage.setItem('fastingApp_resendApiKey', resendApiKey);
    localStorage.setItem('fastingApp_smtpHost', smtpHost);
    localStorage.setItem('fastingApp_smtpUsername', smtpUsername);
    localStorage.setItem('fastingApp_webhookUrl', webhookUrl);
    toast.success('Email settings saved successfully!');
  };

  const handleTestEmail = async () => {
    if (activeTab === 'resend' && !resendApiKey.trim()) {
      toast.error('Please enter your Resend API key first');
      return;
    }

    try {
      const response = await fetch(`${window.location.origin}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: contactEmail,
          subject: 'Test Email from FastNow',
          message: testMessage,
          resendApiKey: activeTab === 'resend' ? resendApiKey : undefined
        }),
      });

      if (response.ok) {
        toast.success('Test email sent successfully!');
      } else {
        const error = await response.json();
        toast.error(`Failed to send test email: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Please check your configuration.');
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: contactEmail,
          subject: 'Test Webhook from FastNow',
          message: testMessage,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('Test webhook sent successfully!');
      } else {
        toast.error('Failed to send test webhook. Please check your URL.');
      }
    } catch (error) {
      console.error('Error sending test webhook:', error);
      toast.error('Failed to send test webhook. Please check your configuration.');
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

      {/* Email Integration Options */}
      <Card>
        <CardHeader>
          <CardTitle>Email Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resend" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Resend (Recommended)
              </TabsTrigger>
              <TabsTrigger value="smtp" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                SMTP Server
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhook
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resend" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="resendApiKey">Resend API Key</Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_xxxxxxxxxxxxxxxxx"
                />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Get your API key from{' '}
                    <a 
                      href="https://resend.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      resend.com/api-keys <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p>Make sure to verify your domain at{' '}
                    <a 
                      href="https://resend.com/domains" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      resend.com/domains <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="smtp" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpUsername}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder="your-app-password"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: SMTP configuration requires server-side implementation. This is for future use.
              </p>
            </TabsContent>

            <TabsContent value="webhook" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-webhook-service.com/contact"
                />
                <p className="text-sm text-muted-foreground">
                  Enter a webhook URL to receive contact form submissions as HTTP POST requests.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleTestWebhook}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Test Webhook
              </Button>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-6">
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
              {activeTab === 'resend' && (
                <Button 
                  variant="outline" 
                  onClick={handleTestEmail}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Test Email
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-2">Resend (Recommended)</h4>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Sign up for a free account at resend.com</li>
                <li>Verify your email domain in the Resend dashboard</li>
                <li>Create an API key and enter it above</li>
                <li>Test the integration using the "Send Test Email" button</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">SMTP Server</h4>
              <p>Configure your own SMTP server for email delivery. Requires backend implementation.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Webhook</h4>
              <p>Send contact form data to a webhook URL for custom processing.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmailSettings;