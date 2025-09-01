import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModernFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
  className?: string;
}

export const ModernFeatureCard: React.FC<ModernFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  gradient = 'from-primary/10 to-primary/5',
  className = ''
}) => {
  return (
    <Link to={href} className="group block h-full">
      <Card className={`h-full border-0 bg-gradient-to-br ${gradient} backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${className}`}>
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <ArrowRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};