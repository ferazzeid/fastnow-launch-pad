import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialProofItem {
  id: string;
  source_name: string;
  metric_value: string;
  metric_label: string;
  logo_url?: string | null;
  url?: string | null;
}

const SocialProofStrip: React.FC = () => {
  const [items, setItems] = useState<SocialProofItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('social_proof')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!error && data) setItems(data as SocialProofItem[]);
    };
    load();
  }, []);

  if (!items.length) return null;

  return (
    <aside aria-label="Social proof" className="border-y bg-muted/30">
      <div className="container py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.logo_url && (
                <img
                  src={item.logo_url}
                  alt={`${item.source_name} logo`}
                  loading="lazy"
                  className="h-8 w-8 rounded object-contain"
                />
              )}
              <div>
                <p className="text-sm text-muted-foreground">{item.source_name}</p>
                <p className="font-semibold">
                  {item.metric_value}{' '}
                  <span className="text-muted-foreground font-normal">{item.metric_label}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SocialProofStrip;
