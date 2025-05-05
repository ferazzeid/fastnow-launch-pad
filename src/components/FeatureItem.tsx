
import React from 'react';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon, className = "" }) => {
  return (
    <div className={`bg-cream-100 p-10 rounded-3xl shadow-soft h-full ${className}`}>
      <div className="feature-icon mb-8 flex justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-mint-600 text-center">{title}</h3>
      <p className="text-mint-500 text-center text-lg">{description}</p>
    </div>
  );
};
