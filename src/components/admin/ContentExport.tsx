import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { BlogService } from "@/services/BlogService";

const ContentExport: React.FC = () => {
  const handleExportContent = () => {
    try {
      // Gather all content from localStorage
      const content = {
        blogPosts: BlogService.getAllPosts(),
        pageContent: localStorage.getItem('fastingApp_page_content'),
        generalSettings: localStorage.getItem('fastingApp_settings'),
        designSettings: localStorage.getItem('fastingApp_design'),
        seoSettings: localStorage.getItem('fastingApp_seo'),
        timestamp: new Date().toISOString()
      };

      // Create downloadable JSON file
      const dataStr = JSON.stringify(content, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fastnow-content-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Content exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export content");
    }
  };

  const handleImportContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        
        // Import blog posts
        if (content.blogPosts) {
          localStorage.setItem('fastingApp_blogPosts', JSON.stringify(content.blogPosts));
        }
        
        // Import other content
        if (content.pageContent) {
          localStorage.setItem('fastingApp_page_content', content.pageContent);
        }
        
        if (content.generalSettings) {
          localStorage.setItem('fastingApp_settings', content.generalSettings);
        }
        
        if (content.designSettings) {
          localStorage.setItem('fastingApp_design', content.designSettings);
        }
        
        if (content.seoSettings) {
          localStorage.setItem('fastingApp_seo', content.seoSettings);
        }
        
        toast.success("Content imported successfully! Please refresh the page.");
      } catch (error) {
        console.error('Import error:', error);
        toast.error("Failed to import content - invalid file format");
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Backup & Migration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          <p>Export your content to backup or migrate between environments.</p>
          <p className="mt-2"><strong>Note:</strong> Content is stored in localStorage. When deploying to production, export and re-import your content to ensure it persists.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExportContent} className="flex-1">
            <Download size={16} className="mr-2" />
            Export All Content
          </Button>
          
          <div className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImportContent}
              style={{ display: 'none' }}
              id="import-content"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('import-content')?.click()}
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              Import Content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentExport;