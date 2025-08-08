import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem { id: string; question: string; answer: string; display_order: number; }

const FAQFull: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error) setFaqs(data || []);
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

  return (
    <section id="faq" className="py-12 border-t">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
        {faqs.length === 0 ? (
          <p className="text-muted-foreground">No FAQs available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id} className="overflow-hidden border-l-4 border-l-primary/20">
                <button onClick={() => toggle(faq.id)} className="w-full p-6 text-left hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    </div>
                    {open.has(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
                {open.has(faq.id) && (
                  <CardContent className="pt-0 pb-6">
                    <div className="ml-11 prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQFull;
