import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Download, 
  Upload, 
  Search,
  Clock,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { databaseFastingTimelineService } from '@/services/DatabaseFastingTimelineService';
import { FastingTimelineService } from '@/services/FastingTimelineService';
import { FastingTimelinePost } from '@/types/fastingTimeline';
import { useAuth } from '@/hooks/useAuth';

const AdminFastingTimeline = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();
  const [posts, setPosts] = useState<FastingTimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<FastingTimelinePost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin, isLoading, navigate]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // First try to get from database (admin gets all posts including drafts)
      const dbPosts = await databaseFastingTimelineService.getAllPostsForAdmin();
      
      if (dbPosts.length === 0) {
        // Check localStorage for any existing data
        const localPosts = FastingTimelineService.getAllPosts();
        if (localPosts.length > 0) {
          toast.info(`Found ${localPosts.length} posts in localStorage. Consider migrating to database.`);
        }
        setPosts(localPosts);
      } else {
        setPosts(dbPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load timeline posts');
    } finally {
      setLoading(false);
    }
  };

  const migrateFromLocalStorage = async () => {
    try {
      await databaseFastingTimelineService.migrateFromLocalStorage();
      toast.success('Migration completed successfully!');
      loadPosts();
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Migration failed');
    }
  };

  const createMissingHours = async () => {
    const existingHours = new Set(posts.map(p => p.hour));
    const missingPosts: FastingTimelinePost[] = [];
    
    for (let hour = 0; hour <= 72; hour++) {
      if (!existingHours.has(hour)) {
        const now = new Date().toISOString();
        const title = hour === 0 ? 'Starting Your Fast - Hour 0' : `Fasting Hour ${hour}`;
        
        const post: FastingTimelinePost = {
          id: databaseFastingTimelineService.generateId(),
          hour,
          title,
          slug: databaseFastingTimelineService.generateSlug(title, hour),
          content: '',
          excerpt: `Hour ${hour} of your fasting journey`,
          author: 'FastNow Team',
          categories: hour <= 16 ? ['Beginner'] : hour <= 24 ? ['Intermediate'] : hour <= 48 ? ['Advanced'] : ['Extended'],
          tags: ['fasting', `hour-${hour}`, 'timeline'],
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          publishedAt: now,
          metaDescription: `Learn about hour ${hour} of fasting`,
          whatsHappening: '',
          howYoureFeeling: ''
        };
        
        missingPosts.push(post);
      }
    }
    
    if (missingPosts.length > 0) {
      for (const post of missingPosts) {
        await databaseFastingTimelineService.savePost(post);
      }
      toast.success(`Created ${missingPosts.length} missing hour entries`);
      loadPosts();
    } else {
      toast.info('All hours (0-72) already exist');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Hour', 'Title', 'Status', 'What\'s Happening', 'How You\'re Feeling', 
      'Content', 'Categories', 'Tags', 'Created At', 'Updated At'
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
        `"${post.categories.join('; ')}"`,
        `"${post.tags.join('; ')}"`,
        post.createdAt,
        post.updatedAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-timeline-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Timeline data exported to CSV');
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-timeline-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Timeline data exported to JSON');
  };

  const savePost = async (post: FastingTimelinePost) => {
    try {
      const success = await databaseFastingTimelineService.savePost(post);
      if (success) {
        toast.success('Post saved successfully');
        loadPosts();
        setIsDialogOpen(false);
        setEditingPost(null);
      } else {
        toast.error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const success = await databaseFastingTimelineService.deletePost(id);
      if (success) {
        toast.success('Post deleted successfully');
        loadPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.hour.toString().includes(searchTerm) ||
    post.status.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.hour - b.hour);

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
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
              Back to Admin
            </Link>
            <h1 className="text-2xl font-bold">Fasting Timeline Management</h1>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Total Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="secondary" className="mx-auto">Published</Badge>
                  <p className="text-sm font-medium">Published Posts</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="mx-auto">Draft</Badge>
                  <p className="text-sm font-medium">Draft Posts</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="destructive" className="mx-auto">Missing</Badge>
                  <p className="text-sm font-medium">Missing Hours</p>
                  <p className="text-2xl font-bold">{73 - new Set(posts.map(p => p.hour)).size}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={migrateFromLocalStorage} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Migrate from localStorage
            </Button>
            <Button onClick={createMissingHours} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Missing Hours
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={exportToJSON} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by hour, title, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Posts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline Posts ({filteredPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Hour</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32">Content Status</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-mono">{post.hour}</TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {post.whatsHappening && <Badge variant="outline" className="text-xs">What's Happening</Badge>}
                          {post.howYoureFeeling && <Badge variant="outline" className="text-xs">How You Feel</Badge>}
                          {post.content && <Badge variant="outline" className="text-xs">Content</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog open={isDialogOpen && editingPost?.id === post.id} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) setEditingPost(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingPost(post)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <TimelinePostEditor 
                              post={editingPost}
                              onSave={savePost}
                              onCancel={() => {
                                setIsDialogOpen(false);
                                setEditingPost(null);
                              }}
                            />
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deletePost(post.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Timeline Post Editor Component
const TimelinePostEditor: React.FC<{
  post: FastingTimelinePost | null;
  onSave: (post: FastingTimelinePost) => void;
  onCancel: () => void;
}> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FastingTimelinePost | null>(null);

  useEffect(() => {
    if (post) {
      setFormData({ ...post });
    }
  }, [post]);

  if (!formData) return null;

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Hour {formData.hour} - {formData.title}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'draft' | 'published') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt || ''}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="whatsHappening">What's Happening in Your Body</Label>
          <Textarea
            id="whatsHappening"
            value={formData.whatsHappening || ''}
            onChange={(e) => setFormData({ ...formData, whatsHappening: e.target.value })}
            rows={4}
            placeholder="Describe what's happening in the body during this hour..."
          />
        </div>

        <div>
          <Label htmlFor="howYoureFeeling">How You Might Be Feeling</Label>
          <Textarea
            id="howYoureFeeling"
            value={formData.howYoureFeeling || ''}
            onChange={(e) => setFormData({ ...formData, howYoureFeeling: e.target.value })}
            rows={4}
            placeholder="Describe how someone might feel during this hour..."
          />
        </div>

        <div>
          <Label htmlFor="content">Full Content (Markdown)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            placeholder="Write the full content in markdown format..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage || ''}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminFastingTimeline;