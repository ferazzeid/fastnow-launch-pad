import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const AboutMeSection: React.FC = () => {
  const [title, setTitle] = useState('About Me — The personal journey behind FastNow');
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
          console.log('About me data loaded:', data);
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
          
          console.log('Processed about me map:', map);
          
          if (map.about_me_title) setTitle(map.about_me_title);
          if (map.about_me_subtitle) setSubtitle(map.about_me_subtitle);
          if (map.about_me_content) setContent(map.about_me_content);
          if (map.about_me_image_url) setImageUrl(map.about_me_image_url);
        } else if (error) {
          console.error('About me load error:', error);
        }
      } catch (e) {
        console.error('About me load error:', e);
      }
    };
    load();
  }, []);
  const full = content || '';
  const cutoff = Math.ceil(full.length / 3);
  const shown = showFull ? full : full.slice(0, cutoff);

  return (
    <section id="about-me" className="py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {imageUrl && (
          <div className="flex justify-center mb-8">
            <img
              src={imageUrl}
              alt={`${title} photo`}
              className="w-24 h-24 rounded-full object-cover shadow-md"
              loading="lazy"
            />
          </div>
        )}

        {content ? (
          <div className="space-y-4">
            {shown.split('\n\n').map((p, i) => (
              <div key={i} className={i % 2 === 0 ? 'max-w-3xl' : 'max-w-3xl ml-auto'}>
                <div className="rounded-2xl bg-muted p-5 shadow-sm animate-fade-in">
                  <p className="text-foreground leading-relaxed">{p}</p>
                </div>
              </div>
            ))}
            {full.length > cutoff && (
              <div className="text-center mt-4">
                <Button variant="secondary" onClick={() => setShowFull(!showFull)}>
                  {showFull ? 'Show less' : 'Read full story'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Content coming soon.</div>
        )}
      </div>
    </section>
  );
};

export default AboutMeSection;
