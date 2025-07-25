
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { BlogPost } from '@/types/blog';
import { BlogService } from '@/services/BlogService';
import ReactMarkdown from 'react-markdown';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [post, setPost] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    author: 'FastNow Team',
    categories: [],
    tags: [],
    status: 'draft',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }

    if (isEditing && id) {
      const existingPost = BlogService.getPostById(id);
      if (existingPost) {
        setPost(existingPost);
      } else {
        toast.error('Post not found');
        navigate('/admin/blog');
      }
    } else {
      // Initialize new post
      const now = new Date().toISOString();
      setPost(prev => ({
        ...prev,
        id: BlogService.generateId(),
        createdAt: now,
        updatedAt: now,
        publishedAt: now
      }));
    }
  }, [isEditing, id, navigate]);

  const handleSave = (status: 'draft' | 'published' = post.status) => {
    if (!post.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!post.content.trim()) {
      toast.error('Content is required');
      return;
    }

    // Generate slug from title if not set
    const slug = post.slug || BlogService.generateSlug(post.title);
    
    // Generate excerpt if not set
    const excerpt = post.excerpt || post.content.substring(0, 160) + '...';

    const updatedPost: BlogPost = {
      ...post,
      slug,
      excerpt,
      status,
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : post.publishedAt
    };

    BlogService.savePost(updatedPost);
    toast.success(status === 'published' ? 'Post published successfully' : 'Post saved as draft');
    navigate('/admin/blog');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !post.categories.includes(newCategory.trim())) {
      setPost(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Make changes to your blog post' : 'Write and publish a new blog post'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave('published')}>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={post.title}
                        onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter post title..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={post.slug}
                        onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="Auto-generated from title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={post.excerpt}
                        onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of the post..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content (Markdown)</Label>
                      <Textarea
                        id="content"
                        value={post.content}
                        onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your post content in Markdown..."
                        rows={20}
                        className="font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add category"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button onClick={handleAddCategory} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map(category => (
                        <Badge key={category} variant="secondary" className="cursor-pointer">
                          {category}
                          <X 
                            className="w-3 h-3 ml-1" 
                            onClick={() => handleRemoveCategory(category)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button onClick={handleAddTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="cursor-pointer">
                          #{tag}
                          <X 
                            className="w-3 h-3 ml-1" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>Configure additional post settings and SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={post.featuredImage}
                    onChange={(e) => setPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={post.author}
                    onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={post.metaDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="SEO meta description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={post.metaKeywords}
                    onChange={(e) => setPost(prev => ({ ...prev, metaKeywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How your post will appear to readers</CardDescription>
              </CardHeader>
              <CardContent>
                <article className="space-y-6">
                  {post.featuredImage && (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-mint-600">{post.title || 'Post Title'}</h1>
                  <p className="text-gray-600">{post.excerpt || 'Post excerpt will appear here...'}</p>
                  <div className="prose prose-lg max-w-none prose-headings:text-mint-600 prose-a:text-accent-green">
                    <ReactMarkdown>{post.content || 'Post content will appear here...'}</ReactMarkdown>
                  </div>
                </article>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BlogEditor;
