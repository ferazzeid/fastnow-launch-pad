
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft, Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { FastingTimelinePost as FastingTimelinePostType } from '@/types/fastingTimeline';
import { FastingTimelineService } from '@/services/FastingTimelineService';
import ReactMarkdown from 'react-markdown';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FastingTimelinePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<FastingTimelinePostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allPosts, setAllPosts] = useState<FastingTimelinePostType[]>([]);

  useEffect(() => {
    // Check if user is authenticated as admin
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');

    // Load all posts for sidebar
    const posts = FastingTimelineService.getAllPosts().filter(post => post.status === 'published');
    setAllPosts(posts);

    if (!slug) return;
    
    const foundPost = FastingTimelineService.getPostBySlug(slug);
    setPost(foundPost);
    setLoading(false);
  }, [slug]);

  const handleEdit = () => {
    if (post && isAdmin) {
      navigate(`/admin/fasting-timeline/edit/${post.id}`);
    }
  };

  const getPostByHour = (hour: number) => {
    return allPosts.find(post => post.hour === hour);
  };

  const FastingHoursSidebar = () => {
    const hourRanges = [
      { title: 'Early Hours (1-16)', hours: Array.from({length: 16}, (_, i) => i + 1) },
      { title: 'Intermediate (17-24)', hours: Array.from({length: 8}, (_, i) => i + 17) },
      { title: 'Advanced (25-48)', hours: Array.from({length: 24}, (_, i) => i + 25) },
      { title: 'Extended (49-72)', hours: Array.from({length: 24}, (_, i) => i + 49) }
    ];

    return (
      <Sidebar side="right" className="relative">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Fasting Hours</SidebarGroupLabel>
            <SidebarGroupContent>
              <Accordion type="multiple" className="w-full">
                {hourRanges.map((range, index) => (
                  <AccordionItem key={index} value={`range-${index}`}>
                    <AccordionTrigger className="text-sm">{range.title}</AccordionTrigger>
                    <AccordionContent>
                      <SidebarMenu>
                        {range.hours.map(hour => {
                          const hourPost = getPostByHour(hour);
                          const isCurrentPost = hourPost && post && hourPost.id === post.id;
                          return (
                            <SidebarMenuItem key={hour}>
                              <SidebarMenuButton asChild>
                                {hourPost ? (
                                  <Link 
                                    to={`/fasting-timeline/${hourPost.slug}`}
                                    className={isCurrentPost ? 'bg-accent text-accent-foreground' : ''}
                                  >
                                    <Clock className="w-4 h-4" />
                                    <span>Hour {hour}</span>
                                  </Link>
                                ) : (
                                  <div className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                    <Clock className="w-4 h-4" />
                                    <span>Hour {hour}</span>
                                  </div>
                                )}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
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
    return <Navigate to="/fasting-timeline" replace />;
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{post.title} - Fasting Timeline - FastNow.app</title>
        <meta name="description" content={post.excerpt} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Helmet>

      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="flex-1">
            <article className="container py-12">
              {/* Back to Timeline and Edit Button */}
              <div className="flex justify-between items-center mb-8">
                <Link to="/fasting-timeline" className="inline-flex items-center gap-2 text-accent-green hover:underline">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Fasting Timeline
                </Link>
                
                <div className="flex items-center gap-2">
                  {/* Edit Button for Admins */}
                  {isAdmin && (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </Button>
                  )}
                  <SidebarTrigger />
                </div>
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
                <div className="flex items-center gap-2 text-accent-green mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-semibold">Hour {post.hour}</span>
                </div>
                
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

              {/* Special Sections */}
              {(post.whatsHappening || post.howYoureFeeling) && (
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                  {post.whatsHappening && (
                    <div className="bg-mint-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-mint-600 mb-4">What's Happening</h3>
                      <div className="prose prose-sm">
                        <ReactMarkdown>{post.whatsHappening}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {post.howYoureFeeling && (
                    <div className="bg-accent-green/10 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-accent-green mb-4">How You Might Feel</h3>
                      <div className="prose prose-sm">
                        <ReactMarkdown>{post.howYoureFeeling}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              {/* Navigation */}
              <div className="mt-12 text-center">
                <Link to="/fasting-timeline">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Hours
                  </Button>
                </Link>
              </div>
            </article>
          </div>
          
          <FastingHoursSidebar />
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default FastingTimelinePost;
