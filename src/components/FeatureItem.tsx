
import React from 'react';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon, className = "" }) => {
  return (
    <div className={`flex flex-col items-center text-center p-8 ${className}`}>
      <div className="bg-secondary rounded-full p-6 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
};
