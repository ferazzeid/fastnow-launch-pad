import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <Card className={`p-8 bg-gradient-to-r from-background to-muted/20 ${className}`}>
      <div className="flex items-start space-x-6">
        <Avatar className="w-24 h-24 ring-2 ring-primary/20">
          <AvatarImage src={author.photo_url} alt={author.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {getInitials(author.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
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
          
          <p className="text-muted-foreground leading-relaxed">
            {author.bio}
          </p>
        </div>
      </div>
    </Card>
  );
};