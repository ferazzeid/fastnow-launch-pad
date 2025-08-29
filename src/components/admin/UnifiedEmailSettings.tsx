import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Mail, Send, Key, Server, Webhook, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UnifiedEmailSettings = () => {
  const [contactEmail, setContactEmail] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [brevoApiKey, setBrevoApiKey] = useState('');
  const [testMessage, setTestMessage] = useState('This is a test email from FastNow contact form.');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [activeTab, setActiveTab] = useState('brevo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['contact_email', 'resend_api_key', 'brevo_api_key', 'webhook_url']);

      if (error) {
        console.error('Error loading email settings:', error);
        return;
      }

      const settingsMap = settings?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>) || {};

      setContactEmail(settingsMap.contact_email || 'fastnowapp@pm.me');
      setResendApiKey(settingsMap.resend_api_key || '');
      setBrevoApiKey(settingsMap.brevo_api_key || '');
      setWebhookUrl(settingsMap.webhook_url || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settings = [
        { setting_key: 'contact_email', setting_value: contactEmail },
        { setting_key: 'resend_api_key', setting_value: resendApiKey },
        { setting_key: 'brevo_api_key', setting_value: brevoApiKey },
        { setting_key: 'webhook_url', setting_value: webhookUrl }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(settings, { onConflict: 'setting_key' });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save email settings');
      } else {
        toast.success('Email settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if ((activeTab === 'resend' && !resendApiKey.trim()) || 
        (activeTab === 'brevo' && !brevoApiKey.trim())) {
      toast.error(`Please enter your ${activeTab === 'resend' ? 'Resend' : 'Brevo'} API key first`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: 'Test User',
          email: contactEmail,
          subject: 'Test Email from FastNow',
          message: testMessage,
          provider: activeTab,
          resendApiKey: activeTab === 'resend' ? resendApiKey : undefined,
          brevoApiKey: activeTab === 'brevo' ? brevoApiKey : undefined
        },
      });

      if (error) {
        console.error('Error sending test email:', error);
        toast.error(`Failed to send test email: ${error.message}`);
      } else {
        toast.success('Test email sent successfully!');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
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
              <TabsTrigger value="brevo" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Brevo (Recommended)
              </TabsTrigger>
              <TabsTrigger value="resend" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Resend
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhook
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brevo" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="brevoApiKey">Brevo API Key</Label>
                <Input
                  id="brevoApiKey"
                  type="password"
                  value={brevoApiKey}
                  onChange={(e) => setBrevoApiKey(e.target.value)}
                  placeholder="xkeysib-xxxxxxxxxxxxxxxxx"
                />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Get your API key from{' '}
                    <a 
                      href="https://app.brevo.com/settings/keys/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Brevo API Keys <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p>Make sure to verify your sender domain in Brevo settings</p>
                </div>
              </div>
            </TabsContent>

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
                disabled={loading}
              >
                <Send className="w-4 h-4" />
                {loading ? 'Testing...' : 'Test Webhook'}
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
              <Button 
                onClick={handleSaveSettings} 
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Mail className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
              {(activeTab === 'resend' || activeTab === 'brevo') && (
                <Button 
                  variant="outline" 
                  onClick={handleTestEmail}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Test Email'}
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
              <h4 className="font-medium text-foreground mb-2">Brevo (Recommended)</h4>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Sign up for a free account at brevo.com</li>
                <li>Verify your email domain in the Brevo dashboard</li>
                <li>Create an API key and enter it above</li>
                <li>Test the integration using the "Send Test Email" button</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Resend</h4>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Sign up for a free account at resend.com</li>
                <li>Verify your email domain in the Resend dashboard</li>
                <li>Create an API key and enter it above</li>
                <li>Test the integration using the "Send Test Email" button</li>
              </ol>
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