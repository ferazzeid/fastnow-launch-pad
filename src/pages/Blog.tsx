
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Tag, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';
import { BlogService } from '@/services/BlogService';

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');

    // Initialize sample posts if none exist
    BlogService.createSamplePosts();
    
    const allPosts = BlogService.getAllPosts();
    const publishedPosts = allPosts.filter(post => post.status === 'published');
    setPosts(publishedPosts);
    setFilteredPosts(publishedPosts);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(publishedPosts.flatMap(post => post.categories)));
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.categories.includes(selectedCategory));
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const handleEdit = (postId: string) => {
    navigate(`/admin/blog/edit/${postId}`);
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Blog - FastNow.app</title>
        <meta name="description" content="Read the latest articles about intermittent fasting, health tips, and wellness advice from the FastNow.app team." />
      </Helmet>

      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mint-600 mb-4">FastNow Blog</h1>
          <p className="text-xl text-mint-500 max-w-2xl mx-auto">
            Discover the latest insights on intermittent fasting, health tips, and wellness advice.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                {post.featuredImage && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1" />
                    {/* Edit Button for Admins */}
                    {isAdmin && (
                      <Button 
                        onClick={() => handleEdit(post.id)} 
                        variant="ghost" 
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="hover:text-accent-green transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {post.categories.slice(0, 2).map(category => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent-green text-white"
                        >
                          <Tag className="w-3 h-3" />
                          {category}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-accent-green hover:underline text-sm font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Blog;
