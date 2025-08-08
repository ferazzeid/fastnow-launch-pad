import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AboutMeSection: React.FC = () => {
  const [title, setTitle] = useState('About Me');
  const [subtitle, setSubtitle] = useState('The story behind the FastNow Protocol');
  const [content, setContent] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content']);
        if (!error && data) {
          const map = data.reduce((acc, item) => {
            const v = item.setting_value;
            if (typeof v === 'string') {
              try { acc[item.setting_key] = JSON.parse(v); } catch { acc[item.setting_key] = v; }
            } else if (v && typeof v === 'object') { acc[item.setting_key] = String(v); }
            else { acc[item.setting_key] = v ? String(v) : ''; }
            return acc;
          }, {} as Record<string, string>);
          setTitle(map.about_me_title || title);
          setSubtitle(map.about_me_subtitle || subtitle);
          setContent(map.about_me_content || content);
        }
      } catch (e) {
        console.error('About me load error:', e);
      }
    };
    load();
  }, []);

  return (
    <section id="about-me" className="py-12 border-t">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {content ? (
          <div className="prose max-w-none text-muted-foreground">
            {content.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Content coming soon.</div>
        )}
      </div>
    </section>
  );
};

export default AboutMeSection;
