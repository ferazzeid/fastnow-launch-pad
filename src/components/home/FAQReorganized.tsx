import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem { 
  id: string; 
  question: string; 
  answer: string; 
  display_order: number; 
}

interface FAQCategory {
  title: string;
  description: string;
  keywords: string[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Getting Started",
    description: "Basic questions about FastNow and how it works",
    keywords: ["what is", "how does", "start", "begin", "new", "first", "introduction"]
  },
  {
    title: "Using the App",
    description: "Features, logging, and day-to-day usage",
    keywords: ["log", "track", "deficit", "timer", "feature", "use", "app", "interface"]
  },
  {
    title: "Fasting & Protocols",
    description: "Fasting methods, timing, and protocols",
    keywords: ["fast", "fasting", "protocol", "intermittent", "omad", "16:8", "eating window"]
  },
  {
    title: "Results & Progress",
    description: "Timeline, expectations, and measuring success",
    keywords: ["results", "timeline", "progress", "weight", "lose", "expect", "how long", "when"]
  }
];

const categorizeFAQ = (faq: FAQItem): string => {
  const text = (faq.question + ' ' + faq.answer).toLowerCase();
  
  for (const category of faqCategories) {
    if (category.keywords.some(keyword => text.includes(keyword))) {
      return category.title;
    }
  }
  
  return "Other Questions";
};

const FAQReorganized: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [categorizedFAQs, setCategorizedFAQs] = useState<Record<string, FAQItem[]>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (!error && data) {
          setFaqs(data || []);
          
          // Categorize FAQs
          const categorized = data.reduce((acc, faq) => {
            const category = categorizeFAQ(faq);
            if (!acc[category]) acc[category] = [];
            acc[category].push(faq);
            return acc;
          }, {} as Record<string, FAQItem[]>);
          
          setCategorizedFAQs(categorized);
        }
      } catch (e) {
        console.error('FAQ load error:', e);
      }
    };
    load();
  }, []);

  const toggle = (id: string) => {
    const s = new Set(open);
    s.has(id) ? s.delete(id) : s.add(id);
    setOpen(s);
  };

  // Don't render if no FAQs
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-12 border-t">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-4xl">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about FastNow</p>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(categorizedFAQs).map(([categoryName, categoryFAQs]) => {
              const categoryInfo = faqCategories.find(cat => cat.title === categoryName);
              
              return (
                <div key={categoryName} className="space-y-4">
                  <div className="border-l-4 border-l-primary/30 pl-4">
                    <h3 className="text-xl font-semibold mb-1">{categoryName}</h3>
                    {categoryInfo && (
                      <p className="text-sm text-muted-foreground">{categoryInfo.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {categoryFAQs.map((faq) => (
                      <Card key={faq.id} className="overflow-hidden">
                        <button 
                          onClick={() => toggle(faq.id)} 
                          className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium pr-4">{faq.question}</h4>
                            {open.has(faq.id) ? (
                              <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        {open.has(faq.id) && (
                          <CardContent className="pt-0 pb-4">
                            <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                              {faq.answer}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQReorganized;