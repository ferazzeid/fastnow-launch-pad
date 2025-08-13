
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Tag, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [myExperiencePosts, setMyExperiencePosts] = useState<BlogPost[]>([]);
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);
  const [filteredMyExperiencePosts, setFilteredMyExperiencePosts] = useState<BlogPost[]>([]);
  const [filteredOtherPosts, setFilteredOtherPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');

    const loadPosts = async () => {
      const allPosts = await databaseBlogService.getAllPosts();
      const publishedPosts = allPosts.filter(post => post.status === 'published');
      setPosts(publishedPosts);
      
      // Split posts into "my experience" and others first
      const experiencePosts = publishedPosts.filter(post => 
        post.categories.includes('my experience')
      );
      const generalPosts = publishedPosts.filter(post => 
        !post.categories.includes('my experience')
      );
      
      // Get latest 3 "my experience" posts for the featured section
      const latestExperiencePosts = experiencePosts
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
        .slice(0, 3);
      setLatestPosts(latestExperiencePosts);
      
      
      setMyExperiencePosts(experiencePosts);
      setOtherPosts(generalPosts);
      setFilteredMyExperiencePosts(experiencePosts);
      setFilteredOtherPosts(generalPosts);
      
      // Extract unique categories from non-experience posts
      const uniqueCategories = Array.from(new Set(generalPosts.flatMap(post => post.categories)));
      setCategories(uniqueCategories);
    };

    loadPosts();
  }, []);

  useEffect(() => {
    // Filter "my experience" posts
    let filteredExperience = myExperiencePosts;
    if (searchTerm) {
      filteredExperience = filteredExperience.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMyExperiencePosts(filteredExperience);

    // Filter other posts
    let filteredOther = otherPosts;
    if (searchTerm) {
      filteredOther = filteredOther.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredOther = filteredOther.filter(post => post.categories.includes(selectedCategory));
    }

    setFilteredOtherPosts(filteredOther);
  }, [myExperiencePosts, otherPosts, searchTerm, selectedCategory]);

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
        {/* Featured Latest Posts Section */}
        {latestPosts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-mint-600 mb-4">Peek into My Weight Loss Experience</h2>
              <p className="text-lg text-mint-500 max-w-3xl mx-auto">
                Thinking out loud and reflecting on my weight loss journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {latestPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-accent-green">
                  {post.featuredImage && (
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="hover:text-accent-green transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {post.categories.slice(0, 1).map(category => (
                          <span
                            key={category}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-mint-100 text-mint-700"
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
          </div>
        )}

        {/* My Experience Section */}
        {filteredMyExperiencePosts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-mint-600 mb-4">My Experience</h2>
              <p className="text-lg text-mint-500 max-w-2xl mx-auto">
                Personal insights and experiences with the FastNow protocol.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredMyExperiencePosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1" />
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
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mint-600 mb-4">FastNow Insights</h1>
          <p className="text-xl text-mint-500 max-w-2xl mx-auto">
            Let's talk about the FastNow protocol and my experience
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
        {filteredOtherPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOtherPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                {post.featuredImage && (
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
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
