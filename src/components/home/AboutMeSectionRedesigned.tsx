import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const AboutMeSectionRedesigned: React.FC = () => {
  const [title, setTitle] = useState('About Me');
  const [subtitle, setSubtitle] = useState('The personal journey behind FastNow');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content', 'about_me_image_url']);
        if (!error && data) {
          const map = data.reduce((acc, item) => {
            let v = item.setting_value;
            // Handle different data formats
            if (typeof v === 'string') {
              try { 
                // Try to parse JSON, but if it fails, use the string directly
                v = JSON.parse(v); 
              } catch { 
                // If JSON parsing fails, use the string as-is
              }
            }
            acc[item.setting_key] = v;
            return acc;
          }, {} as Record<string, any>);
          
          if (map.about_me_title) setTitle(map.about_me_title);
          if (map.about_me_subtitle) setSubtitle(map.about_me_subtitle);
          if (map.about_me_content) setContent(map.about_me_content);
          if (map.about_me_image_url) setImageUrl(map.about_me_image_url);
        }
      } catch (e) {
        console.error('About me load error:', e);
      }
    };
    load();
  }, []);

  // Don't render if no content
  if (!content) return null;

  const full = content || '';
  const cutoff = Math.ceil(full.length / 3);
  const shown = showFull ? full : full.slice(0, cutoff);

  return (
    <section id="about-me" className="py-12 border-t">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-4xl">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${title} photo`}
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            </div>
          </div>

          <div className="space-y-4">
            {shown.split('\n\n').map((p, i) => (
              <div key={i} className="max-w-4xl">
                <div className="rounded-lg bg-muted/50 p-6 shadow-sm">
                  <p className="text-foreground leading-relaxed">{p}</p>
                </div>
              </div>
            ))}
            {full.length > cutoff && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => setShowFull(!showFull)}>
                  {showFull ? 'Show less' : 'Read full story'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSectionRedesigned;