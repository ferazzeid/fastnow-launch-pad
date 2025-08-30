import React, { useState, useEffect } from 'react';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { Music, Youtube, Instagram, Twitter, Facebook, Linkedin, MessageCircle, Tv, MapPin, MessageSquare } from 'lucide-react';

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  icon: string;
  displayName: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Music,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Tv,
  MapPin,
  MessageSquare
};

const SOCIAL_PLATFORMS = [
  { key: 'tiktok', name: 'TikTok', icon: 'Music', color: '#000000' },
  { key: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { key: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { key: 'twitter', name: 'X (Twitter)', icon: 'Twitter', color: '#000000' },
  { key: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { key: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { key: 'discord', name: 'Discord', icon: 'MessageCircle', color: '#5865F2' },
  { key: 'twitch', name: 'Twitch', icon: 'Tv', color: '#9146FF' },
  { key: 'pinterest', name: 'Pinterest', icon: 'MapPin', color: '#BD081C' },
  { key: 'reddit', name: 'Reddit', icon: 'MessageSquare', color: '#FF4500' }
];

const SocialMediaLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const settings = await SiteSettingsService.getSetting('social_media_links');
      if (settings && Array.isArray(settings)) {
        // Type guard and cast the settings to SocialMediaLink[]
        const validLinks = settings.filter((item: any): boolean => {
          return typeof item === 'object' && 
                 item !== null && 
                 'id' in item && 
                 'platform' in item && 
                 'url' in item && 
                 'isActive' in item;
        }).map((item: any) => item as SocialMediaLink);
        setSocialLinks(validLinks);
      }
    } catch (error) {
      console.error('Error loading social media links:', error);
    }
  };

  const validateUrl = (url: string, platform: string): boolean => {
    if (!url) return false;
    
    const platformPatterns: Record<string, RegExp> = {
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/,
      youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@)|youtu\.be\/)/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+/,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w.-]+/,
      facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w.-]+/
    };

    const pattern = platformPatterns[platform];
    return pattern ? pattern.test(url) : /^https?:\/\//.test(url);
  };

  // Filter active links with valid URLs
  const activeLinks = socialLinks.filter(link => 
    link.isActive && validateUrl(link.url, link.platform)
  );

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {activeLinks.map((link) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.key === link.platform);
        const IconComponent = iconMap[link.icon] || Music;
        
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-foreground transition-colors"
            aria-label={`Follow us on ${link.displayName}`}
            style={{
              color: 'currentColor'
            }}
          >
            <IconComponent className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;