
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { BlogPost as BlogPostType } from '@/types/blog';
import { BlogService } from '@/services/BlogService';
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
    
    const foundPost = BlogService.getPostBySlug(slug);
    setPost(foundPost);
    setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{post.title} - FastNow.app Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
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
          
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            {post.author && (
              <div>
                By {post.author}
              </div>
            )}
          </div>

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
