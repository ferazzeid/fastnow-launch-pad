
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { FastingTimelinePost } from '@/types/fastingTimeline';
import { FastingTimelineService } from '@/services/FastingTimelineService';

const AdminFastingTimeline = () => {
  const [posts, setPosts] = useState<FastingTimelinePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<FastingTimelinePost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [hourRange, setHourRange] = useState<'all' | 'early' | 'intermediate' | 'advanced' | 'extended'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }

    // Initialize posts if none exist
    FastingTimelineService.createInitialPosts();
    
    // Load posts
    loadPosts();
  }, [navigate]);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hour.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (hourRange !== 'all') {
      const ranges = {
        'early': (hour: number) => hour <= 16,
        'intermediate': (hour: number) => hour > 16 && hour <= 24,
        'advanced': (hour: number) => hour > 24 && hour <= 48,
        'extended': (hour: number) => hour > 48
      };
      filtered = filtered.filter(post => ranges[hourRange](post.hour));
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, statusFilter, hourRange]);

  const loadPosts = () => {
    const allPosts = FastingTimelineService.getAllPosts();
    setPosts(allPosts);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fasting timeline post?')) {
      FastingTimelineService.deletePost(id);
      loadPosts();
      toast.success('Fasting timeline post deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">Fasting Timeline Management</h1>
            <p className="text-muted-foreground">Manage your hour-by-hour fasting content (Hours 0-96)</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
            <Link to="/admin/fasting-timeline/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Hour Post
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title, hour, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({posts.length})
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('published')}
            >
              Published ({posts.filter(p => p.status === 'published').length})
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
            >
              Drafts ({posts.filter(p => p.status === 'draft').length})
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={hourRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHourRange('all')}
            >
              All Hours
            </Button>
            <Button
              variant={hourRange === 'early' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHourRange('early')}
            >
              0-16 Hours
            </Button>
            <Button
              variant={hourRange === 'intermediate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHourRange('intermediate')}
            >
              17-24 Hours
            </Button>
            <Button
              variant={hourRange === 'advanced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHourRange('advanced')}
            >
              25-48 Hours
            </Button>
            <Button
              variant={hourRange === 'extended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHourRange('extended')}
            >
              49+ Hours
            </Button>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 ? 'No fasting timeline posts yet.' : 'No posts found matching your search.'}
              </p>
              <Link to="/admin/fasting-timeline/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Hour Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-accent-green text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Hour {post.hour}
                        </Badge>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.updatedAt)}
                        </div>
                      </div>
                      <CardTitle className="mb-2">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                      
                      {post.categories.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {post.categories.map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {post.status === 'published' && (
                        <Link to={`/fasting-timeline/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/admin/fasting-timeline/edit/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminFastingTimeline;
