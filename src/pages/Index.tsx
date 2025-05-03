
import React from 'react';
import { AppStoreButton } from '@/components/AppStoreButton';
import { GooglePlayButton } from '@/components/GooglePlayButton';
import { FeatureItem } from '@/components/FeatureItem';
import { SpeedIcon, SecurityIcon, IntuitiveIcon } from '@/components/icons/FeatureIcons';
import { AppMockup } from '@/components/AppMockup';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6">
        <div className="container flex justify-between items-center">
          <div className="text-2xl font-bold">fastnow.app</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl font-bold leading-tight mb-6 animate-fade-in">
                Get things done,<br />
                <span className="text-primary">faster than ever.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-md">
                The minimalist productivity app designed to streamline your tasks and boost your efficiency in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <AppStoreButton />
                <GooglePlayButton />
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <AppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">Why choose fastnow.app?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem 
              title="Lightning Fast" 
              description="Complete tasks in seconds with our intuitive speed-focused interface."
              icon={<SpeedIcon className="w-8 h-8" />} 
            />
            <FeatureItem 
              title="Secure & Private" 
              description="Your data is encrypted and never shared with third parties."
              icon={<SecurityIcon className="w-8 h-8" />} 
            />
            <FeatureItem 
              title="Intuitive Design" 
              description="Minimal learning curve with our clean, user-friendly design."
              icon={<IntuitiveIcon className="w-8 h-8" />} 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to be more productive?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Download fastnow.app today and transform how you get things done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppStoreButton />
            <GooglePlayButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
