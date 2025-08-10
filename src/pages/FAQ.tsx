import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { pageContentService } from '@/services/PageContentService';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    // Load from cache immediately
    const cached = localStorage.getItem('faq_cache_v1');
    return cached ? JSON.parse(cached) : [];
  });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [pageContent, setPageContent] = useState({
    title: 'Frequently Asked Questions',
    description: 'Get answers to common questions about FastNow',
    metaTitle: 'Frequently Asked Questions | FastNow App',
    metaDescription: 'Find answers to common questions about the FastNow app and how to get the most out of your fasting journey.',
    featuredImage: ''
  });

  useEffect(() => {
    loadContent();
    loadFAQs();
  }, []);

  const loadContent = async () => {
    try {
      const content = await pageContentService.getPageContent('faq');
      
      if (content) {
        setPageContent({
          title: content.title || 'Frequently Asked Questions',
          description: content.content || 'Get answers to common questions about FastNow',
          metaTitle: content.meta_title || 'Frequently Asked Questions | FastNow App',
          metaDescription: content.meta_description || 'Find answers to common questions about the FastNow app and how to get the most out of your fasting journey.',
          featuredImage: content.featured_image_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading FAQ page content:', error);
    }
  };

  const loadFAQs = async () => {
    try {
      console.log('FAQ: Starting to load FAQs from database');
      
      // Try without is_active filter first (rely on RLS)
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('FAQ: Error loading FAQs:', error);
        // Retry with explicit is_active filter
        try {
          const { data: retryData, error: retryError } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
            
          if (retryError) {
            console.error('FAQ: Retry error:', retryError);
            return;
          }
          
          console.log('FAQ: Retry successful, loaded FAQs:', retryData?.length || 0);
          if (retryData && retryData.length > 0) {
            setFaqs(retryData);
            localStorage.setItem('faq_cache_v1', JSON.stringify(retryData));
          }
        } catch (retryErr) {
          console.error('FAQ: Retry failed:', retryErr);
        }
        return;
      }

      console.log('FAQ: Successfully loaded FAQs:', data?.length || 0, data);
      if (data && data.length > 0) {
        setFaqs(data);
        localStorage.setItem('faq_cache_v1', JSON.stringify(data));
      } else {
        console.log('FAQ: No FAQs found in database');
      }
    } catch (error) {
      console.error('FAQ: Exception loading FAQs:', error);
    }
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // JSON-LD structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{pageContent.metaTitle}</title>
        <meta name="description" content={pageContent.metaDescription} />
        <meta name="keywords" content="FastNow FAQ, fasting questions, fasting app help, FastNow support" />
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <Header />
      <main className="flex-1 bg-black text-white">
        {/* Featured Image */}
        {pageContent.featuredImage && (
          <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <img 
              src={pageContent.featuredImage} 
              alt="FAQ Featured" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        <div className="container max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Q&A
            </h1>
            <p className="text-xl text-white/80">
              {pageContent.description}
            </p>
          </div>

          {/* FAQ Content */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id} className="overflow-hidden border-l-4 border-l-primary/30 bg-white/5 hover:bg-white/10 border-white/10 transition-colors">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-white pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    {openItems.has(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openItems.has(faq.id) && (
                  <CardContent className="pt-4 pb-6 border-t border-white/10">
                    <div className="ml-11 prose prose-sm max-w-none text-white/80">
                      {faq.answer.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Static FAQ: Install like an app */}
            <Card className="overflow-hidden border-l-4 border-l-primary/30 bg-white/5 hover:bg-white/10 border-white/10 transition-colors">
              <button
                onClick={() => toggleItem('install-app')}
                className="w-full p-6 text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                      i
                    </div>
                    <h3 className="text-lg font-semibold text-white pr-4">
                      How do I install FastNow like an app on my phone?
                    </h3>
                  </div>
                  {openItems.has('install-app') ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
              {openItems.has('install-app') && (
                <CardContent className="pt-4 pb-6 border-t border-white/10">
                  <div className="ml-11 max-w-none text-white/80 space-y-4">
                    <p className="text-white/90 font-semibold">FastNow – Install the App on Your Phone</p>
                    <p>Even though FastNow runs in your browser, you can add it to your home screen so it works like a real app — full screen, fast, and easy to open.</p>

                    <h4 className="text-white/90 font-semibold mt-4">For Android Users</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><span className="font-medium">Step 1 – Open FastNow in Chrome:</span> Use Google Chrome (or Samsung Internet) on your phone. Go to fastnow.app (or your site URL).</li>
                      <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the ⋮ menu (top right in Chrome). Select "Add to Home screen". Confirm the name FastNow and tap Add.</li>
                      <li><span className="font-medium">Step 3 – Put It in Your Main Navigation Bar (optional):</span> Press and hold the new FastNow icon. Drag it to your main dock/navigation bar so it's always visible.</li>
                    </ol>

                    <h4 className="text-white/90 font-semibold mt-4">For iPhone & iPad Users</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><span className="font-medium">Step 1 – Open FastNow in Safari:</span> Use Safari (Apple's browser). Go to fastnow.app (or your site URL).</li>
                      <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the Share icon (square with arrow up). Scroll and tap "Add to Home Screen". Confirm the name FastNow and tap Add.</li>
                    </ol>

                    <h4 className="text-white/90 font-semibold mt-4">Why Install?</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>One-tap access — no need to type the address.</li>
                      <li>Full screen — looks and feels like a native app.</li>
                      <li>Faster startup — loads instantly from your phone.</li>
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;