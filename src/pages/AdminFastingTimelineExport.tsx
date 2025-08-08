import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  FileText,
  Database,
  HardDrive
} from "lucide-react";
import { Link } from "react-router-dom";
import { databaseFastingTimelineService } from '@/services/DatabaseFastingTimelineService';
import { FastingTimelineService } from '@/services/FastingTimelineService';
import { FastingTimelinePost } from '@/types/fastingTimeline';
import { useAuth } from '@/hooks/useAuth';

const AdminFastingTimelineExport = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();
  const [posts, setPosts] = useState<FastingTimelinePost[]>([]);
  const [localPosts, setLocalPosts] = useState<FastingTimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, isLoading, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load from database (admin gets all posts including drafts)
      const dbPosts = await databaseFastingTimelineService.getAllPostsForAdmin();
      console.log('Export page - Database posts loaded:', dbPosts.length);
      setPosts(dbPosts);
      
      // Load from localStorage
      const localStoragePosts = FastingTimelineService.getAllPosts();
      console.log('Export page - localStorage posts found:', localStoragePosts.length);
      setLocalPosts(localStoragePosts);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const exportDatabaseToCSV = () => {
    if (posts.length === 0) {
      toast.error('No database posts to export');
      return;
    }

    const headers = [
      'Hour', 'Title', 'Status', 'What\'s Happening', 'How You\'re Feeling', 
      'Content', 'Excerpt', 'Categories', 'Tags', 'Author', 'Created At', 'Updated At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...posts.map(post => [
        post.hour,
        `"${post.title.replace(/"/g, '""')}"`,
        post.status,
        `"${(post.whatsHappening || '').replace(/"/g, '""')}"`,
        `"${(post.howYoureFeeling || '').replace(/"/g, '""')}"`,
        `"${post.content.replace(/"/g, '""')}"`,
        `"${(post.excerpt || '').replace(/"/g, '""')}"`,
        `"${post.categories.join('; ')}"`,
        `"${post.tags.join('; ')}"`,
        `"${post.author}"`,
        post.createdAt,
        post.updatedAt
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'text/csv', 'fasting-timeline-database-export.csv');
    toast.success('Database timeline data exported to CSV');
  };

  const exportLocalStorageToCSV = () => {
    if (localPosts.length === 0) {
      toast.error('No localStorage posts to export');
      return;
    }

    const headers = [
      'Hour', 'Title', 'Status', 'What\'s Happening', 'How You\'re Feeling', 
      'Content', 'Excerpt', 'Categories', 'Tags', 'Author', 'Created At', 'Updated At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...localPosts.map(post => [
        post.hour,
        `"${post.title.replace(/"/g, '""')}"`,
        post.status,
        `"${(post.whatsHappening || '').replace(/"/g, '""')}"`,
        `"${(post.howYoureFeeling || '').replace(/"/g, '""')}"`,
        `"${post.content.replace(/"/g, '""')}"`,
        `"${(post.excerpt || '').replace(/"/g, '""')}"`,
        `"${post.categories.join('; ')}"`,
        `"${post.tags.join('; ')}"`,
        `"${post.author}"`,
        post.createdAt,
        post.updatedAt
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'text/csv', 'fasting-timeline-localstorage-export.csv');
    toast.success('localStorage timeline data exported to CSV');
  };

  const exportDatabaseToJSON = () => {
    if (posts.length === 0) {
      toast.error('No database posts to export');
      return;
    }

    const jsonContent = JSON.stringify(posts, null, 2);
    downloadFile(jsonContent, 'application/json', 'fasting-timeline-database-export.json');
    toast.success('Database timeline data exported to JSON');
  };

  const exportLocalStorageToJSON = () => {
    if (localPosts.length === 0) {
      toast.error('No localStorage posts to export');
      return;
    }

    const jsonContent = JSON.stringify(localPosts, null, 2);
    downloadFile(jsonContent, 'application/json', 'fasting-timeline-localstorage-export.json');
    toast.success('localStorage timeline data exported to JSON');
  };

  const exportCombinedJSON = () => {
    const combinedData = {
      database: posts,
      localStorage: localPosts,
      exportDate: new Date().toISOString(),
      summary: {
        databaseCount: posts.length,
        localStorageCount: localPosts.length,
        totalUnique: new Set([...posts.map(p => p.hour), ...localPosts.map(p => p.hour)]).size
      }
    };

    const jsonContent = JSON.stringify(combinedData, null, 2);
    downloadFile(jsonContent, 'application/json', 'fasting-timeline-combined-export.json');
    toast.success('Combined timeline data exported to JSON');
  };

  const downloadFile = (content: string, mimeType: string, filename: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSONData = async () => {
    if (!importData.trim()) {
      toast.error('Please paste JSON data to import');
      return;
    }

    try {
      const data = JSON.parse(importData);
      let postsToImport: FastingTimelinePost[] = [];

      // Handle different JSON formats
      if (Array.isArray(data)) {
        postsToImport = data;
      } else if (data.database && Array.isArray(data.database)) {
        postsToImport = data.database;
      } else if (data.localStorage && Array.isArray(data.localStorage)) {
        postsToImport = data.localStorage;
      } else {
        toast.error('Invalid JSON format. Expected array of posts or object with database/localStorage arrays.');
        return;
      }

      if (postsToImport.length === 0) {
        toast.error('No posts found in JSON data');
        return;
      }

      // Import posts to database
      let successCount = 0;
      for (const post of postsToImport) {
        try {
          const success = await databaseFastingTimelineService.savePost(post);
          if (success) successCount++;
        } catch (error) {
          console.error('Error importing post:', post.hour, error);
        }
      }

      toast.success(`Successfully imported ${successCount} out of ${postsToImport.length} posts`);
      setImportData('');
      loadData();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to parse JSON data. Please check the format.');
    }
  };

  const migrateFromLocalStorage = async () => {
    if (localPosts.length === 0) {
      toast.error('No localStorage data to migrate');
      return;
    }

    try {
      await databaseFastingTimelineService.migrateFromLocalStorage();
      toast.success('Migration completed successfully!');
      loadData();
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Migration failed');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/fasting-timeline" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
              Back to Timeline Management
            </Link>
            <h1 className="text-2xl font-bold">Export & Import Timeline Data</h1>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-6">
          {/* Data Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Database Posts</p>
                    <p className="text-2xl font-bold">{posts.length}</p>
                  </div>
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">localStorage Posts</p>
                    <p className="text-2xl font-bold">{localPosts.length}</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unique Hours</p>
                    <p className="text-2xl font-bold">
                      {new Set([...posts.map(p => p.hour), ...localPosts.map(p => p.hour)]).size}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Database Exports</h3>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={exportDatabaseToCSV} variant="outline" disabled={posts.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Database to CSV
                  </Button>
                  <Button onClick={exportDatabaseToJSON} variant="outline" disabled={posts.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Database to JSON
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">localStorage Exports</h3>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={exportLocalStorageToCSV} variant="outline" disabled={localPosts.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    localStorage to CSV
                  </Button>
                  <Button onClick={exportLocalStorageToJSON} variant="outline" disabled={localPosts.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    localStorage to JSON
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Combined Export</h3>
                <Button onClick={exportCombinedJSON} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Combined Data (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Migration Section */}
          {localPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Migrate localStorage to Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Found {localPosts.length} posts in localStorage. Migrate them to the database for better management.
                  </p>
                  <Button onClick={migrateFromLocalStorage}>
                    <Upload className="mr-2 h-4 w-4" />
                    Migrate {localPosts.length} Posts to Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import JSON Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Paste JSON data to import timeline posts into the database. Supports arrays of posts or combined export format.
                </p>
                <Textarea
                  placeholder="Paste JSON data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>
              <Button onClick={importJSONData} disabled={!importData.trim()}>
                <Upload className="mr-2 h-4 w-4" />
                Import JSON Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminFastingTimelineExport;