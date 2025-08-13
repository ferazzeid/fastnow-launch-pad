import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  page_category: string;
}

interface FAQSectionProps {
  category: 'app' | 'protocol';
  title?: string;
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ category, title, className = '' }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, [category]);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('page_category', category)
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

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className={`py-16 ${className}`}>
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {title || `Frequently Asked Questions`}
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about {category === 'app' ? 'the FastNow app' : 'the FastNow protocol'}.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openItems.has(faq.id) && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="text-muted-foreground leading-relaxed">
                      {faq.answer.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={index > 0 ? 'mt-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;