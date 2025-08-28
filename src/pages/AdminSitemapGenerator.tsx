import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Download, RefreshCw } from 'lucide-react';
import { sitemapService } from '@/services/SitemapService';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminSitemapGenerator = () => {
  const { user, isAdmin } = useAuth();
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      const content = await sitemapService.generateSitemap();
      setSitemapContent(content);
      
      // Store in localStorage for access
      localStorage.setItem('generated_sitemap', content);
      
      toast({
        title: "Sitemap Generated",
        description: "The sitemap has been generated successfully. Copy the content below and update your sitemap.xml file.",
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemapContent) return;
    
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Sitemap.xml has been downloaded.",
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mint-600 mb-2">Sitemap Generator</h1>
        <p className="text-muted-foreground">
          Generate a dynamic sitemap.xml that includes all published blog posts and static pages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dynamic Sitemap Generation</CardTitle>
          <CardDescription>
            This tool generates a complete sitemap.xml file including all published blog posts. 
            Copy the generated content and replace your current sitemap.xml file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={generateSitemap} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Sitemap'}
            </Button>
            
            {sitemapContent && (
              <Button 
                variant="outline" 
                onClick={downloadSitemap}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>

          {sitemapContent && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Sitemap Content:</label>
              <Textarea
                value={sitemapContent}
                readOnly
                className="font-mono text-xs h-96"
                placeholder="Sitemap content will appear here..."
              />
              <p className="text-xs text-muted-foreground">
                Copy this content and replace the contents of your public/sitemap.xml file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSitemapGenerator;