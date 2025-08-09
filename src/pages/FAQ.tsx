import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
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
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState({
    title: 'Frequently Asked Questions',
    description: 'Get answers to common questions about FastNow and intermittent fasting',
    metaTitle: 'Frequently Asked Questions | FastNow App',
    metaDescription: 'Find answers to common questions about the FastNow app, intermittent fasting, and how to get the most out of your fasting journey.'
  });

  useEffect(() => {
    loadContent();
    loadFAQs();
  }, []);

  const loadContent = async () => {
    try {
      // Load page content from database
      const content = await pageContentService.getPageContent('faq');
      
      if (content) {
        setPageContent({
          title: content.title || 'Frequently Asked Questions',
          description: content.content || 'Get answers to common questions about FastNow and intermittent fasting',
          metaTitle: content.meta_title || 'Frequently Asked Questions | FastNow App',
          metaDescription: content.meta_description || 'Find answers to common questions about the FastNow app, intermittent fasting, and how to get the most out of your fasting journey.'
        });
      }
    } catch (error) {
      console.error('Error loading FAQ page content:', error);
    }
  };

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
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
    <PageLayout>
      <Helmet>
        <title>{pageContent.metaTitle}</title>
        <meta name="description" content={pageContent.metaDescription} />
        <meta name="keywords" content="FastNow FAQ, intermittent fasting questions, fasting app help, FastNow support" />
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <div className="bg-black text-white min-h-screen"><div className="container max-w-4xl mx-auto pt-32 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Q&A
            </h1>
            <p className="text-xl text-white/80">
              {pageContent.description}
            </p>
          </div>

          {/* FAQ Content */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No FAQs available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={faq.id} className="overflow-hidden border-l-4 border-l-primary/30 bg-white/5 hover:bg-white/10 border-white/10 transition-colors">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-6 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white font-playfair pr-4">
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
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                        i
                      </div>
                      <h3 className="text-lg font-semibold text-white font-playfair pr-4">
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
                        <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the ⋮ menu (top right in Chrome). Select “Add to Home screen”. Confirm the name FastNow and tap Add.</li>
                        <li><span className="font-medium">Step 3 – Put It in Your Main Navigation Bar (optional):</span> Press and hold the new FastNow icon. Drag it to your main dock/navigation bar so it’s always visible.</li>
                      </ol>

                      <h4 className="text-white/90 font-semibold mt-4">For iPhone & iPad Users</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        <li><span className="font-medium">Step 1 – Open FastNow in Safari:</span> Use Safari (Apple’s browser). Go to fastnow.app (or your site URL).</li>
                        <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the Share icon (square with arrow up). Scroll and tap “Add to Home Screen”. Confirm the name FastNow and tap Add.</li>
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
          )}
        </div>
        </div></div>
    </PageLayout>
  );
};

export default FAQ;