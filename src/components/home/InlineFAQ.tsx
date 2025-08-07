import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const InlineFAQ: React.FC = () => {
  const question = 'How do I track progress using clothing fit?';
  const answer = `Choose one pair of jeans or a t-shirt and use it as your reference. 
Wear it weekly at the same time of day. Notice how it fits—tighter, same, or looser. 
This keeps focus on real-world change rather than daily scale swings.`;

  return (
    <section aria-labelledby="faq" className="py-12 border-t animate-fade-in">
      <div className="container max-w-3xl mx-auto">
        <h2 id="faq" className="text-2xl md:text-3xl font-semibold mb-4">Quick FAQ</h2>
        <Accordion type="single" collapsible defaultValue="q1">
          <AccordionItem value="q1">
            <AccordionTrigger className="text-left">{question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{answer}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default InlineFAQ;
