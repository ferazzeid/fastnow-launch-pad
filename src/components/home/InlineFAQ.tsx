import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface InlineFAQItem { q: string; a: string }

interface InlineFAQProps {
  title?: string;
  items?: InlineFAQItem[];
  defaultOpenIndex?: number;
}

export const InlineFAQ: React.FC<InlineFAQProps> = ({
  title = 'Quick FAQ',
  items,
  defaultOpenIndex = 0,
}) => {
  const fallbackItem: InlineFAQItem = {
    q: 'How do I track progress using clothing fit?',
    a: 'Choose one pair of jeans or a t-shirt and use it as your reference.\nWear it weekly at the same time of day. Notice how it fits—tighter, same, or looser.\nThis keeps focus on real-world change rather than daily scale swings.'
  };
  const list = items && items.length > 0 ? items : [fallbackItem];
  const defaultValue = list[defaultOpenIndex] ? `q${defaultOpenIndex + 1}` : undefined;

  return (
    <section aria-labelledby="faq" className="py-12 border-t animate-fade-in">
      <div className="container max-w-3xl mx-auto">
        <h2 id="faq" className="text-2xl md:text-3xl font-semibold mb-4">{title}</h2>
        <Accordion type="single" collapsible defaultValue={defaultValue}>
          {list.map((item, idx) => (
            <AccordionItem key={idx} value={`q${idx + 1}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default InlineFAQ;
