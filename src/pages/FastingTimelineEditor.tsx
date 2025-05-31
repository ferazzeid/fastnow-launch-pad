
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, ArrowLeft, Plus, X, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { FastingTimelinePost } from '@/types/fastingTimeline';
import { FastingTimelineService } from '@/services/FastingTimelineService';
import ReactMarkdown from 'react-markdown';

const FastingTimelineEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [post, setPost] = useState<FastingTimelinePost>({
    id: '',
    hour: 0,
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
    metaKeywords: '',
    whatsHappening: '',
    howYoureFeeling: ''
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
      const existingPost = FastingTimelineService.getPostById(id);
      if (existingPost) {
        setPost(existingPost);
      } else {
        toast.error('Fasting timeline post not found');
        navigate('/admin/fasting-timeline');
      }
    } else {
      // Initialize new post
      const now = new Date().toISOString();
      setPost(prev => ({
        ...prev,
        id: FastingTimelineService.generateId(),
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

    if (post.hour < 0 || post.hour > 96) {
      toast.error('Hour must be between 0 and 96');
      return;
    }

    if (!post.content.trim()) {
      toast.error('Content is required');
      return;
    }

    // Check if hour is already taken by another post
    const existingPost = FastingTimelineService.getPostByHour(post.hour);
    if (existingPost && existingPost.id !== post.id) {
      toast.error(`Hour ${post.hour} already has a post. Please choose a different hour.`);
      return;
    }

    // Generate slug from title and hour if not set
    const slug = post.slug || FastingTimelineService.generateSlug(post.title, post.hour);
    
    // Generate excerpt if not set
    const excerpt = post.excerpt || post.content.substring(0, 160) + '...';

    const updatedPost: FastingTimelinePost = {
      ...post,
      slug,
      excerpt,
      status,
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : post.publishedAt
    };

    FastingTimelineService.savePost(updatedPost);
    toast.success(status === 'published' ? 'Post published successfully' : 'Post saved as draft');
    navigate('/admin/fasting-timeline');
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
              {isEditing ? `Edit Hour ${post.hour}` : 'Create New Fasting Hour'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Make changes to your fasting timeline post' : 'Create a new hour in the fasting timeline'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/fasting-timeline')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Timeline
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
            <TabsTrigger value="details">Hour Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hour">Fasting Hour (0-96)</Label>
                        <Input
                          id="hour"
                          type="number"
                          min="0"
                          max="96"
                          value={post.hour}
                          onChange={(e) => setPost(prev => ({ ...prev, hour: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center gap-2 text-accent-green">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">Hour {post.hour}</span>
                        </div>
                      </div>
                    </div>

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
                        placeholder="Auto-generated from title and hour"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={post.excerpt}
                        onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of this fasting hour..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Main Content (Markdown)</Label>
                      <Textarea
                        id="content"
                        value={post.content}
                        onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write detailed content about this fasting hour..."
                        rows={15}
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

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Hour-Specific Details</CardTitle>
                <CardDescription>Special content sections for this fasting hour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsHappening">What's Happening (in the body)</Label>
                  <Textarea
                    id="whatsHappening"
                    value={post.whatsHappening}
                    onChange={(e) => setPost(prev => ({ ...prev, whatsHappening: e.target.value }))}
                    placeholder="Describe the biological processes happening during this hour..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="howYoureFeeling">How You Might Feel</Label>
                  <Textarea
                    id="howYoureFeeling"
                    value={post.howYoureFeeling}
                    onChange={(e) => setPost(prev => ({ ...prev, howYoureFeeling: e.target.value }))}
                    placeholder="Describe the typical feelings and experiences during this hour..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>Configure additional settings and SEO</CardDescription>
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
                <CardDescription>How your fasting hour post will appear to readers</CardDescription>
              </CardHeader>
              <CardContent>
                <article className="space-y-6">
                  <div className="flex items-center gap-2 text-accent-green">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg font-semibold">Hour {post.hour}</span>
                  </div>
                  
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

                  {(post.whatsHappening || post.howYoureFeeling) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {post.whatsHappening && (
                        <div className="bg-mint-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-mint-600 mb-2">What's Happening</h3>
                          <div className="prose prose-sm">
                            <ReactMarkdown>{post.whatsHappening}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                      
                      {post.howYoureFeeling && (
                        <div className="bg-accent-green/10 p-4 rounded-lg">
                          <h3 className="font-semibold text-accent-green mb-2">How You Might Feel</h3>
                          <div className="prose prose-sm">
                            <ReactMarkdown>{post.howYoureFeeling}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FastingTimelineEditor;
