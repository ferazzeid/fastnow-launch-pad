
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
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
      <PageLayout>
        <div className="container py-12">
          <div className="text-center">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!post || post.status !== 'published') {
    return <Navigate to="/blog" replace />;
  }

  return (
    <PageLayout>
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

      <article className="container py-12">
        {/* Back to Blog */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-accent-green hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          {/* Edit Button for Admins */}
          {isAdmin && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Post
            </Button>
          )}
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video mb-8 overflow-hidden rounded-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-mint-600 mb-4">{post.title}</h1>
          
          {post.author && (
            <div className="text-gray-600 mb-4">
              By {post.author}
            </div>
          )}

          {post.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-accent-green text-white"
                >
                  <Tag className="w-3 h-3" />
                  {category}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-mint-600 prose-a:text-accent-green prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
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
        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogPost;
