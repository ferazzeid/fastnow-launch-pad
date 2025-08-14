
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { BlogPost } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';
import { useAuth } from '@/hooks/useAuth';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure about the auth state (not loading)
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
        navigate('/admin');
        return;
      }

      // Migrate any existing localStorage posts to database
      databaseBlogService.migrateFromLocalStorage().then(() => {
        // Load posts from database
        loadPosts();
      });
    }
  }, [navigate, user, isAdmin, isLoading]);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, statusFilter]);

  const loadPosts = async () => {
    const allPosts = await databaseBlogService.getAllPosts();
    setPosts(allPosts);
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await databaseBlogService.deletePost(id);
      if (success) {
        loadPosts();
        toast.success('Post deleted successfully');
      } else {
        toast.error('Failed to delete post');
      }
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
          <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground">Manage your blog posts and content</p>
            </div>
            <Link to="/admin/blog/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
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
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 ? 'No blog posts yet.' : 'No posts found matching your search.'}
              </p>
              <Link to="/admin/blog/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
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
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/admin/blog/edit/${post.id}`}>
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

export default AdminBlog;
