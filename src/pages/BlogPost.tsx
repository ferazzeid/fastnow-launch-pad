import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Tag } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthorBox } from '@/components/AuthorBox';
import { SiteSettingsService } from '@/services/SiteSettingsService';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [authorBoxSettings, setAuthorBoxSettings] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const [fetchedPost, allPosts, profile, settings] = await Promise.all([
          databaseBlogService.getPostBySlug(slug),
          databaseBlogService.getAllPosts(),
          SiteSettingsService.getSetting('author_profile'),
          SiteSettingsService.getSetting('author_box_settings')
        ]);
        
        if (fetchedPost && fetchedPost.status === 'published') {
          setPost(fetchedPost);
          
          // Find related posts (same categories, excluding current post)
          const related = allPosts
            .filter(p => 
              p.id !== fetchedPost.id && 
              p.categories.some(cat => fetchedPost.categories.includes(cat))
            )
            .slice(0, 3);
          
          setRelatedPosts(related);
          setAuthorProfile(profile);
          setAuthorBoxSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleEdit = () => {
    if (isAdmin && post) {
      navigate(`/admin/blog/edit/${post.id}`);
    }
  };

  // AuthorBox component that loads and displays author information
  const AuthorBoxContainer = () => {
    if (!authorProfile || !authorBoxSettings?.enabled) {
      return null;
    }

    return (
      <div className="mt-16 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
        <AuthorBox author={authorProfile} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post || post.status !== 'published') {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} - FastNow.app Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        {post.metaKeywords && <meta name="keywords" content={post.metaKeywords} />}
        <link rel="canonical" href={`https://fastnow.app/blog/${post.slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fastnow.app/blog/${post.slug}`} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="og:site_name" content="FastNow.app" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        {post.categories.length > 0 && <meta property="article:section" content={post.categories[0]} />}
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@fastnowapp" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        {post.featuredImage && <meta name="twitter:image" content={post.featuredImage} />}
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.metaDescription || post.excerpt,
            "image": post.featuredImage || undefined,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "FastNow.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fastnow.app/favicon.ico"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://fastnow.app/blog/${post.slug}`
            },
            "keywords": post.tags.join(", "),
            "articleSection": post.categories.join(", "),
            "url": `https://fastnow.app/blog/${post.slug}`
          })}
        </script>
      </Helmet>

      {/* Hero Section with Full Width Featured Image */}
      {post.featuredImage ? (
        <div className="relative h-screen w-full">
          {/* Full Width Featured Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Transparent Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-50">
            <Header transparent />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end justify-center z-30">
            <div className="container pb-16 text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl">
                {post.title}
              </h1>
              
              {post.author && (
                <div className="text-xl mb-6 text-white/90 drop-shadow-lg">
                  By {post.author}
                </div>
              )}

              {post.categories.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {post.categories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-white/20 text-white backdrop-blur-sm border border-white/30"
                    >
                      <Tag className="w-3 h-3" />
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Fallback for posts without featured image
        <div className="relative">
          <Header />
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
            <div className="container">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              
              {post.author && (
                <div className="text-xl mb-6 text-white/90">
                  By {post.author}
                </div>
              )}

              {post.categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.categories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm bg-white/20 text-white backdrop-blur-sm border border-white/30"
                    >
                      <Tag className="w-3 h-3" />
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container py-16">
        {/* Post Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-mint-600 prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline mx-auto max-w-4xl blog-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Edit Button for Admins - Bottom Left */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto mt-8">
            <Button 
              onClick={handleEdit} 
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}

        {/* Author Box */}
        {post.showAuthorBox && (
          <AuthorBoxContainer />
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">You may also be interested in</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-accent-green">
                  {relatedPost.featuredImage && (
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
                        className="hover:text-accent-green transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {relatedPost.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {relatedPost.categories.slice(0, 1).map(category => (
                          <span
                            key={category}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent-green/10 text-accent-green"
                          >
                            <Tag className="w-3 h-3" />
                            {category}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${relatedPost.slug}`}
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

      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;