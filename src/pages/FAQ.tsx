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
            <p className="text-xl text-muted-foreground">
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
                        <h3 className="text-lg font-semibold text-foreground pr-4">
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
                    <CardContent className="pt-0 pb-6">
                      <div className="ml-11 prose prose-sm max-w-none text-muted-foreground">
                        {faq.answer.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
        </div></div>
    </PageLayout>
  );
};

export default FAQ;