import React from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink, Globe, Twitter, Linkedin } from 'lucide-react';

interface AuthorProfile {
  name: string;
  bio: string;
  photo_url?: string;
  social_links: {
    website?: string;
    twitter?: string;
    linkedin?: string;
  };
  custom_link?: {
    text: string;
    url: string;
  };
}

interface AuthorBoxProps {
  author: AuthorProfile;
  className?: string;
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({ author, className = '' }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const socialLinks = [
    {
      url: author.social_links.website,
      icon: Globe,
      label: 'Website'
    },
    {
      url: author.social_links.twitter,
      icon: Twitter,
      label: 'Twitter'
    },
    {
      url: author.social_links.linkedin,
      icon: Linkedin,
      label: 'LinkedIn'
    }
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <Card className={`bg-gradient-to-r from-background to-muted/20 overflow-hidden ${className}`}>
      <div className="flex items-start">
        {/* Square image container - fills left edge */}
        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0">
          <div className="w-full h-full rounded-l-lg overflow-hidden bg-muted">
            {author.photo_url ? (
              <img 
                src={author.photo_url} 
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs md:text-sm lg:text-lg">
                {getInitials(author.name)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              About {author.name}
            </h3>
            {socialLinks.length > 0 && (
              <div className="flex items-center space-x-2">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors duration-200 group"
                      aria-label={`${author.name}'s ${link.label}`}
                    >
                      <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-3">
            {author.bio}
          </p>

          {/* Custom link */}
          {author.custom_link && author.custom_link.text && author.custom_link.url && (
            <a
              href={author.custom_link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              {author.custom_link.text}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};