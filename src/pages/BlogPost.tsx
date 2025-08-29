import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';
import { BlogPost as BlogPostType } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated as admin
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');

    if (!slug) return;
    
    const loadPost = async () => {
      const foundPost = await databaseBlogService.getPostBySlug(slug);
      setPost(foundPost);
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  const handleEdit = () => {
    if (post && isAdmin) {
      navigate(`/admin/blog/edit/${post.id}`);
    }
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

          {/* Back to Blog Button */}
          <div className="absolute top-24 left-4 lg:left-8 z-40">
            <Link to="/blog">
              <Button 
                variant="secondary"
                className="bg-white/90 text-gray-900 hover:bg-white border-0 backdrop-blur-sm shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Edit Button for Admins */}
          {isAdmin && (
            <div className="absolute top-24 right-4 lg:right-8 z-40">
              <Button 
                onClick={handleEdit} 
                variant="secondary"
                className="bg-white/90 text-gray-900 hover:bg-white border-0 backdrop-blur-sm shadow-lg"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Button>
            </div>
          )}

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
              <div className="flex justify-between items-start mb-8">
                <Link to="/blog">
                  <Button 
                    variant="secondary"
                    className="bg-white/90 text-gray-900 hover:bg-white border-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Button 
                    onClick={handleEdit} 
                    variant="secondary"
                    className="bg-white/90 text-gray-900 hover:bg-white border-0"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Post
                  </Button>
                )}
              </div>

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
        <div className="prose prose-lg max-w-none prose-headings:text-mint-600 prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline mx-auto max-w-4xl">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

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

        {/* Back to Blog */}
        <div className="mt-16 text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;