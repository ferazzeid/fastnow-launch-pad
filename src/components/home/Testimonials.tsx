import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialItem {
  id: string;
  author_name: string;
  author_role?: string | null;
  content: string;
  rating?: number | null;
  avatar_url?: string | null;
}

const StarRating: React.FC<{ value?: number | null }> = ({ value = 5 }) => {
  const count = Math.max(0, Math.min(5, value || 0));
  return (
    <div aria-label={`${count} out of 5 stars`} className="text-primary">
      {'★★★★★☆☆☆☆☆'.slice(5 - count, 10 - count)}
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!error && data) setItems(data as TestimonialItem[]);
    };
    load();
  }, []);

  if (!items.length) return null;

  return (
    <section aria-label="Testimonials" className="py-16 bg-muted/30">
      <div className="container">
        <header className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">What People Say</h2>
          <p className="text-muted-foreground mt-2">Real results from real people</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.id} className="h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <StarRating value={t.rating} />
                <p className="text-foreground leading-relaxed">{t.content}</p>
                <div className="flex items-center gap-3 mt-auto">
                  {t.avatar_url && (
                    <img
                      src={t.avatar_url}
                      alt={`${t.author_name} avatar`}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-medium">{t.author_name}</p>
                    {t.author_role && (
                      <p className="text-sm text-muted-foreground">{t.author_role}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
